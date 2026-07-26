const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Twilio Voice Call (Automated AI voice) - SMS ki jagah Voice Call
    await client.calls.create({
      url: `http://twimlets.com/message?Message[0]=Your%20VoxLink%20verification%20code%20is%20${otp.split('').join('%20')}`,
      to: phoneNumber,
      from: twilioPhoneNumber
    });

    res.status(200).json({ success: true, message: 'OTP sent via Voice Call' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP: ' + error.message });
  }
}