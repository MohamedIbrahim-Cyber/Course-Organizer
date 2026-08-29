export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, topic, subject, message } = req.body || {};
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

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
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
