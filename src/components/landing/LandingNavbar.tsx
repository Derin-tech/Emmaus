import Link from 'next/link';
import Image from 'next/image';
import { Ticket } from 'lucide-react';

export default function LandingNavbar() {
  return (
    <nav className="absolute top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image src="/logo2.png" alt="Campus Deals Logo" width={40} height={40} className="rounded-xl" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Campus Deals
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            How it Works
          </a>
          <a href="#categories" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            Categories
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden sm:block text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Log in
          </Link>
          
          <Link 
            href="/login" 
            className="flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
