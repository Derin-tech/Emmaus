"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Clock, Tag, TrendingUp, Gift, Zap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

function HighlightCard({ title, value, subtitle, icon: Icon, colorClass, gradientClass, delay, onClick }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative cursor-pointer overflow-hidden rounded-[24px] bg-white p-6 border border-gray-100 shadow-sm`}
    >
      {/* Hover Gradient Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradientClass}`} />
      
      {/* Icon Area */}
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-[18px] ${colorClass}`}>
        <motion.div
          animate={{ rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0, scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={28} strokeWidth={2} />
        </motion.div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
        <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
        <p className="mt-1 text-sm font-medium text-gray-500">{subtitle}</p>
      </div>

      <motion.div
        className="mt-6 flex items-center text-sm font-bold"
        animate={{ x: isHovered ? 5 : 0 }}
        style={{ color: isHovered ? "#3B82F6" : "#9CA3AF" }}
      >
        Explore <ArrowRight size={16} className="ml-1" />
      </motion.div>
    </motion.div>
  );
}

export default function TodaysHighlights({ onFilterSelect }: { onFilterSelect: (filter: string) => void }) {
  const [timeLeft, setTimeLeft] = useState("");

  // Live countdown for "Ending Tonight"
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft(`${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m Remaining`);
      } else {
        setTimeLeft("Ended");
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mb-16 pt-8">
      {/* Background gradient & sparkles */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F0F7FF] to-[#F5F3FF] rounded-[40px] -z-10 opacity-60" />
      
      {/* Animated Sparkles */}
      <motion.div 
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }} 
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-10 text-yellow-400"
      >
        <Sparkles size={24} />
      </motion.div>
      <motion.div 
        animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1, 0.8] }} 
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 right-10 text-purple-400"
      >
        <Sparkles size={16} />
      </motion.div>

      <div className="px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-3 flex items-center justify-center gap-3">
            <Flame className="text-orange-500" size={32} />
            Today's Highlights
          </h2>
          <p className="text-lg font-medium text-gray-500 max-w-2xl mx-auto">
            Limited-time deals and trending student offers available today.
          </p>
        </div>

        {/* Flash Sale Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-blue-600 to-indigo-600 p-8 mb-8 text-white shadow-lg cursor-pointer"
          onClick={() => onFilterSelect("Offers Today")}
        >
          {/* Lightning bg decoration */}
          <motion.div 
            className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap size={180} />
          </motion.div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <Zap className="text-yellow-300" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1">Flash Deals Ending Tonight</h3>
                <p className="text-blue-100 font-medium">Up to 60% off on premium textbooks and electronics.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10">
              <Clock className="text-yellow-300" size={24} />
              <div className="font-mono text-2xl font-bold tracking-wider text-yellow-300">
                {timeLeft}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <HighlightCard
            title="Offers Today"
            value="126"
            subtitle="Active discounts"
            icon={Flame}
            colorClass="bg-orange-100 text-orange-600"
            gradientClass="bg-gradient-to-br from-orange-500 to-red-500"
            delay={0.1}
            onClick={() => onFilterSelect("Offers Today")}
          />
          <HighlightCard
            title="Expiring Soon"
            value="42"
            subtitle="Ending in < 24h"
            icon={Clock}
            colorClass="bg-blue-100 text-blue-600"
            gradientClass="bg-gradient-to-br from-blue-500 to-indigo-500"
            delay={0.2}
            onClick={() => onFilterSelect("Expiring Soon")}
          />
          <HighlightCard
            title="Best Deals"
            value="89"
            subtitle="Highest savings"
            icon={Tag}
            colorClass="bg-emerald-100 text-emerald-600"
            gradientClass="bg-gradient-to-br from-emerald-500 to-teal-500"
            delay={0.3}
            onClick={() => onFilterSelect("Best Deals")}
          />
          <HighlightCard
            title="Under ₹500"
            value="315"
            subtitle="Budget friendly"
            icon={Gift}
            colorClass="bg-pink-100 text-pink-600"
            gradientClass="bg-gradient-to-br from-pink-500 to-rose-500"
            delay={0.4}
            onClick={() => onFilterSelect("Under 500")}
          />
        </div>
      </div>
    </section>
  );
}
