"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, Laptop, Smartphone, Headphones, Mouse, Gamepad2, 
  Watch, Keyboard, FileText, Calculator, Briefcase, Shirt, 
  Footprints, Clock, Armchair, Bed, Coffee, Bike, Trophy, 
  Guitar, Camera, Ticket, GraduationCap, PenTool, Terminal, 
  Package, Search, ArrowRight, Sparkles, ChevronRight
} from "lucide-react";

// Categorized data
const SECTIONS = [
  {
    title: "Study",
    items: [
      { name: "Textbooks", icon: BookOpen, desc: "Engineering, medical & arts", count: 2300, trending: true },
      { name: "Notes & Guides", icon: FileText, desc: "Handwritten class notes", count: 3100, trending: true },
      { name: "Tutoring", icon: GraduationCap, desc: "Peer tutoring & assignment help", count: 560 },
      { name: "Calculators", icon: Calculator, desc: "Scientific & graphing", count: 890 },
    ]
  },
  {
    title: "Electronics",
    items: [
      { name: "Laptops", icon: Laptop, desc: "Laptops and tablets", count: 1400, trending: true },
      { name: "Mobile Phones", icon: Smartphone, desc: "Smartphones & accessories", count: 980 },
      { name: "Audio", icon: Headphones, desc: "Earbuds & headphones", count: 850 },
      { name: "Accessories", icon: Mouse, desc: "Monitors, cables & stands", count: 640 },
      { name: "Keyboards", icon: Keyboard, desc: "Mechanical keyboards & mice", count: 530 },
      { name: "Smartwatches", icon: Watch, desc: "Fitness bands & smartwatches", count: 420 },
    ]
  },
  {
    title: "Hostel Life",
    items: [
      { name: "Hostel Essentials", icon: Bed, desc: "Mattresses, pillows & organizers", count: 1200 },
      { name: "Furniture", icon: Armchair, desc: "Tables, chairs & shelves", count: 480 },
      { name: "Kitchen", icon: Coffee, desc: "Kettles, induction & utensils", count: 620 },
    ]
  },
  {
    title: "Fashion",
    items: [
      { name: "Clothing", icon: Shirt, desc: "College merch & hoodies", count: 1100 },
      { name: "Shoes", icon: Footprints, desc: "Sneakers & formal wear", count: 750 },
      { name: "Bags", icon: Briefcase, desc: "College bags & laptop sleeves", count: 540 },
      { name: "Watches", icon: Clock, desc: "Analog & digital watches", count: 210 },
    ]
  },
  {
    title: "Entertainment & Sports",
    items: [
      { name: "Gaming", icon: Gamepad2, desc: "Consoles, games & accounts", count: 760 },
      { name: "Event Tickets", icon: Ticket, desc: "College fests & concerts", count: 890 },
      { name: "Cycles", icon: Bike, desc: "Bicycles & riding gear", count: 390 },
      { name: "Sports", icon: Trophy, desc: "Rackets, bats & balls", count: 510 },
      { name: "Instruments", icon: Guitar, desc: "Guitars, keyboards & flutes", count: 280 },
    ]
  },
  {
    title: "Services & Gigs",
    items: [
      { name: "Photography", icon: Camera, desc: "DSLRs, lenses & shoots", count: 150 },
      { name: "Design", icon: PenTool, desc: "Posters, logos & UI/UX", count: 410 },
      { name: "Coding", icon: Terminal, desc: "Project help & debugging", count: 720 },
      { name: "Internships", icon: Briefcase, desc: "Part-time & freelance roles", count: 340 },
    ]
  },
  {
    title: "Other",
    items: [
      { name: "Miscellaneous", icon: Package, desc: "Anything else you need", count: 950 },
    ]
  }
];

// Rolling Counter Component
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (inView && ref.current) {
      let current = 0;
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      
      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutExpo)
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        current = Math.floor(ease * value);
        
        if (ref.current) {
          ref.current.textContent = current >= 1000 ? `${(current / 1000).toFixed(1)}K` : current.toString();
        }
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      
      requestAnimationFrame(update);
    }
  }, [inView, value]);
  
  return <span ref={ref}>0</span>;
}

// Interactive Category Card Component
function CategoryCard({ item }: { item: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <Link href={`/browse?category=${encodeURIComponent(item.name)}`} className="block outline-none" tabIndex={-1}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group relative flex flex-col justify-between h-full min-h-[180px] p-5 rounded-[24px] bg-white overflow-hidden cursor-pointer"
        style={{
          boxShadow: "0 4px 12px -2px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {/* Very subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
        
        {/* Soft top-to-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Inner Highlight border (macOS style) */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

        {/* Animated highlight passing across every 12 seconds */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.8),transparent)] w-[200%] -left-[100%]"
          animate={{ x: ["0%", "150%", "150%"] }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
        />

        <div className="relative z-10 flex items-start justify-between">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-gray-50/80 border border-gray-100/80 text-gray-700 shadow-sm"
            animate={{
              rotate: isHovered ? [0, -8, 8, -4, 4, 0] : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{
              rotate: { duration: 0.5 },
              scale: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <Icon size={20} strokeWidth={1.5} />
          </motion.div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-100 text-[11px] font-semibold text-gray-500 shadow-sm group-hover:border-gray-200 transition-colors">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <Counter value={item.count} />
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-6">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {item.name}
            </h3>
            {item.trending && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-[10px]">
                🔥
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 font-medium leading-relaxed">
            {item.desc}
          </p>
        </div>

        {/* Hover Arrow */}
        <motion.div
          className="absolute bottom-5 right-5 text-gray-300 group-hover:text-gray-900 transition-colors duration-300"
          animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <ArrowRight size={16} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default function BrowseCategories() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Header Area */}
      <div className="sticky top-0 z-40 bg-[#FDFDFD]/80 backdrop-blur-xl border-b border-gray-100/80 pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Discover</h1>
              <p className="mt-1 text-sm text-gray-500 font-medium">Browse categories to find exactly what you need.</p>
            </div>
            
            <motion.div 
              className="relative w-full sm:w-80"
              animate={{ width: searchFocused ? "100%" : "auto" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <motion.div
                  animate={{ rotate: searchFocused ? 90 : 0, color: searchFocused ? "#3B82F6" : "#9CA3AF" }}
                  transition={{ type: "spring" }}
                >
                  <Search size={16} />
                </motion.div>
              </div>
              <input
                type="text"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="block w-full rounded-full border border-gray-200/80 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                placeholder="Search categories..."
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 pb-32">
        <div className="flex flex-col gap-16">
          {SECTIONS.map((section, sectionIdx) => (
            <motion.section 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              {/* Sticky Heading */}
              <div className="sticky top-24 z-30 bg-[#FDFDFD]/90 backdrop-blur-md py-4 mb-4 border-b border-gray-100/50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {section.title}
                  <span className="text-gray-300 text-sm font-normal">
                    {section.items.length} categories
                  </span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {section.items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    // Tiny natural offset for that handcrafted feel
                    style={{ marginTop: index % 2 === 0 ? "0px" : "12px" }}
                  >
                    <CategoryCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  );
}
