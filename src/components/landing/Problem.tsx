"use client";

import { MessageSquareOff, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Problem() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Stop scrolling through spam</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            College WhatsApp groups are chaotic. Items get buried, and you miss out on buyers or cheap deals. We fixed that.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-4xl grid grid-cols-1 gap-8 md:grid-cols-2 relative">
          
          {/* The Old Way */}
          <motion.div 
            className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 z-10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
                Hard to search for specific items
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✕</span>
                Dealing with random non-students
              </li>
            </ul>
          </motion.div>

          {/* The Campus Deals Way */}
          <motion.div 
            className="rounded-3xl bg-blue-600 p-8 shadow-xl ring-1 ring-blue-600 text-white z-20"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">The Campus Deals Way</h3>
            </div>
            <ul className="space-y-4 text-blue-100">
              <li className="flex items-start gap-3">
                <span className="text-white">✓</span>
                One centralized, organized platform
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">✓</span>
                Items are categorized and searchable
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">✓</span>
                Filter by categories or keywords
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">✓</span>
                Verified college students only
              </li>
            </ul>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
