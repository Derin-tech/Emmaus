"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, BadgeCheck, Clock, MapPin, ArrowRight, Share2, BookmarkPlus } from "lucide-react";
import { Listing } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export default function ProductCard({ listing }: { listing: Listing }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const timeAgo = formatDistanceToNow(new Date(listing.postedDate), { addSuffix: true });

  // Map category to a soft color
  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case "Textbooks": return "bg-blue-100 text-blue-700";
      case "Electronics": return "bg-cyan-100 text-cyan-700";
      case "Gaming": return "bg-purple-100 text-purple-700";
      case "Services": return "bg-emerald-100 text-emerald-700";
      case "Fashion": return "bg-pink-100 text-pink-700";
      case "Hostel Life": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Determine accent strip
  const getAccentStrip = (cat: string) => {
    switch(cat) {
      case "Textbooks": return "bg-blue-500";
      case "Electronics": return "bg-cyan-500";
      case "Gaming": return "bg-purple-500";
      case "Services": return "bg-emerald-500";
      case "Fashion": return "bg-pink-500";
      case "Hostel Life": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ y: isHovered ? -6 : [0, -2, 0] }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        y: isHovered ? { type: "spring", stiffness: 300, damping: 20 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      className="group relative flex flex-col overflow-hidden rounded-[24px] bg-white border border-gray-200/60 p-1 cursor-pointer h-full"
      style={{
        boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.02)",
      }}
    >
      {/* Spotlight Effect */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.03), transparent 80%)`
        }}
      />

      {/* Top Accent Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${getAccentStrip(listing.category)}`} />

      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-gray-50 z-10">
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 font-medium text-xs"
        >
          {/* Mocking images since we don't have real URLs yet */}
          <span className="opacity-50">No Image Available</span>
        </motion.div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-white/90 shadow-sm border border-black/5 ${getCategoryColor(listing.category)}`}>
            {listing.category}
          </span>
          {listing.condition && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-white/90 text-gray-700 shadow-sm border border-black/5">
              {listing.condition}
            </span>
          )}
        </div>

        {/* Heart Wishlist */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors border border-black/5"
        >
          <Heart size={16} strokeWidth={2} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 p-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {listing.description}
        </p>

        {/* Pricing */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-xl font-extrabold text-gray-900">
            ₹{listing.price}
          </span>
          {listing.originalPrice && (
            <span className="text-sm font-medium text-gray-400 line-through mb-0.5">
              ₹{listing.originalPrice}
            </span>
          )}
          {listing.discountPercentage && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md mb-0.5 ml-auto">
              {listing.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-100 mb-3" />

        {/* Seller Info */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
              {listing.sellerAvatar && (
                <img src={listing.sellerAvatar} alt="Avatar" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold text-gray-700">Student</span>
                {listing.verifiedSeller && <BadgeCheck size={10} className="text-blue-500" />}
              </div>
              <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                <Clock size={8} /> {timeAgo}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500 line-clamp-1 max-w-[80px]">
              {listing.collegeName || "Campus"}
            </span>
          </div>
        </div>
        
        {/* Action Buttons Container (Revealed on Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white via-white to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between opacity-0 group-hover:opacity-100">
          <div className="flex gap-1.5">
            <button className="h-8 w-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
              <BookmarkPlus size={14} />
            </button>
            <button className="h-8 w-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
              <Share2 size={14} />
            </button>
          </div>
          <button className="flex-1 ml-2 h-8 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors shadow-sm">
            View Details
            <motion.span animate={{ x: isHovered ? 2 : 0 }}>
              <ArrowRight size={12} />
            </motion.span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
