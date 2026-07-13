import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('emmaus_session')?.value;
    const pendingId = cookieStore.get('emmaus_pending_user_id')?.value;

    const id = sessionId || pendingId;
    if (!id) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const user = db.getUserById(id);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        cet_email: user.cet_email,
        phone_number: user.phone_number,
        account_status: user.account_status,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get Session Error:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
