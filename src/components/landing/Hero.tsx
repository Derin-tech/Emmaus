import Link from 'next/link';
import { ArrowRight, Ticket } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white pt-24 sm:pt-32">
      {/* Background gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 pt-10 sm:pb-32 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Got a ticket you can't use? <br className="hidden sm:block" />
          <span className="text-blue-600">Someone here needs it.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Buy, sell, and exchange train, bus, movie, and event tickets exclusively with fellow college students. Say goodbye to WhatsApp spam.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/browse"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Browse Tickets
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/post"
            className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-blue-600"
          >
            Post a Ticket <span aria-hidden="true">→</span>
          </Link>
        </div>
        
        {/* Placeholder Graphic/Illustration */}
        <div className="mt-16 sm:mt-24 flex justify-center">
          <div className="relative rounded-2xl bg-gray-50/50 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-3xl lg:p-4 max-w-4xl w-full shadow-2xl overflow-hidden">
            <div className="aspect-[16/9] w-full bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="flex flex-col items-center justify-center opacity-50">
                <Ticket size={64} className="text-blue-600 mb-4" />
                <p className="text-lg font-medium text-gray-500">UniTickets Platform Demo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
