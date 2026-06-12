/**
 * Discord webhook notifications (mirrors notify.php)
 */
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const WEBHOOK_APPS = process.env.DISCORD_WEBHOOK_APPS || WEBHOOK_URL;

async function sendWebhook(url, payload) {
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('[ExtoArts] Discord webhook error:', e.message);
  }
}

export async function notifyNewRegistration(username, email, role) {
  const roleLabel = role === 'editor' ? 'Editor applicant' : 'New client';
  await sendWebhook(WEBHOOK_URL, {
    embeds: [{
      title: `${roleLabel} registered`,
      color: role === 'editor' ? 0xf59e0b : 0x22d3ee,
      fields: [
        { name: 'Username', value: username, inline: true },
        { name: 'Email', value: email, inline: true },
        { name: 'Role', value: role, inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
  });
}

export async function notifyNewApplication(username, email, role) {
  await sendWebhook(WEBHOOK_APPS, {
    embeds: [{
      title: 'New editor application',
      color: 0xf59e0b,
      fields: [
        { name: 'Username', value: username, inline: true },
        { name: 'Email', value: email, inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
  });
}
