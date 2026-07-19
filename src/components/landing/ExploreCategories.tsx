"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, Laptop, Smartphone, Headphones, 
  Gamepad2, Bike, Ticket, Briefcase, ChevronRight, ArrowRight
} from "lucide-react";

// Premium Icon Composites
function CategoryIcon({ icon: Icon, bgFrom, bgTo, iconColor, shadowColor }: any) {
  return (
    <div className={`relative flex items-center justify-center w-14 h-14 rounded-[18px] bg-gradient-to-br ${bgFrom} ${bgTo} shadow-lg ${shadowColor}`}>
      <div className="absolute inset-0 bg-white/20 rounded-[18px] border border-white/40" />
      <Icon size={26} color={iconColor} strokeWidth={2} className="relative z-10" />
    </div>
  );
}

const FEATURED_CATEGORIES = [
  { 
    name: "Books", 
    desc: "Textbooks & novels", 
    icon: <CategoryIcon icon={BookOpen} bgFrom="from-blue-400" bgTo="to-blue-600" iconColor="#fff" shadowColor="shadow-blue-500/30" />,
    color: "bg-blue-50" 
  },
  { 
    name: "Electronics", 
    desc: "Laptops & gadgets", 
    icon: <CategoryIcon icon={Laptop} bgFrom="from-gray-700" bgTo="to-gray-900" iconColor="#fff" shadowColor="shadow-gray-900/30" />,
    color: "bg-gray-50" 
  },
  { 
    name: "Gaming", 
    desc: "Consoles & games", 
    icon: <CategoryIcon icon={Gamepad2} bgFrom="from-purple-500" bgTo="to-indigo-600" iconColor="#fff" shadowColor="shadow-purple-500/30" />,
    color: "bg-purple-50" 
  },
  { 
    name: "Cycles", 
    desc: "Bicycles & gear", 
    icon: <CategoryIcon icon={Bike} bgFrom="from-emerald-400" bgTo="to-emerald-600" iconColor="#fff" shadowColor="shadow-emerald-500/30" />,
    color: "bg-emerald-50" 
  },
  { 
    name: "Tickets", 
    desc: "Movie, Bus & Train", 
    icon: <CategoryIcon icon={Ticket} bgFrom="from-rose-400" bgTo="to-rose-600" iconColor="#fff" shadowColor="shadow-rose-500/30" />,
    color: "bg-rose-50" 
  },

  { 
    name: "Headphones", 
    desc: "Audio & pods", 
    icon: <CategoryIcon icon={Headphones} bgFrom="from-cyan-400" bgTo="to-cyan-600" iconColor="#fff" shadowColor="shadow-cyan-500/30" />,
    color: "bg-cyan-50" 
  },
  { 
    name: "Mobile Phones", 
    desc: "Smartphones", 
    icon: <CategoryIcon icon={Smartphone} bgFrom="from-fuchsia-400" bgTo="to-fuchsia-600" iconColor="#fff" shadowColor="shadow-fuchsia-500/30" />,
    color: "bg-fuchsia-50" 
  },
];

function CategoryCard({ category, index }: { category: any, index: number }) {
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

  return (
    <Link href="/browse" className="block outline-none" tabIndex={-1}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 + 0.2, duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.03, y: -4 }}
        className="group relative flex w-64 shrink-0 cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-sm border border-gray-200/60 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-gray-300"
      >
      {/* Spotlight Effect */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.03), transparent 80%)`
        }}
      />
      
      {/* Decorative inner highlight */}
      <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_1px_rgba(255,255,255,1)] pointer-events-none z-10" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PC9zdmc+')]"/>

      <div className="relative z-10 mb-6">
        <motion.div
          animate={{ y: isHovered ? -4 : 0, scale: isHovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {category.icon}
        </motion.div>
      </div>
      
      <div className="relative z-10 mt-auto">
        <h3 className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">{category.desc}</p>
          <motion.div>
             <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </motion.div>
        </div>
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
            <CategoryCard key={`${category.name}-${index}`} category={category} index={index} />
          ))}
        </motion.div>
      </div>
      
    </section>
  );
}
