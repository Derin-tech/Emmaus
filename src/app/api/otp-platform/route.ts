import { NextResponse } from 'next/server';
import { otpPlatform, OtpPlatformSettings } from '@/lib/otp-platform';

export async function GET() {
  try {
    const settings = otpPlatform.getSettings();
    return NextResponse.json({ success: true, settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch OTP platform settings.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, settings, phoneNumber } = body;

    if (action === 'save') {
      if (!settings) {
        return NextResponse.json({ error: 'Settings object required for save action.' }, { status: 400 });
      }
      const updated = otpPlatform.saveSettings(settings);
      return NextResponse.json({
        success: true,
        message: 'OTP Platform configuration saved successfully!',
        settings: updated
      }, { status: 200 });
    } else if (action === 'test') {
      const cleaned = String(phoneNumber || '9876543210').replace(/\D/g, '');
      if (cleaned.length !== 10) {
        return NextResponse.json({ error: 'Please enter a valid 10-digit phone number for testing.' }, { status: 400 });
      }
      const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const dispatchResult = await otpPlatform.dispatchOtp(cleaned, testOtp);

      return NextResponse.json({
        success: dispatchResult.success,
        message: dispatchResult.success
          ? `Test OTP (${testOtp}) dispatched successfully via ${dispatchResult.providerName} to +91-${cleaned}!`
          : `Dispatch failed via ${dispatchResult.providerName}: ${dispatchResult.error}`,
        dispatchResult,
        testOtp
      }, { status: dispatchResult.success ? 200 : 400 });
    }

    return NextResponse.json({ error: 'Invalid action specified. Use "save" or "test".' }, { status: 400 });
  } catch (error: any) {
    console.error('OTP Platform API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
