"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, Radio, CheckCircle2, AlertCircle, ArrowLeft, Send, Sparkles, ShieldCheck, Terminal, Smartphone, MessageSquare } from "lucide-react";

export default function OtpPlatformPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Settings state
  const [provider, setProvider] = useState<"fast2sms" | "twilio" | "telegram" | "webhook" | "dev">("dev");
  const [fast2smsApiKey, setFast2smsApiKey] = useState("");
  const [twilioAccountSid, setTwilioAccountSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  // Live Test states
  const [testPhone, setTestPhone] = useState("9876543210");
  const [testResult, setTestResult] = useState<any | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/otp-platform");
      const data = await res.json();
      if (res.ok && data.settings) {
        setProvider(data.settings.provider || "dev");
        setFast2smsApiKey(data.settings.fast2smsApiKey || "");
        setTwilioAccountSid(data.settings.twilioAccountSid || "");
        setTwilioAuthToken(data.settings.twilioAuthToken || "");
        setTwilioPhoneNumber(data.settings.twilioPhoneNumber || "");
        setTelegramBotToken(data.settings.telegramBotToken || "");
        setTelegramChatId(data.settings.telegramChatId || "");
        setWebhookUrl(data.settings.webhookUrl || "");
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const newSettings = {
      provider,
      fast2smsApiKey,
      twilioAccountSid,
      twilioAuthToken,
      twilioPhoneNumber,
      telegramBotToken,
      telegramChatId,
      webhookUrl,
      devModeEnabled: provider === "dev",
    };

    try {
      const res = await fetch("/api/otp-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", settings: newSettings }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save configuration.");
      }

      setSuccessMsg("OTP Platform setup updated and activated globally across all verification screens!");
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleTestDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setError(null);
    setTestResult(null);

    try {
      const res = await fetch("/api/otp-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", phoneNumber: testPhone }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setError(err.message || "Test dispatch failed.");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 font-medium">
          <Settings className="animate-spin text-blue-600" size={24} />
          <span>Loading OTP Platform Configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
        <div>
          <button
            onClick={() => router.push("/verify-otp")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={14} /> Back to OTP Verification
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            <Radio className="text-blue-600 animate-pulse" />
            OTP Platform Setup & Gateway Switcher
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure how verification codes are dispatched (Cellular SMS, Telegram, Webhook, or Developer Screen).
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 border border-blue-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Active: {provider.toUpperCase()}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 shadow-sm">
          <AlertCircle size={18} className="flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-800 border border-green-200 shadow-sm">
          <CheckCircle2 size={18} className="flex-shrink-0 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Provider Switcher & Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone size={20} className="text-blue-600" />
              Select OTP Dispatch Gateway
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { id: "fast2sms", label: "Fast2SMS Cellular", desc: "Best for India (+91 real mobile text)", badge: "Recommended" },
                { id: "telegram", label: "Telegram Bot Alert", desc: "Free instant phone notification", badge: "Zero Cost" },
                { id: "twilio", label: "Twilio SMS", desc: "Global cellular network gateway", badge: null },
                { id: "webhook", label: "Custom Webhook", desc: "WhatsApp API / custom server", badge: null },
                { id: "dev", label: "Simulated Dev Mode", desc: "Shows code on screen directly", badge: "Default" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProvider(item.id as any)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    provider === item.id
                      ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-sm text-gray-900">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{item.desc}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="space-y-5 border-t border-gray-100 pt-6">
              {provider === "fast2sms" && (
                <div className="rounded-xl bg-gray-50 p-5 border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Fast2SMS Authorization Configuration</h3>
                    <a
                      href="https://www.fast2sms.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Get Free Key →
                    </a>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Authorization Key / API Key</label>
                    <input
                      type="password"
                      placeholder="Paste your Fast2SMS Authorization Key here..."
                      value={fast2smsApiKey}
                      onChange={(e) => setFast2smsApiKey(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Once saved, every OTP will be sent directly to the given Indian mobile phone via real cellular text without touching any `.env` file!
                  </p>
                </div>
              )}

              {provider === "telegram" && (
                <div className="rounded-xl bg-gray-50 p-5 border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare size={16} className="text-blue-500" /> Telegram Bot Alert Setup
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Bot Token (@BotFather)</label>
                    <input
                      type="text"
                      placeholder="123456789:ABCdefGHI..."
                      value={telegramBotToken}
                      onChange={(e) => setTelegramBotToken(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Chat ID / Channel ID</label>
                    <input
                      type="text"
                      placeholder="987654321"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {provider === "twilio" && (
                <div className="rounded-xl bg-gray-50 p-5 border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Twilio SMS Configuration</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Account SID</label>
                    <input
                      type="text"
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={twilioAccountSid}
                      onChange={(e) => setTwilioAccountSid(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Auth Token</label>
                    <input
                      type="password"
                      placeholder="Your Twilio Auth Token"
                      value={twilioAuthToken}
                      onChange={(e) => setTwilioAuthToken(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Twilio Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1234567890"
                      value={twilioPhoneNumber}
                      onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {provider === "webhook" && (
                <div className="rounded-xl bg-gray-50 p-5 border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Custom Webhook / WhatsApp API</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">POST Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://api.yourdomain.com/otp-webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {provider === "dev" && (
                <div className="rounded-xl bg-blue-50/50 p-5 border border-blue-200 space-y-2">
                  <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-500" /> Simulated Developer Mode Active
                  </h3>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    In this mode, whenever a verification code is generated, the code is displayed directly inside the banner on the screen (`Your Verification Code: XXXXXX`) with zero SMS cost or network dependency.
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-all"
                >
                  {saving ? "Saving Configuration..." : "Save & Activate Mode Globally"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Dispatch Testing Sandbox */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Terminal size={20} className="text-gray-700" />
              Live Gateway Tester
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Test your active configuration instantly (`{provider.toUpperCase()}`). Enter any 10-digit phone number below to trigger a live dispatch right now.
            </p>

            <form onSubmit={handleTestDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target 10-Digit Mobile Number</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-bold text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className="block w-full rounded-xl border border-gray-300 py-2.5 pl-12 pr-3 text-gray-900 font-mono text-base tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={testing || testPhone.length !== 10}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {testing ? "Dispatching Live Code..." : "Send Test OTP Code Now"}
                {!testing && <Send size={16} />}
              </button>
            </form>

            {/* Test Result Console */}
            {testResult && (
              <div className={`mt-6 rounded-xl p-4 text-xs font-mono border ${testResult.success ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                <div className="font-bold flex items-center justify-between border-b pb-2 mb-2 border-current/20">
                  <span>Dispatch Status</span>
                  <span>{testResult.success ? "SUCCESS" : "FAILED"}</span>
                </div>
                <p className="font-sans font-medium mb-2">{testResult.message}</p>
                {testResult.testOtp && (
                  <div className="mt-2 bg-black/10 rounded p-2 flex items-center justify-between">
                    <span>Generated Code:</span>
                    <span className="font-bold text-sm tracking-widest">{testResult.testOtp}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-indigo-950 p-6 text-white shadow-md">
            <div className="flex items-center gap-2 font-bold text-sm text-yellow-300 mb-2">
              <ShieldCheck size={18} /> Instant Platform Switcher
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              All settings are saved in <code className="bg-white/10 px-1.5 py-0.5 rounded text-white">data/settings.json</code>. Your verification screen (`/verify-otp`) will automatically switch between real cellular SMS and screen display based on this exact dashboard choice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
