"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6 shadow-sm">
          <ShieldAlert size={36} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Authentication Rejected
        </h2>
        <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-6 text-center shadow-sm">
          <p className="text-lg font-bold text-red-800">
            Access restricted to CET students.
          </p>
          <p className="mt-2 text-sm text-red-600">
            You must sign in using an official email ending strictly with <strong>@cet.ac.in</strong>. Personal email accounts (like @gmail.com) or other domains are blocked.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
