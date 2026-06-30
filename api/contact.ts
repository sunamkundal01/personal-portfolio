// Vercel serverless function — receives contact-form submissions and emails them
// to Sunam via the Resend API, so the API key stays on the server and is never
// shipped to the browser.
//
// Setup:
//   1. Create a free account at https://resend.com (sign up with kundalsunam@gmail.com
//      so you can receive mail without verifying a custom domain).
//   2. Create an API key and add it to your Vercel project env as RESEND_API_KEY
//      (Settings → Environment Variables). Add it to a local .env to test with `vercel dev`.
//   3. (Optional) Verify your own domain in Resend and set CONTACT_FROM to an address
//      on it (e.g. "Portfolio <contact@yourdomain.com>") to send from your own domain.
//
// Without a verified domain, Resend only delivers to the email you signed up with,
// which is exactly kundalsunam@gmail.com — so the default below works out of the box.

const CONTACT_TO = process.env.CONTACT_TO || 'kundalsunam@gmail.com';
// onboarding@resend.dev is Resend's shared test sender; it can only deliver to the
// account owner's own email. Override with a verified-domain address via CONTACT_FROM.
const CONTACT_FROM = process.env.CONTACT_FROM || 'Portfolio Contact <onboarding@resend.dev>';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing RESEND_API_KEY.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const name = (body?.name ?? '').toString().trim().slice(0, 100);
    const email = (body?.email ?? '').toString().trim().slice(0, 200);
    const message = (body?.message ?? '').toString().trim().slice(0, 5000);

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Please fill in your name, email, and message.' });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `New message from your portfolio contact form\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
        html: `
          <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color:#0ea5e9; margin-bottom: 4px;">New portfolio message</h2>
            <p style="color:#64748b; margin-top:0;">Sent from your contact form</p>
            <table style="width:100%; border-collapse:collapse; margin:16px 0;">
              <tr><td style="padding:6px 0; color:#475569; width:80px;"><strong>Name</strong></td><td style="padding:6px 0;">${safeName}</td></tr>
              <tr><td style="padding:6px 0; color:#475569;"><strong>Email</strong></td><td style="padding:6px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            </table>
            <div style="background:#f1f5f9; border-radius:12px; padding:16px; color:#0f172a; line-height:1.6;">${safeMessage}</div>
          </div>
        `,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok || data?.error) {
      const detail = data?.error?.message || data?.message || 'Upstream error.';
      res.status(502).json({ error: detail });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
}
