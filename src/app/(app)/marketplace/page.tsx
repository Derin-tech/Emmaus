"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Package } from "lucide-react";

export default function MarketplaceEntryPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      
      {/* Background elegant gradient/blur */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-30">
        <div className="w-[800px] h-[800px] bg-gradient-to-tr from-blue-100/40 via-purple-50/20 to-teal-50/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
        >
          What would you like to do today?
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-gray-500 font-medium mb-16 max-w-xl"
        >
          Choose one option to continue into the premium marketplace experience.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 w-full">
          
          {/* Buy Card */}
          <Link href="/browse" className="block outline-none group h-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="flex flex-col h-full bg-white/80 backdrop-blur-2xl rounded-[32px] p-10 text-left border border-white/50 relative overflow-hidden transition-all duration-500"
              style={{
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-100/50 flex items-center justify-center mb-8 border border-blue-100 text-blue-600">
                  <ShoppingBag size={32} strokeWidth={1.5} />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 group-hover:text-blue-700 transition-colors">
                  Browse Marketplace
                </h2>
                <p className="text-gray-500 font-medium text-base leading-relaxed mb-12 flex-1">
                  Discover products, textbooks, electronics, accessories, services, and more from fellow students.
                </p>
                
                <div className="mt-auto flex items-center gap-2 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Start Shopping 
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Sell Card */}
          <Link href="/post" className="block outline-none group h-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="flex flex-col h-full bg-white/80 backdrop-blur-2xl rounded-[32px] p-10 text-left border border-white/50 relative overflow-hidden transition-all duration-500"
              style={{
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100/50 flex items-center justify-center mb-8 border border-emerald-100 text-emerald-600">
                  <Package size={32} strokeWidth={1.5} />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 group-hover:text-emerald-700 transition-colors">
                  Sell an Item
                </h2>
                <p className="text-gray-500 font-medium text-base leading-relaxed mb-12 flex-1">
                  Upload your product, images, videos, price, and description to reach thousands of students instantly.
                </p>
                
                <div className="mt-auto flex items-center gap-2 font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  Sell Now 
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>
          
        </div>
      </div>
    </div>
  );
}
