import { ShieldCheck, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function Trust() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A safer marketplace for students.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Campus Deals requires a verified college email address to sign up. You're always dealing with real peers, not random strangers on the internet.
          </p>
          
          <div className="mx-auto mt-12 flex max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
            <div className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm">
              <ShieldCheck size={20} className="text-green-400" />
              Verified Accounts Only
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm">
              <GraduationCap size={20} className="text-blue-400" />
              By students, for students
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/login"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
            >
              Join the Community
            </Link>
          </div>

          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#1d4ed8" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
