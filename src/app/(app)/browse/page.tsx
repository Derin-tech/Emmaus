"use client";

import { useState } from "react";
import { mockListings } from "@/lib/mock-data";
import { Category, Listing } from "@/types";
import { format } from "date-fns";
import { Book, Watch, Gamepad2, Briefcase, HelpCircle, Tag, Search, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories: { name: Category | 'All'; icon: any }[] = [
  { name: 'All', icon: Tag },
  { name: 'Textbooks', icon: Book },
  { name: 'Accessories', icon: Watch },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Services', icon: Briefcase },
  { name: 'Requests', icon: HelpCircle },
  { name: 'Others', icon: Tag },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = mockListings.filter((listing) => {
    const matchesCategory = activeCategory === 'All' || listing.category === activeCategory;
    const matchesStatus = listing.status !== 'Sold';
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      listing.category.toLowerCase().includes(searchLower) ||
      listing.title.toLowerCase().includes(searchLower) ||
      listing.description.toLowerCase().includes(searchLower);

    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Discover Campus Deals</h1>
          <p className="mt-1 text-sm text-gray-500">Buy, sell, and offer services to your college peers.</p>
        </div>
        
        <div className="relative max-w-md w-full sm:w-auto">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border-0 py-2.5 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 caret-blue-600 sm:text-sm sm:leading-6"
            placeholder="Search items, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
               <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <motion.div 
              key={listing.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">No deals found</h3>
            <p className="mt-1 text-sm text-gray-500">We couldn't find anything matching your criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const getIcon = () => {
    switch (listing.category) {
      case 'Textbooks': return <Book size={20} className="text-blue-500" />;
      case 'Accessories': return <Watch size={20} className="text-purple-500" />;
      case 'Gaming': return <Gamepad2 size={20} className="text-orange-500" />;
      case 'Services': return <Briefcase size={20} className="text-green-500" />;
      case 'Requests': return <HelpCircle size={20} className="text-red-500" />;
      default: return <Tag size={20} className="text-gray-500" />;
    }
  };

  return (
    <motion.div 
      animate={{ y: [0, -8, 0] }}
      transition={{ 
        y: {
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: (parseInt(listing.id) || 1) * 0.2
        },
        scale: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileHover={{ scale: 1.03 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-xl hover:ring-blue-300 h-full"
    >
      <div className="p-5 flex-1">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
            {getIcon()}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <Tag size={12} />
            {listing.category}
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{listing.description}</p>
        
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
             <Clock size={14} />
             <span>{format(new Date(listing.postedDate), 'MMM d, yyyy')}</span>
          </div>
          {listing.condition && (
            <span className="rounded-md bg-gray-100 px-2 py-1 font-medium">{listing.condition}</span>
          )}
        </div>
        
      </div>
      
      <div className="border-t border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Price</span>
          <span className="text-lg font-bold text-gray-900">₹{listing.price}</span>
        </div>
        <Link href={`/listing/${listing.id}`} className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800">
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
