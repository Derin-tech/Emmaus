"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mockListings } from "@/lib/mock-data";
import { Listing } from "@/types";
import { 
  Search, SlidersHorizontal, ChevronDown, X, BookOpen, 
  Laptop, Smartphone, Headphones, Gamepad2, Briefcase, 
  Bed, Shirt, Ticket, Box
} from "lucide-react";

import AnimatedGradientBackground from "@/components/browse/AnimatedGradientBackground";
import ProductCard from "@/components/browse/ProductCard";
import TodaysHighlights from "@/components/browse/TodaysHighlights";

// Helper components for Discovery View
function CategoryDiscovery({ onSelectCategory }: { onSelectCategory: (cat: string) => void }) {
  const sections = [
    {
      title: "Study",
      items: [
        { name: "Textbooks", icon: BookOpen, color: "bg-blue-50 text-blue-600" },
        { name: "Notes & Guides", icon: BookOpen, color: "bg-indigo-50 text-indigo-600" },
      ]
    },
    {
      title: "Electronics",
      items: [
        { name: "Accessories", icon: Laptop, color: "bg-cyan-50 text-cyan-600" },
        { name: "Mobile Phones", icon: Smartphone, color: "bg-teal-50 text-teal-600" },
        { name: "Audio", icon: Headphones, color: "bg-sky-50 text-sky-600" },
      ]
    },
    {
      title: "Entertainment & Gaming",
      items: [
        { name: "Gaming", icon: Gamepad2, color: "bg-purple-50 text-purple-600" },
        { name: "Events", icon: Ticket, color: "bg-fuchsia-50 text-fuchsia-600" },
      ]
    },
    {
      title: "Services & Others",
      items: [
        { name: "Services", icon: Briefcase, color: "bg-emerald-50 text-emerald-600" },
        { name: "Requests", icon: Box, color: "bg-amber-50 text-amber-600" },
        { name: "Others", icon: Box, color: "bg-gray-50 text-gray-600" },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-16 py-12">
      {sections.map((section, sIdx) => (
        <motion.div 
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sIdx * 0.1 }}
          className="relative"
        >
          <div className="sticky top-24 z-30 bg-[#FCFDFD]/80 backdrop-blur-md py-4 mb-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {section.items.map((item, iIdx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCategory(item.name)}
                  className="group cursor-pointer rounded-2xl bg-white p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const categoryParam = searchParams?.get('category') || '';
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Filtering states
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 100000]);
  const [activeSort, setActiveSort] = useState("Lowest Price");
  
  const [activeSpecialFilter, setActiveSpecialFilter] = useState<string>('');
  
  const isDiscoveryView = !activeCategory && !searchQuery && !activeSpecialFilter;

  // Handle URL updates gracefully
  const updateCategory = (cat: string) => {
    setActiveCategory(cat);
    setActiveSpecialFilter('');
    router.push(cat ? `/browse?category=${encodeURIComponent(cat)}` : '/browse');
  };

  const updateSpecialFilter = (filter: string) => {
    setActiveSpecialFilter(filter === activeSpecialFilter ? '' : filter);
    setActiveCategory(''); // clear standard category when viewing special highlights
  };

  useEffect(() => {
    if (categoryParam !== activeCategory) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredListings = mockListings.filter((listing) => {
    const matchesCategory = !activeCategory || activeCategory === 'All' || listing.category === activeCategory || listing.category.includes(activeCategory);
    const matchesStatus = listing.status !== 'Sold';
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      listing.category.toLowerCase().includes(searchLower) ||
      listing.title.toLowerCase().includes(searchLower) ||
      listing.description.toLowerCase().includes(searchLower);

    const matchesBudget = listing.price >= budgetRange[0] && listing.price <= budgetRange[1];

    // Special Highlights Logic
    let matchesSpecialFilter = true;
    if (activeSpecialFilter === "Offers Today" || activeSpecialFilter === "Best Deals") {
      matchesSpecialFilter = !!listing.discountPercentage && listing.discountPercentage > 0;
    } else if (activeSpecialFilter === "Expiring Soon") {
      matchesSpecialFilter = !!listing.expiresAt && (new Date(listing.expiresAt).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000);
    } else if (activeSpecialFilter === "Under 500") {
      matchesSpecialFilter = listing.price < 500;
    }

    return matchesCategory && matchesStatus && matchesSearch && matchesBudget && matchesSpecialFilter;
  }).sort((a, b) => {
    if (activeSort === "Lowest Price") return a.price - b.price;
    if (activeSort === "Highest Price") return b.price - a.price;
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });

  return (
    <div className="min-h-screen relative font-sans">
      <AnimatedGradientBackground />
      
      <div className="relative z-10">
        {/* Sticky Discovery Header */}
        <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 pt-6 pb-4 px-4 sm:px-6 lg:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Header Title */}
              <div 
                className="cursor-pointer"
                onClick={() => { updateCategory(''); setActiveSpecialFilter(''); }}
              >
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                  Marketplace 
                  {!isDiscoveryView && activeCategory && (
                    <span className="text-gray-400 font-medium text-lg">/ {activeCategory}</span>
                  )}
                  {!isDiscoveryView && activeSpecialFilter && (
                    <span className="text-orange-500 font-bold text-lg">/ {activeSpecialFilter}</span>
                  )}
                </h1>
              </div>
              
              {/* Premium Search Bar */}
              <motion.div 
                className="relative w-full sm:max-w-md"
                animate={{ 
                  scale: isSearchFocused ? 1.02 : 1,
                  boxShadow: isSearchFocused ? "0 0 0 4px rgba(59, 130, 246, 0.1)" : "0 0 0 0px rgba(59, 130, 246, 0)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <motion.div
                    animate={{ rotate: isSearchFocused ? 90 : 0, color: isSearchFocused ? "#3B82F6" : "#9CA3AF" }}
                  >
                    <Search size={18} strokeWidth={2.5} />
                  </motion.div>
                </div>
                <input
                  type="text"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-2xl border border-gray-200 bg-white/80 py-3 pl-12 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Search products, services, textbooks..."
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </motion.div>
            </div>
            
            {/* Quick Access Filter Chips */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pt-3 pb-1 mt-2 border-t border-gray-100/50">
              {["Offers Today", "Expiring Soon", "Trending", "Best Deals", "Under 500"].map(filter => {
                const isActive = activeSpecialFilter === filter;
                return (
                  <motion.button
                    key={filter}
                    onClick={() => updateSpecialFilter(filter)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      backgroundColor: isActive ? "#111827" : "#FFFFFF",
                      color: isActive ? "#FFFFFF" : "#4B5563",
                      borderColor: isActive ? "#111827" : "#E5E7EB",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-sm whitespace-nowrap`}
                  >
                    {filter === "Offers Today" && <span className="text-[10px]">🔥</span>}
                    {filter === "Expiring Soon" && <span className="text-[10px]">⏳</span>}
                    {filter === "Trending" && <span className="text-[10px]">⭐</span>}
                    {filter === "Best Deals" && <span className="text-[10px]">💰</span>}
                    {filter === "Under 500" && <span className="text-[10px]">🎁</span>}
                    {filter}
                  </motion.button>
                )
              })}
            </div>

            {/* Active Standard Filters (Only shown in Product View) */}
            <AnimatePresence>
              {!isDiscoveryView && (
                <motion.div 
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="flex gap-2 overflow-x-auto hide-scrollbar pb-1"
                >
                  {activeCategory && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100">
                      {activeCategory}
                      <button onClick={() => updateCategory('')} className="hover:text-blue-900"><X size={12}/></button>
                    </div>
                  )}
                  {searchQuery && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-gray-900"><X size={12}/></button>
                    </div>
                  )}
                  {activeSort !== "Lowest Price" && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 border border-purple-100">
                      Sort: {activeSort}
                      <button onClick={() => setActiveSort("Lowest Price")} className="hover:text-purple-900"><X size={12}/></button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-32">
          
          {isDiscoveryView ? (
            <>
              <TodaysHighlights onFilterSelect={updateSpecialFilter} />
              <CategoryDiscovery onSelectCategory={updateCategory} />
            </>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Filter Sidebar */}
              <div className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-32 space-y-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Sort By</h3>
                    <div className="space-y-2">
                      {["Newest", "Lowest Price", "Highest Price"].map(sort => (
                        <label key={sort} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeSort === sort ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {activeSort === sort && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className={`text-sm font-medium ${activeSort === sort ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>
                            {sort}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center justify-between">
                      Budget 
                      <span className="text-[10px] text-gray-400 font-normal normal-case">₹{budgetRange[0]} - ₹{budgetRange[1]}</span>
                    </h3>
                    <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      step="500"
                      value={budgetRange[1]}
                      onChange={(e) => setBudgetRange([0, parseInt(e.target.value)])}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Condition</h3>
                    <div className="space-y-2">
                      {["Brand New", "Like New", "Good", "Fair"].map(condition => (
                        <label key={condition} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                          <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            {condition}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1">
                {/* Smart Stats */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Showing <span className="text-gray-900 font-bold">{filteredListings.length}</span> results
                  </p>
                  
                  <button className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm">
                    <SlidersHorizontal size={14} /> Filters
                  </button>
                </div>

                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
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
                        <ProductCard listing={listing} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                      <div className="h-24 w-24 mb-6 relative">
                        <motion.div
                          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500"
                        >
                          <Search size={40} />
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-500 font-medium max-w-sm mb-6">
                        We couldn't find anything matching your filters. Try adjusting your budget or search terms.
                      </p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setBudgetRange([0, 100000]);
                          updateCategory('');
                        }}
                        className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-semibold shadow-sm hover:bg-gray-800 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}

// Wrapper for useSearchParams
export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FCFDFD]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Search className="text-blue-500" size={32} />
        </motion.div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
