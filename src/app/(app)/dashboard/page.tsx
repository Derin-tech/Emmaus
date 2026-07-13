"use client";

import { mockListings } from "@/lib/mock-data";
import { format } from "date-fns";
import { Tag, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  // Simulating user "u1" logged in
  const myListings = mockListings.filter(l => l.userId === 'u1');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Dashboard</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Manage your active and past ticket listings.</p>
        </div>
        <Link 
          href="/post" 
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Post New
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {myListings.length > 0 ? myListings.map((listing) => (
            <li key={listing.id} className="p-6 transition-colors hover:bg-gray-55 dark:hover:bg-gray-850/40">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                      <Tag size={12} />
                      {listing.category}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      listing.status === 'Available' ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2">
                    {listing.category === 'Train' && `${listing.fromStation} to ${listing.toStation}`}
                    {listing.category === 'Movies' && listing.movieName}
                    {listing.category === 'Bus' && `${listing.fromLocation} to ${listing.toLocation}`}
                    {listing.category === 'Events' && listing.eventName}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Posted on {format(new Date(listing.postedDate), 'MMM d, yyyy')}</span>
                    <span>₹{listing.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {listing.status === 'Available' && (
                    <button className="flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                      <span className="hidden sm:inline">Mark Sold</span>
                    </button>
                  )}
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400">
                    <Edit2 size={16} />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          )) : (
            <li className="p-8 text-center text-gray-500 dark:text-gray-400">
              You haven't posted any tickets yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
