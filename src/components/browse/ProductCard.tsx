"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Clock, Image as ImageIcon } from "lucide-react";
import { Listing } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function ProductCard({ listing }: { listing: Listing }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number, mins: number, text: string, isUrgent: boolean, isCritical: boolean } | null>(null);

  useEffect(() => {
    if (!listing.expiresAt) return;
    
    const updateCountdown = () => {
      const diff = new Date(listing.expiresAt!).getTime() - new Date().getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft({
          hours,
          mins,
          text: `${hours}h ${mins}m`,
          isUrgent: hours < 3,
          isCritical: hours < 1
        });
      } else {
        setTimeLeft(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [listing.expiresAt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const timeAgo = formatDistanceToNow(new Date(listing.postedDate), { addSuffix: true });

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case "Textbooks": return "bg-gray-100 text-gray-600";
      case "Electronics": return "bg-gray-100 text-gray-600";
      case "Gaming": return "bg-gray-100 text-gray-600";
      case "Services": return "bg-gray-100 text-gray-600";
      case "Fashion": return "bg-gray-100 text-gray-600";
      case "Hostel Life": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const isFlashSale = !!listing.discountPercentage && listing.discountPercentage >= 30;

  return (
    <Link href={`/listing/${listing.id}`} className="block h-full outline-none">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ y: isHovered ? -8 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex flex-col overflow-hidden rounded-[20px] bg-white border border-[#ECECEC] p-1.5 h-full"
        style={{
          boxShadow: isHovered 
            ? "0 12px 24px -8px rgba(0,0,0,0.08), 0 4px 12px -4px rgba(0,0,0,0.04)"
            : "0 2px 8px -4px rgba(0,0,0,0.04), 0 1px 3px -1px rgba(0,0,0,0.02)",
        }}
      >
        {/* Subtle Spotlight Effect */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.015), transparent 80%)`
          }}
        />

        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-gradient-to-b from-gray-50 to-gray-100/80 z-10 shadow-[inset_0_1px_4px_rgba(0,0,0,0.03)]">
          
          {/* Elegant Ribbon */}
          {(isFlashSale || timeLeft) && (
            <div className="absolute top-0 left-0 z-20 overflow-hidden w-20 h-20 rounded-tl-[16px]">
              <motion.div 
                animate={isHovered ? { y: [-1, 0] } : {}}
                transition={{ duration: 0.2 }}
                className={`absolute top-4 -left-7 w-28 py-[3.5px] text-center text-[7.5px] font-bold uppercase tracking-[0.15em] text-white/95 shadow-sm backdrop-blur-md ${isFlashSale ? 'bg-orange-500/95' : 'bg-gray-900/90'}`}
                style={{ transform: "rotate(-45deg)" }}
              >
                {isFlashSale ? "Flash Sale" : "Ending Soon"}
              </motion.div>
            </div>
          )}

          {/* Placeholder Image */}
          <motion.div
            animate={{ scale: isHovered ? 1.03 : 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-gray-300"
          >
            <ImageIcon strokeWidth={1} size={28} className="mb-2 opacity-40" />
            <span className="text-[10px] font-medium opacity-50 tracking-wide">No Image</span>
          </motion.div>
          
          <div className="absolute bottom-3 left-3 flex gap-2 z-20">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-semibold uppercase tracking-wider backdrop-blur-md bg-white/80 shadow-sm border border-black/[0.03] ${getCategoryColor(listing.category)}`}>
              {listing.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1 p-4 pb-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1 group-hover:text-black transition-colors">
              {listing.title}
            </h3>
          </div>
          
          <p className="text-[13px] text-gray-400/90 line-clamp-2 leading-[1.6] mb-5 flex-1 font-medium">
            {listing.description}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[18px] font-bold text-gray-900 tracking-tight">
              ₹{listing.price}
            </span>
            {listing.originalPrice && (
              <span className="text-[12px] font-medium text-gray-400 line-through decoration-gray-300/80 decoration-1">
                ₹{listing.originalPrice}
              </span>
            )}
          </div>

          {/* Countdown Timer */}
          <AnimatePresence>
            {timeLeft && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mb-4"
              >
                <div 
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${timeLeft.isCritical ? 'bg-red-50/50 text-red-600 border-red-100' : 'bg-gray-50/80 text-gray-500 border-gray-200/60'}`}
                >
                  <Clock size={12} className={timeLeft.isCritical ? "text-red-500" : "text-gray-400"} />
                  <span className="text-[10.5px] font-medium tracking-wide">
                    {timeLeft.isCritical ? `Expires in ${timeLeft.mins}m` : `Ends in ${timeLeft.text}`}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-3" />

          {/* Seller Info */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7 rounded-full bg-gray-50 overflow-hidden border border-gray-200/60">
                {listing.sellerAvatar ? (
                  <img src={listing.sellerAvatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-medium">
                    S
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-medium text-gray-700">Student</span>
                  {listing.verifiedSeller && <BadgeCheck size={11} className="text-blue-500" strokeWidth={2.5} />}
                </div>
                <span className="text-[10px] text-gray-400/80 font-medium tracking-wide">
                  {timeAgo}
                </span>
              </div>
            </div>
            
            <span className="text-[10px] font-medium text-gray-400 line-clamp-1 max-w-[80px]">
              {listing.collegeName || "Campus"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

