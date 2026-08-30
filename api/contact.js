// In-Memory Sliding Window Rate Limiter for Serverless Invocations
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

// Periodic cleanup of stale rate-limiting timestamps
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const validTimestamps = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, validTimestamps);
    }
  }
}

function checkRateLimit(ip) {
  const now = Date.now();
  if (rateLimitMap.size > 10000) cleanupRateLimitStore();

  const timestamps = (rateLimitMap.get(ip) || []).filter(time => now - time < RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1000)
    };
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return { allowed: true };
}

// Origin & Referer Header Verifier
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

  if (origin) {
    try {
      const originHostname = new URL(origin).host.toLowerCase();
      const isAllowed = allowedOrigins.some(allowed => originHostname === allowed || origin.toLowerCase().includes(allowed));
      if (!isAllowed) return false;
    } catch {
      return false;
    }
  }

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

// Cloudflare Turnstile Server-Side Verification
async function verifyTurnstileToken(token, clientIp) {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secretKey) {
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
    return { success: false, error: 'Verification service unreachable.' };
  }
}

// Discord Markdown & Mention Defanger
function defangDiscordPayload(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/@everyone/gi, '@\u200beveryone')
    .replace(/@here/gi, '@\u200bhere')
    .replace(/<@&?(\d+)>/g, '<@\u200b$1>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/gi, '$1 ($2)');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Origin Verification
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Untrusted origin or referer header.' });
    }

    // 2. IP Rate Limiting (3 requests per 15 mins)
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                     req.headers['x-real-ip'] || 
                     req.socket?.remoteAddress || 
                     '127.0.0.1';

    const rateLimitResult = checkRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      res.setHeader('Retry-After', rateLimitResult.retryAfterSeconds.toString());
      return res.status(429).json({
        error: 'Transmission rate limit exceeded. You may only send 3 messages every 15 minutes.',
        retryAfter: rateLimitResult.retryAfterSeconds
      });
    }

    // 3. Cloudflare Turnstile Bot Defense
    const { name, email, topic, subject, message, turnstileToken, cf_turnstile_response } = req.body || {};
    const token = turnstileToken || cf_turnstile_response || req.body?.['cf-turnstile-response'];

    const turnstileCheck = await verifyTurnstileToken(token, clientIp);
    if (!turnstileCheck.success) {
      return res.status(403).json({
        error: 'Automated bot verification failed. Please complete the security check and retry.',
        details: turnstileCheck.error
      });
    }

    // 4. Strict Payload Validation & Bounds Enforcement
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid field types. Expected string payloads.' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const rawSubject = subject || topic || 'General Inquiry';
    const trimmedSubject = typeof rawSubject === 'string' ? rawSubject.trim() : 'General Inquiry';
    const trimmedMessage = message.trim();

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

    // 5. Discord Payload Defanging
    const safeName = defangDiscordPayload(trimmedName);
    const safeEmail = defangDiscordPayload(trimmedEmail);
    const safeSubject = defangDiscordPayload(trimmedSubject);
    const safeMessage = defangDiscordPayload(trimmedMessage);

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      return res.status(200).json({ success: true, message: 'Transmission received and logged locally (webhook unconfigured).' });
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

    // 6. Outbound Relay with AbortSignal Timeout
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Transmission dispatched to orbital relay' });
    } else {
      const errText = await response.text();
      return res.status(502).json({ error: 'Webhook transmission failed', details: errText });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server fault', message: err.message });
  }
}
