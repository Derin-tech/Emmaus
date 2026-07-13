import { MessageSquareOff, TicketCheck } from 'lucide-react';

export default function Problem() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Stop scrolling through spam</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            College WhatsApp groups are chaotic. Tickets get buried, and you miss out on buyers or cheap tickets. We fixed that.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* The Old Way */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <MessageSquareOff size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">The Old Way</h3>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                Spamming 5 different WhatsApp groups
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                Messages get buried instantly
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                Hard to search for specific dates or routes
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                Dealing with random non-students
              </li>
            </ul>
          </div>

          {/* The UniTickets Way */}
          <div className="rounded-3xl bg-blue-600 p-8 shadow-lg ring-1 ring-blue-600 text-white transform md:-translate-y-4 transition-transform hover:-translate-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
                <TicketCheck size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">The UniTickets Way</h3>
            </div>
            <ul className="space-y-4 text-blue-100">
              <li className="flex items-start gap-3">
                <span className="text-white">✓</span>
                One centralized, organized platform
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">✓</span>
                Tickets are categorized and searchable
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">✓</span>
                Filter by date, location, or price
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">✓</span>
                Verified college students only
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
