import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email query parameter missing from OAuth callback payload' }, { status: 400 });
    }

    // Strict validation check: if the email does not end exactly with @cet.ac.in, immediately reject the login.
    if (!email.toLowerCase().endsWith('@cet.ac.in')) {
      // Do not create a database record. Return a 403 Forbidden HTTP status and redirect the user to an error page.
      // If requested by browser directly, we redirect to /auth/error with 403 status or redirect url
      const errorUrl = new URL('/auth/error?reason=access_restricted', request.url);
      return NextResponse.redirect(errorUrl, { status: 303 });
    }

    // Domain check passed: create DB record with account_status set to pending
    let user = db.getUserByEmail(email);
    if (!user) {
      user = db.createUser(email);
    }

    const cookieStore = await cookies();

    if (user.account_status === 'pending') {
      cookieStore.set('emmaus_pending_user_id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      const redirectUrl = new URL('/complete-profile', request.url);
      return NextResponse.redirect(redirectUrl);
    } else {
      cookieStore.set('emmaus_session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
