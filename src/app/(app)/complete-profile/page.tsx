"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP code.");
      }

      if (typeof window !== "undefined") {
        if (data.devOtp) sessionStorage.setItem("emmaus_dev_otp", data.devOtp);
        if (data.otpExpiry) sessionStorage.setItem("emmaus_otp_expiry", data.otpExpiry);
        sessionStorage.setItem("emmaus_phone", phoneNumber);
      }

      router.push(data.redirectUrl || "/verify-otp");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-6 shadow-sm">
          <Phone size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Complete Profile
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Secondary Authentication (2FA) required for pending student accounts.
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                10-Digit Mobile Number
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium sm:text-sm">
                  +91
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  className="block w-full rounded-xl border-0 py-3 pl-12 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 font-mono text-base tracking-wider"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                We will dispatch a 6-digit verification code to your phone.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending OTP..." : "Send Verification Code"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-xs text-gray-500 border border-gray-100 flex items-start gap-2">
            <ShieldCheck size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              For local verification testing, the dispatched 6-digit OTP code is printed directly to the server terminal (`console.log`).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
