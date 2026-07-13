"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Tag, User, ShieldCheck, MessageCircle, Info } from "lucide-react";
import Link from "next/link";
import { Listing, Status } from "@/types";
import { useListings } from "@/lib/mock-data";

export default function ListingClientView({ initialListing }: { initialListing: Listing }) {
  const [listing, setListing] = useState<Listing>(initialListing);
  const { updateListing } = useListings();
  const isSeller = listing.userId === 'u1'; // Mock logged-in user

  const handleStatusChange = (newStatus: Status) => {
    updateListing(listing.id, { status: newStatus });
    setListing({ ...listing, status: newStatus });
  };

  const getWhatsAppUrl = () => {
    let digits = listing.contactInfo.replace(/\D/g, '');
    if (digits.length === 10) {
      digits = '91' + digits;
    }
    const message = encodeURIComponent(`Hi! I'm interested in your listing on Emmaus: "${listing.title}" (₹${listing.price})`);
    return `https://wa.me/${digits}?text=${message}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900 hover:underline">Home</Link>
        <span>/</span>
        <span>{listing.category}</span>
        <span>/</span>
        <span className="text-gray-900">{listing.id}</span>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/50 p-6 sm:p-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                <Tag size={12} />
                {listing.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                listing.status === 'Available' ? 'bg-green-100 text-green-800' :
                listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {listing.status}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">
              {listing.title}
            </h1>
            
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <User size={16} />
                Posted by User {listing.userId}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-green-500" />
                Verified Student
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-sm font-medium uppercase tracking-wider text-gray-500">Price</span>
            <span className="text-3xl font-bold text-gray-900">₹{listing.price}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              
              {listing.condition && (
                 <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Condition</h4>
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {listing.condition}
                    </span>
                 </div>
              )}
            </div>
          </div>

          <div className="md:border-l md:border-gray-100 md:pl-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Action</h3>
            
            {isSeller ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  You are the seller of this item. Update its status below:
                </p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleStatusChange('Available')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${listing.status === 'Available' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    Mark as Available
                  </button>
                  <button 
                    onClick={() => handleStatusChange('Pending')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${listing.status === 'Pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    Mark as Pending
                  </button>
                  <button 
                    onClick={() => handleStatusChange('Sold')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${listing.status === 'Sold' ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    Mark as Sold
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6 flex gap-2">
                  <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Only contact the seller if you are genuinely interested.</span>
                </p>

                {listing.status === 'Available' ? (
                  <a 
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
                  >
                    <MessageCircle size={18} />
                    Contact Seller
                  </a>
                ) : (
                  <div className="rounded-xl bg-gray-50 p-4 text-center border border-gray-200 text-sm text-gray-500">
                    This item is {listing.status.toLowerCase()}.
                  </div>
                )}
              </>
            )}
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Posted on {format(new Date(listing.postedDate), 'PPP')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
