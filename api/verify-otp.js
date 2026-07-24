export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { otpCode } = req.body;
  // Demo purpose: agar OTP 6 digits ka hai toh verify maan lo
  if (otpCode && otpCode.length === 6) {
    res.status(200).json({ success: true, verified: true });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
}
