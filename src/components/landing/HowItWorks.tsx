import { PenLine, Search, UserPlus } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      name: 'Post your ticket',
      description: 'Select a category, fill in the details like date and price, and list your ticket in seconds.',
      icon: PenLine,
    },
    {
      name: 'Browse & Search',
      description: 'Looking for a ticket? Filter by category, location, or date to find exactly what you need.',
      icon: Search,
    },
    {
      name: 'Connect Directly',
      description: 'Found a match? Click to WhatsApp or call the student directly to finalize the exchange.',
      icon: UserPlus,
    },
  ];

  return (
    <div id="how-it-works" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How it works</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Three simple steps to buy or sell your tickets. No middleman, no fees.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.name} className="relative flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">
                    <span className="text-blue-600 mr-2">{index + 1}.</span>
                    {step.name}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {step.description}
                  </p>
                  
                  {/* Connector Line (Desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
