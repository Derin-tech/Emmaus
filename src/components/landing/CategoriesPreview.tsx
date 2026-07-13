"use client";

import { Book, Watch, Gamepad2, Briefcase, HelpCircle, Tag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CategoriesPreview() {
  const categories = [
    {
      name: 'Textbooks',
      icon: Book,
      description: 'Used engineering, medical, and arts textbooks.',
      color: 'bg-blue-50 text-blue-600 ring-blue-100',
    },
    {
      name: 'Services',
      icon: Briefcase,
      description: 'Assignment help, project work, and tutoring.',
      color: 'bg-green-50 text-green-600 ring-green-100',
    },
    {
      name: 'Gaming',
      icon: Gamepad2,
      description: 'Game accounts, consoles, and digital items.',
      color: 'bg-orange-50 text-orange-600 ring-orange-100',
    },
    {
      name: 'Accessories',
      icon: Watch,
      description: 'Headphones, calculators, laptops, and more.',
      color: 'bg-purple-50 text-purple-600 ring-purple-100',
    },
    {
      name: 'Requests',
      icon: HelpCircle,
      description: 'Looking for something specific? Ask here.',
      color: 'bg-red-50 text-red-600 ring-red-100',
    },
    {
      name: 'Others',
      icon: Tag,
      description: 'Anything else that needs a new owner.',
      color: 'bg-gray-50 text-gray-600 ring-gray-200',
    },
  ];

  return (
    <div id="categories" className="bg-gray-50 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Browse campus deals across six main categories. Click any to start exploring.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href="/browse" passHref legacyBehavior>
                  <motion.a
                    className="group relative flex flex-col items-start justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:ring-blue-300 block cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
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
                  </motion.a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
