import { Train, Film, Bus, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPreview() {
  const categories = [
    {
      name: 'Movies',
      icon: Film,
      description: 'IMAX, 4DX, or local theatres - find the best seats.',
      color: 'bg-purple-50 text-purple-600 ring-purple-100',
    },
    {
      name: 'Train',
      icon: Train,
      description: 'Sleeper, AC, general - find your route home.',
      color: 'bg-blue-50 text-blue-600 ring-blue-100',
    },
    {
      name: 'Bus',
      icon: Bus,
      description: 'Intercity sleepers and seater buses.',
      color: 'bg-orange-50 text-orange-600 ring-orange-100',
    },
    {
      name: 'Events',
      icon: Calendar,
      description: 'Concerts, college fests, and sports matches.',
      color: 'bg-pink-50 text-pink-600 ring-pink-100',
    },
    {
      name: 'Others',
      icon: Tag,
      description: 'Anything else that needs a new owner.',
      color: 'bg-gray-50 text-gray-600 ring-gray-200',
    },
  ];

  return (
    <div id="categories" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Browse tickets across five main categories. Click any to start exploring.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href="/browse"
                  className="group relative flex flex-col items-start justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-blue-300"
                >
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${category.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
