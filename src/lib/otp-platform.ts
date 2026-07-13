import fs from 'fs';
import path from 'path';

export interface OtpPlatformSettings {
  provider: 'fast2sms' | 'twilio' | 'telegram' | 'webhook' | 'dev';
  fast2smsApiKey: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  telegramBotToken: string;
  telegramChatId: string;
  webhookUrl: string;
  devModeEnabled: boolean;
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

const DEFAULT_SETTINGS: OtpPlatformSettings = {
  provider: 'dev',
  fast2smsApiKey: process.env.FAST2SMS_API_KEY || '',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
  webhookUrl: process.env.OTP_WEBHOOK_URL || '',
  devModeEnabled: true,
};

export const otpPlatform = {
  getSettings(): OtpPlatformSettings {
    try {
      if (!fs.existsSync(SETTINGS_FILE)) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (error) {
      console.error('Error reading OTP platform settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(newSettings: Partial<OtpPlatformSettings>): OtpPlatformSettings {
    try {
      const current = this.getSettings();
      const updated: OtpPlatformSettings = { ...current, ...newSettings };
      
      const dir = path.dirname(SETTINGS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
      return updated;
    } catch (error) {
      console.error('Error saving OTP platform settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async dispatchOtp(phoneNumber: string, otp: string): Promise<{ success: boolean; realSmsSent: boolean; providerName: string; error?: string }> {
    const settings = this.getSettings();
    const cleanedPhone = phoneNumber.replace(/\D/g, '');

    // 1. Check Fast2SMS (If provider is fast2sms OR if fast2smsApiKey exists and provider != dev)
    const fastKey = settings.fast2smsApiKey || process.env.FAST2SMS_API_KEY;
    if ((settings.provider === 'fast2sms' || (fastKey && settings.provider !== 'dev')) && fastKey) {
      try {
        const smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': fastKey,
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
          console.log(`[REAL SMS SENT via Fast2SMS] To: +91-${cleanedPhone} | OTP: ${otp}`);
          return { success: true, realSmsSent: true, providerName: 'Fast2SMS (+91 Cellular Gateway)' };
        } else {
          console.error('Fast2SMS Error Response:', smsData);
          return { success: false, realSmsSent: false, providerName: 'Fast2SMS', error: smsData.message || 'Fast2SMS rejected dispatch. Verify API key and credits.' };
        }
      } catch (err: any) {
        console.error('Fast2SMS Network Error:', err);
        return { success: false, realSmsSent: false, providerName: 'Fast2SMS', error: err.message };
      }
    }

    // 2. Check Twilio
    const tSid = settings.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID;
    const tAuth = settings.twilioAuthToken || process.env.TWILIO_AUTH_TOKEN;
    const tPhone = settings.twilioPhoneNumber || process.env.TWILIO_PHONE_NUMBER;
    if ((settings.provider === 'twilio' || (tSid && tAuth && tPhone && settings.provider !== 'dev')) && tSid && tAuth && tPhone) {
      try {
        const auth = Buffer.from(`${tSid}:${tAuth}`).toString('base64');
        const bodyParams = new URLSearchParams({
          To: `+91${cleanedPhone}`,
          From: tPhone,
          Body: `Your Campus Deals verification code is ${otp}. Valid for 5 minutes.`
        });
        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${tSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyParams.toString()
        });
        if (twilioRes.ok) {
          console.log(`[REAL SMS SENT via Twilio] To: +91-${cleanedPhone} | OTP: ${otp}`);
          return { success: true, realSmsSent: true, providerName: 'Twilio Cellular Gateway' };
        } else {
          const tErr = await twilioRes.json();
          console.error('Twilio Error:', tErr);
          return { success: false, realSmsSent: false, providerName: 'Twilio', error: tErr.message || 'Twilio dispatch failed.' };
        }
      } catch (err: any) {
        return { success: false, realSmsSent: false, providerName: 'Twilio', error: err.message };
      }
    }

    // 3. Check Telegram Bot Alert
    const tgToken = settings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const tgChat = settings.telegramChatId || process.env.TELEGRAM_CHAT_ID;
    if ((settings.provider === 'telegram' || (tgToken && tgChat && settings.provider !== 'dev')) && tgToken && tgChat) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChat,
            text: `🔐 *Campus Deals OTP Verification*\n\nPhone: \`+91-${cleanedPhone}\`\nOTP Code: *${otp}*\n\n_Valid for 5 minutes._`,
            parse_mode: 'Markdown'
          })
        });
        const tgData = await tgRes.json();
        if (tgData.ok) {
          console.log(`[OTP SENT via Telegram Bot] To: ${cleanedPhone} | OTP: ${otp}`);
          return { success: true, realSmsSent: true, providerName: 'Telegram Bot Alert' };
        } else {
          return { success: false, realSmsSent: false, providerName: 'Telegram Bot', error: tgData.description || 'Telegram API failed' };
        }
      } catch (err: any) {
        return { success: false, realSmsSent: false, providerName: 'Telegram Bot', error: err.message };
      }
    }

    // 4. Check Webhook / Custom URL
    const whUrl = settings.webhookUrl || process.env.OTP_WEBHOOK_URL;
    if ((settings.provider === 'webhook' || (whUrl && settings.provider !== 'dev')) && whUrl) {
      try {
        const whRes = await fetch(whUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: `+91${cleanedPhone}`, otp, timestamp: new Date().toISOString() })
        });
        if (whRes.ok) {
          console.log(`[OTP SENT via Webhook] To: ${cleanedPhone} | OTP: ${otp}`);
          return { success: true, realSmsSent: true, providerName: 'Custom Webhook API' };
        }
      } catch (err: any) {
        console.error('Webhook Error:', err);
      }
    }

    // 5. Fallback: Developer Mode / Simulated SMS
    console.log('====================================================');
    console.log(`[SMS DISPATCH SIMULATION] To: +91-${cleanedPhone}`);
    console.log(`[SMS DISPATCH SIMULATION] OTP Code: ${otp}`);
    console.log('====================================================');
    return { success: true, realSmsSent: false, providerName: 'Simulated (Developer Mode)' };
  }
};
