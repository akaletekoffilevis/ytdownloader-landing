const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Champs manquants' });
    }

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:linear-gradient(135deg,#007aff,#0a84ff);padding:24px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">YT Downloader - Contact</h1>
        </div>
        <div style="background:#f5f5f7;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e5ea">
          <p style="margin:0 0 8px;color:#8e8e93;font-size:12px;text-transform:uppercase;font-weight:600">De</p>
          <p style="margin:0 0 16px;font-size:15px;color:#1c1c1e"><strong>${name}</strong> &lt;${email}&gt;</p>
          <p style="margin:0 0 8px;color:#8e8e93;font-size:12px;text-transform:uppercase;font-weight:600">Sujet</p>
          <p style="margin:0 0 16px;font-size:15px;color:#1c1c1e">${subject || 'Sans sujet'}</p>
          <p style="margin:0 0 8px;color:#8e8e93;font-size:12px;text-transform:uppercase;font-weight:600">Message</p>
          <div style="background:#fff;padding:16px;border-radius:8px;border:1px solid #e5e5ea;font-size:14px;color:#1c1c1e;line-height:1.5">${message.replace(/\n/g, '<br>')}</div>
        </div>
        <p style="text-align:center;color:#aeaeb2;font-size:11px;margin-top:16px">Envoyé depuis le site YT Downloader</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"YT Downloader" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `[YT Downloader] ${subject || 'Contact'}`,
      text: `De: ${name} <${email}>\nSujet: ${subject}\n\n${message}`,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[CONTACT]', err.message);
    return res.status(500).json({ ok: false, error: 'Erreur lors de l\'envoi' });
  }
};
