"use client";

import { useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Laptop, Gamepad2, Bike, Ticket, Briefcase, FileText, Headphones } from "lucide-react";

const FEATURED_CATEGORIES = [
  { name: "Books", icon: BookOpen, desc: "Textbooks and study guides" },
  { name: "Electronics", icon: Laptop, desc: "Laptops, tablets, and more" },
  { name: "Gaming", icon: Gamepad2, desc: "Consoles and game keys" },
  { name: "Cycles", icon: Bike, desc: "Bicycles and riding gear" },
  { name: "Event Tickets", icon: Ticket, desc: "College fests and concerts" },
  { name: "Services", icon: Briefcase, desc: "Freelance and part-time" },
  { name: "Notes", icon: FileText, desc: "Handwritten class notes" },
  { name: "Audio", icon: Headphones, desc: "Earbuds and headphones" },
];

function CarouselCard({ category }: { category: typeof FEATURED_CATEGORIES[0] }) {
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

  const Icon = category.icon;

  return (
    <Link href="/browse" className="block outline-none" tabIndex={-1}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col justify-between w-[280px] h-[320px] rounded-[22px] bg-white p-6 overflow-hidden cursor-pointer shrink-0 transition-shadow duration-300 ease-out"
        style={{
          boxShadow: "0 2px 4px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03)",
          outline: "2px solid rgba(0, 0, 0, 0.05)",
          outlineOffset: "-2px",
        }}
        animate={{
          y: isHovered ? -8 : [0, -2, 0],
          rotate: isHovered ? 1 : 0,
          boxShadow: isHovered 
            ? "0 30px 60px -12px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0,0,0,0.03)" 
            : "0 2px 4px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03)",
          outline: isHovered ? "2px solid rgba(0, 0, 0, 0.15)" : "2px solid rgba(0, 0, 0, 0.05)",
        }}
        transition={{
          y: isHovered ? { type: "spring", stiffness: 300, damping: 20 } : { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { type: "spring", stiffness: 300, damping: 20 },
          boxShadow: { duration: 0.3, ease: "easeOut" },
          outline: { duration: 0.3, ease: "easeOut" },
        }}
      >
        {/* Spotlight Effect */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0.04), transparent 80%)`
          }}
        />

        <div className="relative z-10">
          <motion.div 
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50/80 border border-gray-100/50 text-gray-800"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0,
            }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
              rotate: { duration: 0.5 }
            }}
          >
            <Icon size={24} strokeWidth={1.5} />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
            {category.name}
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed font-medium">
            {category.desc}
          </p>
        </div>

        <div className="relative z-10 mt-6 flex justify-end">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300"
            animate={{
              x: isHovered ? 4 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowRight size={18} strokeWidth={2} />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ExploreCategories() {
  const [isPaused, setIsPaused] = useState(false);

  // We duplicate the array to allow infinite scrolling
  const duplicatedCategories = [...FEATURED_CATEGORIES, ...FEATURED_CATEGORIES];

  return (
    <section className="relative bg-[#FAFAFA] py-24 sm:py-32 overflow-hidden border-t border-gray-100/50">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Curated Categories
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Explore the most popular items currently trending on campus.
          </p>
        </div>
        
        <Link 
          href="/browse" 
          className="group flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
        >
          View All Categories 
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={16} />
          </motion.span>
        </Link>
      </div>

      <div 
        className="relative z-10 w-full flex overflow-hidden py-8 -my-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-6 px-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -2000, right: 0 }}
          animate={{
            x: isPaused ? undefined : ["0%", "-50%"]
          }}
          transition={{
            x: {
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <CarouselCard key={`${category.name}-${index}`} category={category} />
          ))}
        </motion.div>
      </div>
      
    </section>
  );
}
