// Vercel Serverless Function: /api/register
// Chuyển tiếp dữ liệu đăng ký học viên từ Landing Page vào Google Sheet

const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbwlYK0UcsFwZStFfjWhMUcT-62HDwJx32_kCtYfuaNYqnI9ebD9T1lOzkGu9PYkBSRX/exec";

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    let data = req.body || {};
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        data = { raw: req.body };
      }
    }

    // Gửi tiếp đến Google Apps Script Webhook
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        redirect: 'follow'
      }).catch(err => console.error("Forward error to Google Sheet:", err));
    }

    return res.status(200).json({
      ok: true,
      message: 'Đã nhận thông tin đăng ký thành công!',
      received_at: new Date().toISOString()
    });

  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
