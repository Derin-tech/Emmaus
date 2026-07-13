import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { otpPlatform } from '@/lib/otp-platform';

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

    // Dispatch via our centralized OTP Platform service (`Fast2SMS`, `Twilio`, `Telegram`, `Webhook`, or `Dev Mode`)
    const dispatchResult = await otpPlatform.dispatchOtp(cleanedPhone, otp);

    return NextResponse.json({
      success: true,
      message: dispatchResult.realSmsSent
        ? `OTP sent to your mobile (+91-${cleanedPhone}) via ${dispatchResult.providerName}`
        : 'Simulated OTP dispatched (Developer Mode)',
      redirectUrl: '/verify-otp',
      devOtp: !dispatchResult.realSmsSent ? otp : null, // Only show on screen if real SMS/Telegram/Webhook was not sent
      otpExpiry,
      phoneNumber: cleanedPhone,
      realSmsSent: dispatchResult.realSmsSent,
      smsProvider: dispatchResult.providerName,
      smsError: dispatchResult.error || null
    }, { status: 200 });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}
