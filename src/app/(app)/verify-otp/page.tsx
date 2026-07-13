"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Copy, Sparkles, Clock } from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Storage states for dev visibility & instant testing
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpExpiry, setOtpExpiry] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState<number>(300); // 5 minutes default
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOtp = sessionStorage.getItem("emmaus_dev_otp");
      const storedExpiry = sessionStorage.getItem("emmaus_otp_expiry");
      const storedPhone = sessionStorage.getItem("emmaus_phone") || "";
      if (storedOtp) setDevOtp(storedOtp);
      if (storedExpiry) setOtpExpiry(storedExpiry);
      if (storedPhone) setPhoneNumber(storedPhone);
    }
  }, []);

  useEffect(() => {
    if (!otpExpiry) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(otpExpiry).getTime();
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      setSecondsLeft(diff);
      if (diff <= 0) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [otpExpiry]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = () => {
    if (devOtp) {
      navigator.clipboard.writeText(devOtp);
      setSuccessMsg("OTP code copied to clipboard!");
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleAutoFill = () => {
    if (devOtp) {
      setOtp(devOtp);
      setError(null);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccessMsg(null);
    setResending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend OTP.");
      }

      if (typeof window !== "undefined") {
        if (data.devOtp) {
          sessionStorage.setItem("emmaus_dev_otp", data.devOtp);
          setDevOtp(data.devOtp);
        }
        if (data.otpExpiry) {
          sessionStorage.setItem("emmaus_otp_expiry", data.otpExpiry);
          setOtpExpiry(data.otpExpiry);
        }
      }

      setIsExpired(false);
      setOtp("");
      setSuccessMsg("New OTP dispatched instantly without lag! See updated code below.");
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.expired) {
          setIsExpired(true);
        }
        throw new Error(data.error || "Failed to verify OTP.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(data.redirectUrl || "/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-6 shadow-sm">
          <KeyRound size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Verify Mobile OTP
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit numeric verification code sent to your phone.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Simulated SMS Delivery Banner - Guarantees User Immediately Sees OTP */}
        {devOtp && (
          <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-xs tracking-wider uppercase text-blue-100">
                <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                <span>Simulated SMS Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-mono font-medium">
                <Clock size={12} />
                <span>{isExpired ? "EXPIRED" : formatTime(secondsLeft)}</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-blue-200">Your Verification Code</div>
                <div className={`font-mono text-2xl font-black tracking-[0.3em] ${isExpired ? "line-through opacity-50 text-red-300" : "text-white"}`}>
                  {devOtp}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy OTP"
                  className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                >
                  <Copy size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={isExpired}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  Auto-Fill
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white px-6 py-8 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <AlertCircle size={18} className="flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-blue-50 p-4 text-sm text-blue-800 border border-blue-200">
              <CheckCircle2 size={18} className="flex-shrink-0 text-blue-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-800 border border-green-200">
              <CheckCircle2 size={18} className="flex-shrink-0 text-green-600" />
              <span>OTP verified successfully! Updating status to active...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                  6-Digit OTP Code
                </label>
                <span className={`text-xs font-semibold ${isExpired ? "text-red-600 animate-bounce" : "text-gray-500"}`}>
                  {isExpired ? "Code Expired (5m limit)" : `Expires in ${formatTime(secondsLeft)}`}
                </span>
              </div>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="block w-full rounded-xl border-0 py-3.5 px-4 text-center font-mono text-2xl tracking-[0.5em] font-bold text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6 || success || isExpired}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Verifying..." : isExpired ? "Code Expired - Resend Below" : "Verify & Activate Account"}
                {!loading && !isExpired && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-8 border-t border-gray-100 pt-6 text-center">
            <p className="text-xs text-gray-500 mb-3">
              {isExpired
                ? "Your 5-minute window has ended. Please request a new verification code."
                : "Didn't receive the SMS code or want a fresh timer?"}
            </p>
            <button
              type="button"
              disabled={resending || loading}
              onClick={handleResend}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all ${
                isExpired
                  ? "bg-red-600 text-white hover:bg-red-500 animate-pulse ring-2 ring-red-400 ring-offset-2"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <RefreshCw size={16} className={resending ? "animate-spin" : ""} />
              <span>{resending ? "Dispatching Instant OTP..." : isExpired ? "Resend Verification Code Now" : "Resend OTP Code"}</span>
            </button>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push("/complete-profile")}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Change mobile number (+91-{phoneNumber || "----------"})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
