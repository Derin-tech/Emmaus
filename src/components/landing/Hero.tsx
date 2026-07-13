"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Book, Gamepad2, Briefcase, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import Magnetic from '@/components/ui/Magnetic';

// Particle component
const Particles = () => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, duration: number}[]>([]);
  
  useEffect(() => {
    setMounted(true);
    const newParticles = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-blue-500 rounded-full"
          style={{ width: p.size * 4, height: p.size * 4 }}
          initial={{
            x: p.x,
            y: p.y,
            opacity: 0,
          }}
          animate={{
            y: [p.y, p.y - 150],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  // 3D Mouse tracking for cards container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(useSpring(mouseY, { stiffness: 100, damping: 30 }), [-500, 500], [15, -15]);
  const rotateY = useTransform(useSpring(mouseX, { stiffness: 100, damping: 30 }), [-500, 500], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative overflow-hidden bg-white pt-24 sm:pt-32 pb-24 sm:pb-32">
      <Particles />
      {/* Background gradients */}
      <div className="absolute inset-x-0 -top-40 z-0 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80b5ff] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 border border-blue-100">
            <Sparkles size={16} />
            <span>The ultimate campus marketplace</span>
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
            Trade locally with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">your college peers.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Buy, sell, and exchange textbooks, gaming accounts, and services exclusively with verified students. Say goodbye to scattered WhatsApp groups.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Magnetic>
              <Link
                href="/browse"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
              >
                Browse Campus Deals
                <ArrowRight size={18} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/post"
                className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-blue-600 cursor-pointer px-4 py-3.5"
              >
                Post an Ad <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
          </div>
        </motion.div>
        
        {/* 3D Floating Cards & Background Image */}
        <div className="relative mt-20 sm:mt-24 w-full">
          {/* Background Image with Fade Overlays */}
          <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none opacity-50 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 w-full max-w-5xl mx-auto h-[400px] top-1/2 -translate-y-1/2">
              <Image 
                src="/hero.png" 
                alt="Marketplace Background" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white" />
            </div>
          </div>

          <div 
            className="relative h-[300px] sm:h-[400px] w-full max-w-4xl mx-auto flex justify-center items-center perspective-1000 hidden md:flex z-10"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
          <motion.div 
            className="w-full h-full absolute inset-0 flex justify-center items-center preserve-3d"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {/* Card 1 */}
            <motion.div 
              className="absolute z-10 w-64 rounded-2xl bg-white/80 p-5 shadow-2xl ring-1 ring-gray-900/10 backdrop-blur-md cursor-pointer"
              initial={{ x: -200, y: 50, z: 50, rotate: -15, opacity: 0 }}
              animate={{ x: -180, y: 20, z: 50, rotate: -10, opacity: 1 }}
              transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: -5, zIndex: 30, backgroundColor: 'rgba(255,255,255,1)', z: 80 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Book size={20} /></div>
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Textbooks</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Engineering Math Vol 2</h3>
              <p className="text-xl font-black text-blue-600">₹450</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              className="absolute z-20 w-64 rounded-2xl bg-white/80 p-5 shadow-2xl ring-1 ring-gray-900/10 backdrop-blur-md cursor-pointer"
              initial={{ x: 0, y: -50, z: 80, rotate: 0, opacity: 0 }}
              animate={{ x: 0, y: -20, z: 80, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 50, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -40, zIndex: 30, backgroundColor: 'rgba(255,255,255,1)', z: 120 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Briefcase size={20} /></div>
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Services</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">React Project Help</h3>
              <p className="text-xl font-black text-blue-600">₹1000</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              className="absolute z-10 w-64 rounded-2xl bg-white/80 p-5 shadow-2xl ring-1 ring-gray-900/10 backdrop-blur-md cursor-pointer"
              initial={{ x: 200, y: 50, z: 50, rotate: 15, opacity: 0 }}
              animate={{ x: 180, y: 20, z: 50, rotate: 10, opacity: 1 }}
              transition={{ type: "spring", stiffness: 50, delay: 0.6 }}
              whileHover={{ scale: 1.05, rotate: 5, zIndex: 30, backgroundColor: 'rgba(255,255,255,1)', z: 80 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Gamepad2 size={20} /></div>
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Gaming</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Valo Diamond Acc</h3>
              <p className="text-xl font-black text-blue-600">₹1500</p>
            </motion.div>
          </motion.div>

        </div>
        
        {/* Mobile static representation of cards */}
        <div className="mt-16 flex flex-col items-center gap-4 md:hidden">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-900/5 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Briefcase size={20} /></div>
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Services</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">React Project Help</h3>
              <p className="text-xl font-black text-blue-600">₹1000</p>
            </div>
            
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-900/5 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Book size={20} /></div>
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Textbooks</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Engineering Math Vol 2</h3>
              <p className="text-xl font-black text-blue-600">₹450</p>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}
