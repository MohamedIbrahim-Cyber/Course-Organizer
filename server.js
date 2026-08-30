import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Trust proxy for accurate client IP resolution behind Cloud Run / Vercel / Nginx
app.set('trust proxy', 1);

// Security & MIME-type hardening middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Content Security Policy allowing Google Fonts, Cloudflare Turnstile, and local assets
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none';"
  );
  next();
});

// Strict body payload limit (10kb prevents JSON bomb memory allocation)
app.use(express.json({ limit: '10kb' }));

// Static asset caching & delivery
app.use('/photos', express.static(path.join(__dirname, 'photos'), {
  maxAge: '1d'
}));

app.use(express.static(__dirname, {
  dotfiles: 'ignore',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Explicit static route handlers
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/website.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'website.js'));
});

// --------------------------------------------------------------------------
// TASK 1: Hardened Contact Relay Endpoint & Bot Defense
// --------------------------------------------------------------------------

// Strict Per-IP Rate Limiting: Max 3 requests per 15 minutes
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Transmission rate limit exceeded. You may only send 3 messages every 15 minutes.'
  }
});

// Helper: Origin & Referer Verification
function validateOrigin(req) {
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const host = req.headers['host'];

  const allowedEnv = process.env.ALLOWED_ORIGIN;
  const allowedOrigins = allowedEnv
    ? allowedEnv.split(',').map(o => o.trim().toLowerCase())
    : [];

  if (host) {
    allowedOrigins.push(host.toLowerCase());
  }

  // If origin is present, ensure it matches allowed hosts
  if (origin) {
    const originHostname = new URL(origin).host.toLowerCase();
    const isAllowed = allowedOrigins.some(allowed => originHostname === allowed || origin.toLowerCase().includes(allowed));
    if (!isAllowed) return false;
  }

  // If referer is present, verify host
  if (referer) {
    try {
      const refererHost = new URL(referer).host.toLowerCase();
      const isAllowed = allowedOrigins.some(allowed => refererHost === allowed || referer.toLowerCase().includes(allowed));
      if (!isAllowed) return false;
    } catch {
      return false;
    }
  }

  return true;
}

// Helper: Cloudflare Turnstile Server-Side Verification
async function verifyTurnstileToken(token, clientIp) {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // In dev / unconfigured environments, pass verification if no secret key set
    return { success: true };
  }

  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Missing or malformed Turnstile verification token.' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (clientIp) formData.append('remoteip', clientIp);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller.signal
    });

    clearTimeout(timeout);
    const data = await result.json();
    return { success: Boolean(data.success), error: data['error-codes']?.join(', ') };
  } catch (err) {
    console.error('Turnstile verification network failure:', err.message);
    // Fail closed on security verification errors if secret key is actively enforced
    return { success: false, error: 'Verification service unreachable.' };
  }
}

// Helper: Discord Markdown & Mention Defanger
function defangDiscordPayload(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/@everyone/gi, '@\u200beveryone')
    .replace(/@here/gi, '@\u200bhere')
    .replace(/<@&?(\d+)>/g, '<@\u200b$1>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/gi, '$1 ($2)');
}

// Hardened Discord Webhook Proxy Endpoint
app.post('/api/contact', contactRateLimiter, async (req, res) => {
  try {
    // 1. Origin & Referer Verification
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Untrusted origin or referer header.' });
    }

    const { name, email, topic, subject, message, turnstileToken, cf_turnstile_response } = req.body || {};

    // 2. Bot Defense & Turnstile Token Verification
    const token = turnstileToken || cf_turnstile_response || req.body['cf-turnstile-response'];
    const clientIp = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim();
    const turnstileCheck = await verifyTurnstileToken(token, clientIp);

    if (!turnstileCheck.success) {
      return res.status(403).json({
        error: 'Automated bot verification failed. Please complete the security check and retry.',
        details: turnstileCheck.error
      });
    }

    // 3. Strict Payload Validation & Bounds Enforcement
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid field types. Expected string payloads.' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const rawSubject = subject || topic || 'General Inquiry';
    const trimmedSubject = typeof rawSubject === 'string' ? rawSubject.trim() : 'General Inquiry';
    const trimmedMessage = message.trim();

    // Bounds checking
    if (trimmedName.length < 2 || trimmedName.length > 60) {
      return res.status(400).json({ error: 'Name must be between 2 and 60 characters.' });
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (trimmedEmail.length > 100 || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email address format or length exceeds 100 characters.' });
    }

    if (trimmedSubject.length > 120) {
      return res.status(400).json({ error: 'Subject cannot exceed 120 characters.' });
    }

    if (trimmedMessage.length < 1 || trimmedMessage.length > 1500) {
      return res.status(400).json({ error: 'Message payload must be between 1 and 1,500 characters.' });
    }

    // 4. Discord Sanitization / Defanging
    const safeName = defangDiscordPayload(trimmedName);
    const safeEmail = defangDiscordPayload(trimmedEmail);
    const safeSubject = defangDiscordPayload(trimmedSubject);
    const safeMessage = defangDiscordPayload(trimmedMessage);

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      console.warn('DISCORD_WEBHOOK_URL is not configured. Transmission accepted and logged locally.');
      return res.json({ success: true, relayedLocally: true, message: 'Transmission logged locally (webhook unconfigured).' });
    }

    const discordPayload = {
      username: "Obsidian Terminal Relay",
      avatar_url: "https://i.imgur.com/83pL34z.png",
      embeds: [
        {
          title: `Transmission: ${safeSubject.slice(0, 100)}`,
          color: 14334463,
          fields: [
            { name: "Operator", value: safeName.slice(0, 60), inline: true },
            { name: "Frequency / Email", value: safeEmail.slice(0, 100), inline: true },
            { name: "Message Payload", value: safeMessage.slice(0, 1024), inline: false }
          ],
          footer: { text: "Obsidian Architect Communication Log • Verified Relay" },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // 5. Outbound Relay with AbortSignal Timeout Guard
    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload),
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return res.json({ success: true, message: 'Payload transmitted successfully' });
      } else {
        console.warn('Discord webhook returned status:', response.status);
        return res.json({ success: true, relayedLocally: true });
      }
    } catch (relayErr) {
      console.warn('Discord relay outbound error:', relayErr.message);
      return res.json({ success: true, relayedLocally: true });
    }
  } catch (err) {
    console.error('API Contact error:', err);
    res.status(500).json({ error: 'Internal server error processing payload' });
  }
});

// Clean URL handlers
app.get(['/classes', '/classes.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'classes.html'));
});

app.get(['/add-class', '/add%20class.html', '/add class.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'add class.html'));
});

app.get(['/contact', '/contact-us', '/contact%20us.html', '/contact us.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'contact us.html'));
});

app.get(['/', '/index.html', '/home'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
  if (req.path.includes('.') && !req.path.endsWith('.html')) {
    return res.status(404).send('Asset not found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Obsidian Architect Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
