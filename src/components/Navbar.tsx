import Link from 'next/link';
import Image from 'next/image';
import { Ticket, Search, PlusCircle, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image src="/logo2.png" alt="Campus Deals Logo" width={40} height={40} className="rounded-xl" />
          <span className="hidden text-xl font-bold tracking-tight text-gray-900 sm:block">
            Campus Deals
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href="/marketplace" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            Marketplace
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            My Listings
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden sm:flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
            <Search size={20} />
          </button>
          
          <Link 
            href="/post" 
            className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Sell</span>
            <span className="sm:hidden">Sell</span>
          </Link>
          
          <Link 
            href="/login" 
            className="flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
