"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Ticket } from "lucide-react";

const CATEGORIES = [
  { name: "Textbooks", emoji: "📚", desc: "Used engineering, medical, arts books.", count: 2300, trending: true },
  { name: "Electronics", emoji: "💻", desc: "Laptops, tablets, and components.", count: 1400, trending: true },
  { name: "Notes & Study Materials", emoji: "📖", desc: "Handwritten notes and guides.", count: 3100, trending: true },
  { name: "Mobile Phones", emoji: "📱", desc: "Smartphones and accessories.", count: 980 },
  { name: "Headphones & Audio", emoji: "🎧", desc: "Earbuds, headphones, and speakers.", count: 850 },
  { name: "Gaming", emoji: "🎮", desc: "Consoles, games, and accounts.", count: 760 },
  { name: "Bags & Backpacks", emoji: "🎒", desc: "College bags and laptop sleeves.", count: 540 },
  { name: "Hostel Essentials", emoji: "🛏️", desc: "Mattresses, pillows, and organizers.", count: 1200 },
  { name: "Computer Accessories", emoji: "🖥️", desc: "Monitors, cables, and stands.", count: 640 },
  { name: "Smartwatches", emoji: "⌚", desc: "Fitness bands and smartwatches.", count: 420 },
  { name: "Keyboards & Mouse", emoji: "⌨️", desc: "Mechanical keyboards and mice.", count: 530 },
  { name: "Calculators", emoji: "🧮", desc: "Scientific and graphing calculators.", count: 890 },
  { name: "Clothing & Hoodies", emoji: "👕", desc: "College merch and fashion.", count: 1100 },
  { name: "Shoes", emoji: "👟", desc: "Sneakers and formal wear.", count: 750 },
  { name: "Hostel Furniture", emoji: "🪑", desc: "Tables, chairs, and shelves.", count: 480 },
  { name: "Kitchen Appliances", emoji: "🍜", desc: "Kettles, induction, and utensils.", count: 620 },
  { name: "Cycles", emoji: "🚲", desc: "Bicycles and riding gear.", count: 390 },
  { name: "Sports Equipment", emoji: "🏸", desc: "Rackets, bats, and balls.", count: 510 },
  { name: "Musical Instruments", emoji: "🎸", desc: "Guitars, keyboards, and flutes.", count: 280 },
  { name: "Cameras", emoji: "📷", desc: "DSLRs, lenses, and tripods.", count: 150 },
  { name: "Event Tickets", emoji: "🎟️", desc: "College fests and concerts.", count: 890 },
  { name: "Internships & Jobs", emoji: "💼", desc: "Part-time and freelance roles.", count: 340 },
  { name: "Tutoring Services", emoji: "👨‍🏫", desc: "Peer tutoring and assignment help.", count: 560 },
  { name: "Graphic Design", emoji: "🎨", desc: "Posters, logos, and UI/UX.", count: 410 },
  { name: "Coding Services", emoji: "💻", desc: "Project help and debugging.", count: 720 },
  { name: "Watches", emoji: "⌚", desc: "Analog and digital watches.", count: 210 },
  { name: "Miscellaneous", emoji: "📦", desc: "Anything else you need.", count: 950 },
];

function CountingNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            // Format number (e.g. 2300 -> 2.3K)
            const formatted = v >= 1000 ? `${(v / 1000).toFixed(1)}K` : Math.floor(v).toString();
            ref.current.textContent = formatted;
          }
        },
      });
      return () => controls.stop();
    }
  }, [inView, value]);

  return <span ref={ref}>0</span>;
}

function CategoryCard({ category, index }: { category: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href="/browse" className="block h-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="group relative flex flex-col h-full rounded-[24px] bg-white/60 backdrop-blur-xl border border-gray-200/50 p-6 overflow-hidden transition-all duration-300"
          whileHover={{ 
            scale: 1.04, 
            y: -8,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.3)",
          }}
          style={{
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Spotlight Effect */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`
            }}
          />

          {/* Trending Ribbon */}
          {category.trending && (
            <div className="absolute top-4 right-0 overflow-hidden rounded-l-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm flex items-center gap-1 z-10">
              <Sparkles size={10} className="animate-pulse" />
              TRENDING
            </div>
          )}

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <motion.div 
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100/50 text-3xl shadow-inner"
                  whileHover={{ 
                    rotate: [0, -10, 10, -5, 5, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {category.emoji}
                </motion.div>
                
                <div className="flex items-center gap-1.5 rounded-full bg-white/80 border border-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <CountingNumber value={category.count} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {category.description}
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Explore listings 
              <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ExploreCategories() {
  const [mounted, setMounted] = useState(false);
  const [floatingItems, setFloatingItems] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Background floating elements (sparkles and tickets)
    setFloatingItems(
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        type: Math.random() > 0.5 ? "sparkle" : "ticket",
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 10,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * -20,
      }))
    );
  }, []);

  return (
    <section className="relative bg-[#FAFAFA] py-24 sm:py-32 overflow-hidden border-t border-gray-100">
      {/* Background Floating Elements */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 opacity-30">
             <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-gradient-to-br from-blue-100/40 via-purple-100/30 to-pink-100/20 mix-blend-multiply blur-3xl animate-mesh-slow" />
          </div>
          {floatingItems.map((item) => (
            <motion.div
              key={item.id}
              className="absolute text-blue-900"
              style={{ left: `${item.x}%`, top: `${item.y}%`, opacity: 0.05 }}
              animate={{
                y: [0, -100, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {item.type === "sparkle" ? (
                <Sparkles size={item.size} />
              ) : (
                <Ticket size={item.size} />
              )}
            </motion.div>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="mx-auto max-w-3xl text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Everything Students Trade
          </h2>
          <p className="text-lg leading-8 text-gray-600">
            Discover the most popular products and services traded within your campus community. 
            From textbooks to coding help, find exactly what you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <CategoryCard key={category.name} category={category} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link 
            href="/browse" 
            className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2"
          >
            View All Categories <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
