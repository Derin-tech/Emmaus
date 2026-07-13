import Link from 'next/link';
import { Ticket, Search, PlusCircle, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-950/75 backdrop-blur-lg transition-all">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Ticket size={24} />
          </div>
          <span className="hidden text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:block">
            UniTickets
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href="/browse" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-white">
            Browse
          </Link>
          <Link href="/expiring-soon" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-white">
            Expiring Soon
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-white">
            My Listings
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hidden sm:flex items-center justify-center rounded-full p-2 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">
            <Search size={20} />
          </button>
          
          <Link 
            href="/post" 
            className="flex items-center gap-2 rounded-full bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 shadow-sm transition-all hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Post Ticket</span>
            <span className="sm:hidden">Post</span>
          </Link>
          
          <Link 
            href="/login" 
            className="flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 text-gray-600 dark:text-gray-300 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
