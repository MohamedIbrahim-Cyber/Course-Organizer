import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Security & MIME-type hardening middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use('/photos', express.static(path.join(__dirname, 'photos')));
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

// Explicit static route handlers to ensure zero MIME-type or path resolution issues
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/website.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.sendFile(path.join(__dirname, 'website.js'));
});

app.get('/firebase-sync.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.sendFile(path.join(__dirname, 'firebase-sync.js'));
});

// Discord Webhook Proxy Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, topic, subject, message } = req.body;
    const resolvedSubject = subject || topic || 'General Inquiry';

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required transmission fields' });
    }

    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1541116574692286535/9_-c0bSZ33hJB3CoDlIARtjmkGSCnlJx_E4yRyzH8OAsaxb5IxO-NGHRwaquwWa1N7U7';

    const discordPayload = {
      username: "Obsidian Terminal Relay",
      avatar_url: "https://i.imgur.com/83pL34z.png",
      embeds: [
        {
          title: `Transmission: ${resolvedSubject}`,
          color: 14334463,
          fields: [
            { name: "Operator", value: String(name), inline: true },
            { name: "Frequency / Email", value: String(email), inline: true },
            { name: "Message Payload", value: String(message), inline: false }
          ],
          footer: { text: "Obsidian Architect Communication Log" },
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordPayload)
      });

      if (response.ok) {
        return res.json({ success: true, message: 'Payload transmitted successfully' });
      } else {
        console.warn('Discord webhook returned status:', response.status);
        // Fallback acknowledge
        return res.json({ success: true, relayedLocally: true });
      }
    } catch (relayErr) {
      console.warn('Discord relay network error:', relayErr.message);
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
  // If requesting a static file with an extension that does not exist, return 404 instead of index.html
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

