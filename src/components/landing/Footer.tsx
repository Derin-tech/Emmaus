import Link from 'next/link';
import { Ticket, MessageCircle, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Ticket size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              UniTickets
            </span>
          </Link>
        </div>
        
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6">
            <a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Home</a>
          </div>
          <div className="pb-6">
            <a href="#how-it-works" className="text-sm leading-6 text-gray-600 hover:text-gray-900">How it Works</a>
          </div>
          <div className="pb-6">
            <a href="#categories" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Categories</a>
          </div>
          <div className="pb-6">
            <Link href="/browse" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Browse App</Link>
          </div>
          <div className="pb-6">
            <a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </nav>
        
        <div className="mt-10 flex justify-center space-x-10">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Contact</span>
            <MessageCircle size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Website</span>
            <Globe size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Email</span>
            <Mail size={24} />
          </a>
        </div>
        
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} UniTickets, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
