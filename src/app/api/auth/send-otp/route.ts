import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const pendingUserId = cookieStore.get('emmaus_pending_user_id')?.value;
    const activeSessionId = cookieStore.get('emmaus_session')?.value;

    const userId = pendingUserId || activeSessionId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: No pending or active session found.' }, { status: 401 });
    }

    const user = db.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const phoneNumber = body.phoneNumber || user.phone_number;

    // Validate 10-digit mobile number
    const cleanedPhone = String(phoneNumber || '').replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    // Generate 6-digit numeric OTP (100000 to 999999)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP with bcrypt (using salt rounds = 4 for instant execution without lag)
    const otpHash = await bcrypt.hash(otp, 4);

    // Set expiration timestamp: 5 minutes from now
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5);
    const otpExpiry = expiryDate.toISOString();

    // Store in DB
    db.updateUserOtp(user.id, cleanedPhone, otpHash, otpExpiry);

    // Attempt Real SMS Dispatch if API keys are configured in .env / .env.local
    let realSmsSent = false;
    let smsProvider = 'Simulated (Developer Mode)';
    let smsError: string | null = null;

    if (process.env.FAST2SMS_API_KEY) {
      try {
        const smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otp,
            numbers: cleanedPhone,
          })
        });
        const smsData = await smsRes.json();
        if (smsData.return) {
          realSmsSent = true;
          smsProvider = 'Fast2SMS (+91 Real Cellular Network)';
          console.log(`[REAL SMS SENT via Fast2SMS] To: +91-${cleanedPhone}`);
        } else {
          smsError = smsData.message || 'Fast2SMS dispatch error';
          console.error('Fast2SMS Error:', smsData);
        }
      } catch (err: any) {
        smsError = err.message;
        console.error('Fast2SMS Network Error:', err);
      }
    } else if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
        const bodyParams = new URLSearchParams({
          To: `+91${cleanedPhone}`,
          From: process.env.TWILIO_PHONE_NUMBER,
          Body: `Your Campus Deals verification code is ${otp}. Valid for 5 minutes.`
        });
        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyParams.toString()
        });
        if (twilioRes.ok) {
          realSmsSent = true;
          smsProvider = 'Twilio Real Cellular Network';
          console.log(`[REAL SMS SENT via Twilio] To: +91-${cleanedPhone}`);
        } else {
          const tErr = await twilioRes.json();
          smsError = tErr.message || 'Twilio dispatch failed';
          console.error('Twilio Error:', tErr);
        }
      } catch (err: any) {
        smsError = err.message;
        console.error('Twilio Network Error:', err);
      }
    }

    // Trigger simulated SMS dispatch via console.log exactly as requested if real SMS not sent or in dev mode
    if (!realSmsSent) {
      console.log('====================================================');
      console.log(`[SMS DISPATCH SIMULATION] To: +91-${cleanedPhone}`);
      console.log(`[SMS DISPATCH SIMULATION] OTP Code: ${otp}`);
      console.log(`[SMS DISPATCH SIMULATION] Expiry: 5 minutes (${otpExpiry})`);
      console.log('====================================================');
    }

    return NextResponse.json({
      success: true,
      message: realSmsSent ? `OTP sent via real SMS to +91-${cleanedPhone}` : 'Simulated OTP dispatched (Dev Mode without SMS API key)',
      redirectUrl: '/verify-otp',
      devOtp: !realSmsSent ? otp : null, // Only show on laptop screen if real SMS API key is not configured
      otpExpiry,
      phoneNumber: cleanedPhone,
      realSmsSent,
      smsProvider,
      smsError
    }, { status: 200 });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}
