"use client";

import { useListings } from "@/lib/mock-data";
import { format } from "date-fns";
import { Tag, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { listings, updateListing, deleteListing } = useListings();
  // Simulating user "u1" logged in
  const myListings = listings.filter(l => l.userId === 'u1');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Dashboard</h1>
          <p className="mt-2 text-gray-500">Manage your active and past ticket listings.</p>
        </div>
        <Link 
          href="/post" 
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Post New
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <ul className="divide-y divide-gray-100">
          {myListings.length > 0 ? myListings.map((listing) => (
            <li key={listing.id} className="p-6 transition-colors hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      <Tag size={12} />
                      {listing.category}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      listing.status === 'Available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mt-2">
                    {listing.category === 'Train' && `${(listing as any).fromStation} to ${(listing as any).toStation}`}
                    {listing.category === 'Movies' && (listing as any).movieName}
                    {listing.category === 'Bus' && `${(listing as any).fromLocation} to ${(listing as any).toLocation}`}
                    {listing.category === 'Events' && (listing as any).eventName}
                    {listing.category === 'Others' && (listing as any).title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>Posted on {format(new Date(listing.postedDate), 'MMM d, yyyy')}</span>
                    <span>₹{listing.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {listing.status === 'Available' && (
                    <button 
                      onClick={() => updateListing(listing.id, { status: 'Sold' })}
                      className="flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="hidden sm:inline">Mark Sold</span>
                    </button>
                  )}
                  <button 
                    onClick={() => deleteListing(listing.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          )) : (
            <li className="p-8 text-center text-gray-500">
              You haven't posted any tickets yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
