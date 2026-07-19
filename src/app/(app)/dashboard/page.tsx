"use client";

import { useState } from "react";
import { mockListings } from "@/lib/mock-data";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Tag, Edit2, Trash2, CheckCircle2, TrendingUp, Eye, 
  Bookmark, MessageSquare, Plus, DollarSign, Package, Image as ImageIcon, MapPin
} from "lucide-react";
import Link from "next/link";

const TABS = ["Active", "Sold", "Drafts", "Expired"];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("Active");
  
  // Dummy data filtering for demo
  const activeListings = mockListings.filter(l => l.status === 'Available');
  const soldListings = mockListings.filter(l => l.status === 'Sold');

  const displayListings = activeTab === "Active" ? activeListings : activeTab === "Sold" ? soldListings : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Seller Dashboard</h1>
            <p className="mt-2 text-gray-500 font-medium text-lg">Manage your marketplace presence and track performance.</p>
          </div>
          <Link 
            href="/post" 
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus size={18} strokeWidth={2.5} />
            Sell New Item
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Eye size={48} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Views</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">1,248</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-50 w-fit px-2 py-1 rounded-md">
              <TrendingUp size={12} /> +12% this week
            </div>
          </div>
          
          <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500">
              <Bookmark size={48} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Saves</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">342</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              Across 12 listings
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-purple-500">
              <MessageSquare size={48} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Messages</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">18</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-50 w-fit px-2 py-1 rounded-md">
              4 unread
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[24px] p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-400">
              <DollarSign size={48} />
            </div>
            <p className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-1">Total Earnings</p>
            <h3 className="text-3xl font-black text-white tracking-tighter">₹12,450</h3>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 size={14} /> 4 items sold
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-[32px] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          
          {/* Tabs */}
          <div className="border-b border-gray-100 px-6 sm:px-10 flex gap-8">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 text-sm font-bold tracking-wide transition-colors relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="dashboardTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="p-6 sm:p-10 min-h-[400px]">
            {displayListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayListings.map(listing => (
                  <div key={listing.id} className="group flex flex-col bg-white border border-gray-100 rounded-[24px] overflow-hidden hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                    
                    <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                        <ImageIcon strokeWidth={1.5} size={32} className="mb-2 opacity-50" />
                        <span className="text-xs font-semibold opacity-60">No Media</span>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                          {listing.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-[15px] line-clamp-1 mb-1">{listing.title}</h3>
                      <p className="text-[18px] font-extrabold text-gray-900 tracking-tight mb-4">₹{listing.price}</p>
                      
                      <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-6">
                        <div className="flex items-center gap-1.5"><Eye size={14} /> 245</div>
                        <div className="flex items-center gap-1.5"><Bookmark size={14} /> 32</div>
                        <div className="flex items-center gap-1.5"><MessageSquare size={14} /> 5</div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-2">
                        <Link href={`/listing/${listing.id}`} className="flex items-center justify-center py-2.5 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors">
                          View
                        </Link>
                        <button className="flex items-center justify-center py-2.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                  <Package size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} Listings</h3>
                <p className="text-gray-500 font-medium max-w-sm">You don't have any items in this category right now.</p>
                {activeTab === "Active" && (
                  <Link href="/post" className="mt-8 px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold shadow-sm hover:bg-gray-800 hover:-translate-y-0.5 transition-all">
                    Create your first listing
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
