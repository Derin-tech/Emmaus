import { mockListings } from "@/lib/mock-data";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Tag, User, ShieldCheck, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = mockListings.find(l => l.id === id);

  if (!listing) {
    notFound();
  }

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
                listing.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
              }`}>
                {listing.status}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">
              {listing.category === 'Train' && `${listing.fromStation} to ${listing.toStation}`}
              {listing.category === 'Movies' && listing.movieName}
              {listing.category === 'Bus' && `${listing.fromLocation} to ${listing.toLocation}`}
              {listing.category === 'Events' && listing.eventName}
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
                      <dd className="mt-1 text-sm text-gray-900">{listing.trainNameOrNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Class & Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">{listing.travelClass} - {listing.pnrStatus}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Journey Date</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Calendar size={16} className="text-gray-400" /> {format(new Date(listing.dateOfJourney), 'PPP')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Timing</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Clock size={16} className="text-gray-400" /> {listing.departureTime} - {listing.arrivalTime}</dd>
                    </div>
                  </>
                )}

                {listing.category === 'Movies' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Theatre</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><MapPin size={16} className="text-gray-400" /> {listing.theatreName}, {listing.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Seats</dt>
                      <dd className="mt-1 text-sm text-gray-900">{listing.seatNumbers} {listing.screen && `(${listing.screen})`}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Show Date</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Calendar size={16} className="text-gray-400" /> {format(new Date(listing.date), 'PPP')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Timing</dt>
                      <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><Clock size={16} className="text-gray-400" /> {listing.showTiming}</dd>
                    </div>
                  </>
                )}
                
                {/* Similar blocks can be added for Bus and Events */}

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
                href={`https://wa.me/${listing.contactInfo.replace(/[^\d+]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
              >
                <MessageCircle size={18} />
                Claim Ticket
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
