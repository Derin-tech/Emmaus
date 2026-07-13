import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Strict domain validation check: MUST end exactly with @cet.ac.in
    if (!email.toLowerCase().endsWith('@cet.ac.in')) {
      // Immediately reject login. Do NOT create a database record.
      // Return 403 Forbidden HTTP status.
      return NextResponse.json(
        { 
          error: 'Access restricted to CET students.',
          redirectUrl: '/auth/error?reason=access_restricted'
        }, 
        { status: 403 }
      );
    }

    // Domain check passed: create/retrieve DB record
    let user = db.getUserByEmail(email);
    if (!user) {
      user = db.createUser(email);
    }

    const cookieStore = await cookies();

    if (user.account_status === 'pending') {
      // Do not grant access to main app yet. Redirect to Complete Profile.
      cookieStore.set('emmaus_pending_user_id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({
        success: true,
        status: 'pending',
        redirectUrl: '/complete-profile',
        user: { id: user.id, cet_email: user.cet_email, account_status: user.account_status }
      }, { status: 200 });
    } else {
      // User is already active, issue final session token
      cookieStore.set('emmaus_session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        status: 'active',
        redirectUrl: '/dashboard',
        user: { id: user.id, cet_email: user.cet_email, account_status: user.account_status }
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Primary Auth Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
