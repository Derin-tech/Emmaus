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
      return NextResponse.json({ error: 'Unauthorized: No session found.' }, { status: 401 });
    }

    const user = db.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    if (!user.otp_hash || !user.otp_expiry) {
      return NextResponse.json({ error: 'No OTP found. Please request a new code.' }, { status: 400 });
    }

    // Check expiration timestamp
    const now = new Date();
    const expiry = new Date(user.otp_expiry);
    if (now > expiry) {
      return NextResponse.json({ error: 'OTP has expired (5 minutes limit reached). Please click "Resend OTP" below to get a new code.', expired: true }, { status: 400 });
    }

    const body = await request.json();
    const { otp } = body;

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit OTP code.' }, { status: 400 });
    }

    // Verify code against hashed database value
    const isMatch = await bcrypt.compare(otp.trim(), user.otp_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid OTP code. Please try again.' }, { status: 400 });
    }

    // Valid code! Update account_status to active
    const activeUser = db.activateUser(user.id);
    if (!activeUser) {
      return NextResponse.json({ error: 'Failed to activate user account.' }, { status: 500 });
    }

    // Issue final session token/cookie and clear pending cookie
    cookieStore.set('emmaus_session', activeUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    if (pendingUserId) {
      cookieStore.delete('emmaus_pending_user_id');
    }

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully!',
      status: 'active',
      redirectUrl: '/dashboard',
      user: { id: activeUser.id, cet_email: activeUser.cet_email, account_status: activeUser.account_status }
    }, { status: 200 });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 });
  }
}
