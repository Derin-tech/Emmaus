"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, User, ShieldCheck, MessageCircle, Info, ChevronLeft, ChevronRight, 
  MapPin, Clock, Share2, Heart, Flag, Expand, X
} from "lucide-react";
import Link from "next/link";
import { Listing, Status } from "@/types";

export default function ListingClientView({ initialListing }: { initialListing: Listing }) {
  const [listing, setListing] = useState<Listing>(initialListing);
  const isSeller = listing.userId === 'u1'; // Mock logged-in user

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  // Fallback images for demo
  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
      ];

  const handleStatusChange = (newStatus: Status) => {
    initialListing.status = newStatus;
    setListing({ ...initialListing });
  };

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-[#FCFCFD] min-h-screen pb-24">
      {/* Top Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-400">
            <Link href="/marketplace" className="hover:text-gray-900 transition-colors">Marketplace</Link>
            <span>/</span>
            <span className="hover:text-gray-900 transition-colors cursor-pointer">{listing.category}</span>
            <span>/</span>
            <span className="text-gray-900 line-clamp-1">{listing.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-red-500 transition-colors">
              <Heart size={16} /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Media Gallery Section */}
        <div className="mb-12">
          <div className="relative rounded-[32px] overflow-hidden bg-gray-100 group aspect-[16/9] md:aspect-[21/9]">
            <img 
              src={images[currentImageIndex]} 
              alt={listing.title} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            
            {/* Gallery Controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Expand Button */}
                <button 
                  onClick={() => setIsFullScreenMode(true)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
                >
                  <Expand size={18} />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md">
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-4 mt-4 overflow-x-auto pb-4 hide-scrollbar">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-gray-900 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
          
          {/* Main Info */}
          <div className="space-y-12">
            
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-wider">
                  {listing.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                  listing.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                  listing.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {listing.status}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                {listing.title}
              </h1>
              <p className="text-[28px] font-bold text-gray-900 tracking-tight">₹{listing.price}</p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-gray-100">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Condition</p>
                <p className="text-[15px] font-bold text-gray-900">{listing.condition || "Not specified"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Posted</p>
                <p className="text-[15px] font-bold text-gray-900">{format(new Date(listing.postedDate), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                <p className="text-[15px] font-bold text-gray-900">{listing.location || "On Campus"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Views</p>
                <p className="text-[15px] font-bold text-gray-900">248</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">About this item</h2>
              <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed">
                <p className="whitespace-pre-wrap">{listing.description}</p>
              </div>
            </div>

            {/* Seller Info Mobile (Hidden on Desktop) */}
            <div className="lg:hidden py-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Meet the Seller</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {listing.userId[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">User {listing.userId}</h3>
                  <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck size={16} /> Verified Student
                  </p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Sticky Sidebar */}
          <div className="relative">
            <div className="sticky top-8 space-y-6">
              
              {/* Action Card */}
              <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">₹{listing.price}</h3>
                
                {isSeller ? (
                  <div className="mt-8 space-y-4">
                    <p className="text-sm font-semibold text-gray-500">Manage Listing Status</p>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => handleStatusChange('Available')}
                        className={`w-full py-3.5 rounded-full text-sm font-bold transition-all ${listing.status === 'Available' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                      >
                        Mark Available
                      </button>
                      <button 
                        onClick={() => handleStatusChange('Pending')}
                        className={`w-full py-3.5 rounded-full text-sm font-bold transition-all ${listing.status === 'Pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                      >
                        Mark Pending
                      </button>
                      <button 
                        onClick={() => handleStatusChange('Sold')}
                        className={`w-full py-3.5 rounded-full text-sm font-bold transition-all ${listing.status === 'Sold' ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                      >
                        Mark Sold
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8">
                    {listing.status === 'Available' ? (
                      <a 
                        href={`https://wa.me/${listing.contactInfo.replace(/[^\d+]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <MessageCircle size={20} />
                        Chat with Seller
                      </a>
                    ) : (
                      <div className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 px-8 py-4 text-[15px] font-bold text-gray-500">
                        Listing is {listing.status}
                      </div>
                    )}
                    
                    <div className="mt-6 flex items-center justify-center gap-2 text-[12px] font-semibold text-gray-400">
                      <ShieldCheck size={14} /> Transactions are between buyer and seller.
                    </div>
                  </div>
                )}
              </div>

              {/* Seller Card Desktop */}
              <div className="hidden lg:block bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-wider mb-6">Seller Details</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 text-xl font-black">
                    {listing.userId[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">User {listing.userId}</h3>
                    <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck size={16} /> Verified
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
                    View full profile <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Report */}
              <div className="text-center">
                <button className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors inline-flex items-center gap-2">
                  <Flag size={14} /> Report this listing
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isFullScreenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex justify-between items-center p-6 text-white">
              <div className="text-sm font-bold tracking-widest">{currentImageIndex + 1} / {images.length}</div>
              <button 
                onClick={() => setIsFullScreenMode(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center p-4">
              <img 
                src={images[currentImageIndex]} 
                className="max-w-full max-h-full object-contain"
                alt="Fullscreen"
              />
              
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="p-6 flex justify-center gap-2 overflow-x-auto hide-scrollbar">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
