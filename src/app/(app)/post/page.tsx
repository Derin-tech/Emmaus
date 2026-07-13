"use client";

import { useState } from "react";
import { Category } from "@/types";
import { Train, Film, Bus, Calendar, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Post a Ticket</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
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
                className="flex items-start gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 text-left transition-all hover:border-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">{category}</span> Details
            </h2>
            <button 
              onClick={() => setCategory(null)}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Change Category
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Dynamic Fields based on Category */}
            {category === 'Movies' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Movie Name</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. Oppenheimer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theatre & Location</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="PVR Palladium, Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                  <input required type="datetime-local" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seat Numbers</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. H12, H13" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Screen/Hall (Optional)</label>
                  <input type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Screen 4" />
                </div>
              </div>
            )}

            {category === 'Train' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Train Name / Number</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. Vande Bharat Express (22221)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Station</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Mumbai CSMT" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Station</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Pune JN" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Journey</label>
                  <input required type="date" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class & PNR Status</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="3AC - Confirmed" />
                </div>
              </div>
            )}

            {category === 'Bus' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bus Operator Name</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. Neeta Travels" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Pune" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Goa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Departure Time</label>
                  <input required type="datetime-local" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seat Type</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="AC Sleeper" />
                </div>
              </div>
            )}

            {category === 'Events' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Name</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. College Fest 2024" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Main Auditorium" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                  <input required type="date" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                  <input required type="time" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                </div>
              </div>
            )}

            {category === 'Others' && (
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="What are you selling?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea required rows={4} className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Provide details about the ticket..."></textarea>
                </div>
              </div>
            )}

            <hr className="my-8 border-gray-100 dark:border-gray-800" />

            {/* General Details for all */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Tickets</label>
                <input required type="number" min="1" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" defaultValue={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (Total) ₹</label>
                <input required type="number" min="0" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. 500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Info (WhatsApp/Phone)</label>
                <input required type="text" className="mt-2 block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. +91 9876543210" />
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
