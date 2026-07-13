"use client";

import { useListings } from "@/lib/mock-data";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Tag, User, ShieldCheck, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Listing } from "@/types";

export default function ListingDetail() {
  const params = useParams();
  const id = params?.id as string;
  const { listings } = useListings();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (listings && listings.length > 0) {
      const found = listings.find(l => l.id === id);
      setListing(found || null);
      setIsLoaded(true);
    }
  }, [listings, id]);

  if (!isLoaded) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500 animate-pulse">
        Loading ticket details...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Ticket Not Found</h2>
        <p className="mt-2 text-gray-500">This ticket may have been removed or does not exist.</p>
        <Link href="/browse" className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
          <ArrowLeft size={16} /> Back to Browse
        </Link>
      </div>
    );
  }

  const getTitle = () => {
    if (listing.category === 'Train') return `${(listing as any).fromStation} to ${(listing as any).toStation}`;
    if (listing.category === 'Movies') return (listing as any).movieName;
    if (listing.category === 'Bus') return `${(listing as any).fromLocation} to ${(listing as any).toLocation}`;
    if (listing.category === 'Events') return (listing as any).eventName;
    if (listing.category === 'Others') return (listing as any).title;
    return '';
  };

  const getWhatsAppUrl = () => {
    let digits = listing.contactInfo.replace(/\D/g, '');
    if (digits.length === 10) {
      digits = '91' + digits;
    }
    const message = encodeURIComponent(`Hi! I'm interested in your ticket listing on Emmaus: "${getTitle()}" (₹${listing.price})`);
    return `https://wa.me/${digits}?text=${message}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900 hover:underline">Home</Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-gray-900 hover:underline">{listing.category}</Link>
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
                listing.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
              }`}>
                {listing.status}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">
              {getTitle()}
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
            <span className="text-sm text-gray-500 mt-1">For {listing.numberOfTickets} ticket(s)</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Ticket Details</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                
                {listing.category === 'Train' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Train</dt>
                      <dd className="mt-1 text-sm text-gray-900">{(listing as any).trainNameOrNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Class & Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">{(listing as any).travelClass} - {(listing as any).pnrStatus}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Journey Date</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Calendar size={16} className="text-gray-400" /> {format(new Date((listing as any).dateOfJourney), 'PPP')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Timing</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Clock size={16} className="text-gray-400" /> {(listing as any).departureTime} - {(listing as any).arrivalTime}</dd>
                    </div>
                  </>
                )}

                {listing.category === 'Movies' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Theatre</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><MapPin size={16} className="text-gray-400" /> {(listing as any).theatreName}, {(listing as any).location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Seats</dt>
                      <dd className="mt-1 text-sm text-gray-900">{(listing as any).seatNumbers} {(listing as any).screen && `(${(listing as any).screen})`}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Show Date</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Calendar size={16} className="text-gray-400" /> {format(new Date((listing as any).date), 'PPP')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Timing</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Clock size={16} className="text-gray-400" /> {(listing as any).showTiming}</dd>
                    </div>
                  </>
                )}
                
                {listing.category === 'Bus' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Bus Operator</dt>
                      <dd className="mt-1 text-sm text-gray-900">{(listing as any).busOperator}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Seat Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{(listing as any).seatType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Journey Date</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Calendar size={16} className="text-gray-400" /> {format(new Date((listing as any).dateOfJourney), 'PPP')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Timing</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Clock size={16} className="text-gray-400" /> {(listing as any).departureTime} - {(listing as any).arrivalTime}</dd>
                    </div>
                  </>
                )}

                {listing.category === 'Events' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Venue</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><MapPin size={16} className="text-gray-400" /> {(listing as any).venue}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Event Date</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Calendar size={16} className="text-gray-400" /> {format(new Date((listing as any).date), 'PPP')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Timing</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Clock size={16} className="text-gray-400" /> {(listing as any).time}</dd>
                    </div>
                  </>
                )}

                {listing.category === 'Others' && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{(listing as any).description}</dd>
                  </div>
                )}

              </dl>
            </div>
          </div>

          <div className="md:border-l md:border-gray-100 md:pl-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Action</h3>
            
            <p className="text-sm text-gray-600 mb-6">
              Only contact the seller if you are genuinely interested in buying the ticket.
            </p>

            {listing.status === 'Available' ? (
              <a 
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
              >
                <MessageCircle size={18} />
                Claim Ticket (Chat on WhatsApp)
              </a>
            ) : (
              <div className="rounded-xl bg-gray-50 p-4 text-center border border-gray-200 text-sm text-gray-500">
                This ticket is no longer available.
              </div>
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
