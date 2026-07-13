"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = async (targetEmail: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, name: targetEmail.split("@")[0] }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.redirectUrl) {
          router.push(data.redirectUrl);
          return;
        }
        throw new Error(data.error || "Authentication failed");
      }

      router.push(data.redirectUrl || "/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    handleOAuthLogin(email.trim());
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Image src="/logo2.png" alt="Emmaus Logo" width={64} height={64} className="mx-auto rounded-2xl mb-6 shadow-sm" />
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Sign in to Emmaus
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Dual-Layer Secure Authentication Pipeline (`@cet.ac.in` domain restricted)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <ShieldAlert size={18} className="flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Google OAuth Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="student@cet.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Primary Auth: Must end exactly with `@cet.ac.in`.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !email}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Authenticating..." : "Sign in with Google OAuth"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                <span className="bg-white px-3">Browser Agent Test Shortcuts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleOAuthLogin("teststudent@cet.ac.in")}
                className="flex w-full items-center justify-between rounded-xl border border-green-200 bg-green-50/50 px-4 py-3 text-sm font-medium text-green-800 hover:bg-green-100/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Test Mock `@cet.ac.in` Account
                </span>
                <span className="text-xs text-green-600 font-semibold">(Allowed ➔ OTP)</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleOAuthLogin("dummyuser@gmail.com")}
                className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm font-medium text-red-800 hover:bg-red-100/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-600" />
                  Test Dummy `@gmail.com` Account
                </span>
                <span className="text-xs text-red-600 font-semibold">(Blocked ➔ 403)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
