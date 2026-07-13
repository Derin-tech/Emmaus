"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();

      if (!res.ok) {
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

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <AlertCircle size={18} className="flex-shrink-0 text-red-500" />
              <span>{error}</span>
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
              <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                6-Digit OTP Code
              </label>
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
                disabled={loading || otp.length !== 6 || success}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Verifying..." : "Verify & Activate Account"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/complete-profile")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Didn't receive the code? Change phone number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
