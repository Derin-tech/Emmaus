"use client";

import { useState } from "react";
import { Category, Listing } from "@/types";
import { Train, Film, Bus, Calendar, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addListingToStorage } from "@/lib/mock-data";

export default function PostListingPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { name: Category; icon: any; desc: string }[] = [
    { name: 'Movies', icon: Film, desc: 'Theatre and movie tickets' },
    { name: 'Train', icon: Train, desc: 'IRCTC or local trains' },
    { name: 'Bus', icon: Bus, desc: 'Intercity or private buses' },
    { name: 'Events', icon: Calendar, desc: 'Concerts, sports, college fests' },
    { name: 'Others', icon: Tag, desc: 'Anything else' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    let title = '';
    let description = '';
    if (category === 'Movies') {
      title = String(formData.get('movieName') || 'Movie Ticket');
      description = `Theatre: ${formData.get('theatreName') || ''}\nSeats: ${formData.get('seatNumbers') || ''}`;
    } else if (category === 'Train') {
      title = `${formData.get('fromStation') || ''} to ${formData.get('toStation') || ''}`;
      description = `Train: ${formData.get('trainNameOrNumber') || ''}\nClass: ${formData.get('travelClass') || ''}`;
    } else if (category === 'Bus') {
      title = `${formData.get('fromLocation') || ''} to ${formData.get('toLocation') || ''}`;
      description = `Operator: ${formData.get('busOperator') || ''}\nSeat: ${formData.get('seatType') || ''}`;
    } else if (category === 'Events') {
      title = String(formData.get('eventName') || 'Event Ticket');
      description = `Venue: ${formData.get('venue') || ''}\nDate: ${formData.get('date') || ''}`;
    } else {
      title = String(formData.get('title') || 'Ticket Listing');
      description = String(formData.get('description') || '');
    }

    const baseListing = {
      id: Date.now().toString(),
      userId: 'u1',
      category: category,
      status: 'Available' as const,
      price: Number(formData.get('price') || 0),
      numberOfTickets: Number(formData.get('numberOfTickets') || 1),
      postedDate: new Date().toISOString(),
      contactInfo: String(formData.get('contactInfo') || ''),
      title,
      description,
    };

    let newListing: Listing;

    if (category === 'Movies') {
      newListing = {
        ...baseListing,
        category: 'Movies',
        movieName: String(formData.get('movieName') || ''),
        theatreName: String(formData.get('theatreName') || ''),
        location: String(formData.get('theatreName') || '').split(',')[1]?.trim() || 'Mumbai',
        date: String(formData.get('date') || new Date().toISOString()),
        showTiming: new Date(String(formData.get('date') || new Date())).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seatNumbers: String(formData.get('seatNumbers') || ''),
        screen: String(formData.get('screen') || ''),
      };
    } else if (category === 'Train') {
      newListing = {
        ...baseListing,
        category: 'Train',
        trainNameOrNumber: String(formData.get('trainNameOrNumber') || ''),
        fromStation: String(formData.get('fromStation') || ''),
        toStation: String(formData.get('toStation') || ''),
        dateOfJourney: String(formData.get('dateOfJourney') || new Date().toISOString()),
        departureTime: '10:00',
        arrivalTime: '14:00',
        travelClass: String(formData.get('travelClass') || 'CC'),
        pnrStatus: 'Confirmed',
      };
    } else if (category === 'Bus') {
      newListing = {
        ...baseListing,
        category: 'Bus',
        busOperator: String(formData.get('busOperator') || ''),
        fromLocation: String(formData.get('fromLocation') || ''),
        toLocation: String(formData.get('toLocation') || ''),
        dateOfJourney: String(formData.get('departureTime') || new Date().toISOString()),
        departureTime: new Date(String(formData.get('departureTime') || new Date())).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        arrivalTime: '08:00',
        seatType: String(formData.get('seatType') || 'AC'),
      };
    } else if (category === 'Events') {
      newListing = {
        ...baseListing,
        category: 'Events',
        eventName: String(formData.get('eventName') || ''),
        venue: String(formData.get('venue') || ''),
        date: String(formData.get('date') || new Date().toISOString()),
        time: String(formData.get('time') || '18:00'),
      };
    } else {
      newListing = {
        ...baseListing,
        category: 'Others',
        title: String(formData.get('title') || ''),
        description: String(formData.get('description') || ''),
      };
    }

    addListingToStorage(newListing);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Post a Ticket</h1>
        <p className="mt-2 text-gray-500">
          Got a ticket you can't use? List it here for other students.
        </p>
      </div>

      {!category ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">{category}</span> Details
            </h2>
            <button 
              onClick={() => setCategory(null)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Change Category
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Dynamic Fields based on Category */}
            {category === 'Movies' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Movie Name</label>
                  <input name="movieName" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. Oppenheimer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Theatre & Location</label>
                  <input name="theatreName" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="PVR Palladium, Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <input name="date" required type="datetime-local" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seat Numbers</label>
                  <input name="seatNumbers" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. H12, H13" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Screen/Hall (Optional)</label>
                  <input name="screen" type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Screen 4" />
                </div>
              </div>
            )}

            {category === 'Train' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Train Name / Number</label>
                  <input name="trainNameOrNumber" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. Vande Bharat Express (22221)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">From Station</label>
                  <input name="fromStation" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Mumbai CSMT" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To Station</label>
                  <input name="toStation" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Pune JN" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Journey</label>
                  <input name="dateOfJourney" required type="date" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class & PNR Status</label>
                  <input name="travelClass" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="3AC - Confirmed" />
                </div>
              </div>
            )}

            {category === 'Bus' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bus Operator Name</label>
                  <input name="busOperator" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. Neeta Travels" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">From</label>
                  <input name="fromLocation" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Pune" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <input name="toLocation" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Goa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                  <input name="departureTime" required type="datetime-local" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seat Type</label>
                  <input name="seatType" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="AC Sleeper" />
                </div>
              </div>
            )}

            {category === 'Events' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input name="eventName" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. College Fest 2024" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Venue</label>
                  <input name="venue" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Main Auditorium" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input name="date" required type="date" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input name="time" required type="time" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
              </div>
            )}

            {category === 'Others' && (
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input name="title" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="What are you selling?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" required rows={4} className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Provide details about the ticket..."></textarea>
                </div>
              </div>
            )}

            <hr className="my-8 border-gray-100" />

            {/* General Details for all */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Tickets</label>
                <input name="numberOfTickets" required type="number" min="1" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" defaultValue={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (Total) ₹</label>
                <input name="price" required type="number" min="0" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. 500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Seller Phone / WhatsApp Number</label>
                <input name="contactInfo" required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. 9876543210 or +91 9876543210" />
                <p className="mt-1 text-xs text-gray-500">Buyers will click "Claim Ticket" to chat directly with this WhatsApp number.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Listing'}
                <ArrowRight size={16} />
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
