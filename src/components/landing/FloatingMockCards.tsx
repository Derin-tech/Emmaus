"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  Heart, MapPin, BadgeCheck, TrendingUp, Bell, QrCode, 
  Book, Laptop, Gamepad2, Headphones, Bike, User, Camera
} from "lucide-react";

// 3D Tilt Hook
function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

// Micro noise texture
const NOISE_BG = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDAwIi8+PC9zdmc+')";

export default function FloatingMockCards() {
  const [magicHeart, setMagicHeart] = useState(false);
  const [magicNotif, setMagicNotif] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMagicHeart(true);
      setTimeout(() => setMagicHeart(false), 2000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMagicNotif(true);
      setTimeout(() => setMagicNotif(false), 5000);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Card 1: Books (Portrait, Bottom Left)
  const CardBooks = () => {
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
    return (
      <motion.div
        className="absolute bottom-[5%] left-[5%] z-20 hidden lg:block"
        animate={{ y: [0, -15, 0], rotateZ: [-2, 0, -2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.05, y: -12 }}
          className="relative w-56 rounded-[24px] bg-white/80 backdrop-blur-xl border-2 border-gray-900 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] cursor-pointer overflow-hidden group"
        >
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-repeat" style={{ backgroundImage: NOISE_BG }} />
          <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] pointer-events-none" />
          
          <div className="relative h-32 w-full rounded-[16px] bg-gradient-to-br from-sky-300 to-blue-500 mb-4 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
            <Book size={48} color="#fff" strokeWidth={1.5} className="drop-shadow-lg" />
            <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1">
              <BadgeCheck size={10} color="#fff" />
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Verified Student</span>
            </div>
          </div>
          
          <h4 className="text-[13px] font-black text-gray-900 leading-tight mb-1">Engineering Mathematics Vol. 2</h4>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-lg font-black text-gray-900 drop-shadow-sm group-hover:text-blue-600 transition-colors">₹450</span>
              <div className="flex items-center gap-1 mt-1 text-gray-500">
                <MapPin size={10} />
                <span className="text-[9px] font-semibold">Hostel Block A</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] font-bold uppercase">Excellent</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Card 2: Electronics (Landscape, Bottom Right)
  const CardElectronics = () => {
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
    return (
      <motion.div
        className="absolute bottom-[10%] right-[8%] z-30 hidden lg:block"
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 8, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.05, y: -12 }}
          className="relative w-72 rounded-[24px] bg-white/90 backdrop-blur-xl border border-gray-200/60 p-4 shadow-[0_24px_50px_rgba(0,0,0,0.06)] cursor-pointer group flex gap-4 items-center overflow-hidden"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />

          <div className="relative h-24 w-24 shrink-0 rounded-[16px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Laptop size={40} color="#fff" strokeWidth={1.5} className="drop-shadow-xl" />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-gradient-to-tr from-pink-300 to-purple-400 rounded-full opacity-50 mix-blend-overlay" />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-sm tracking-wider flex items-center gap-1">
                <TrendingUp size={8} /> Trending
              </div>
              <Heart size={14} className={`text-gray-300 transition-colors ${magicHeart ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'}`} />
            </div>
            <h4 className="text-[14px] font-black text-gray-900 leading-tight mb-0.5">MacBook Air M1</h4>
            <span className="text-[10px] text-gray-400 font-mono tracking-tighter">SN: C02F8392LQ</span>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xl font-black text-gray-900">₹52,000</span>
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <User size={10} className="text-gray-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Card 3: Gaming (Square, Left Edge)
  const CardGaming = () => {
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
    return (
      <motion.div
        className="absolute top-[35%] left-[2%] z-10 hidden xl:block opacity-90"
        animate={{ y: [0, 20, 0], rotateZ: [3, -1, 3] }}
        transition={{ duration: 9, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.05, opacity: 1, zIndex: 50 }}
          className="relative w-44 rounded-[24px] bg-white/80 backdrop-blur-md border border-purple-100 p-4 shadow-xl cursor-pointer group"
        >
          <div className="relative h-28 w-full rounded-[16px] bg-gradient-to-tr from-purple-500 to-indigo-600 mb-3 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent)]" />
             <Gamepad2 size={48} color="#fff" strokeWidth={1} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h4 className="text-[12px] font-bold text-gray-900 mb-2 text-center">PS5 DualSense</h4>
          <div className="flex justify-between items-center px-1">
            <span className="text-[15px] font-black text-purple-600">₹4,200</span>
            <div className="flex items-center gap-1">
              <Heart size={10} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-500">24</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Card 4: Headphones (Small, Right Edge)
  const CardHeadphones = () => {
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
    return (
      <motion.div
        className="absolute top-[20%] right-[3%] z-10 hidden xl:block opacity-80"
        animate={{ y: [0, -25, 0], x: [0, -10, 0] }}
        transition={{ duration: 11, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.1, opacity: 1, zIndex: 50 }}
          className="relative w-40 rounded-[20px] bg-white/70 backdrop-blur-lg border border-pink-100 p-3 shadow-lg cursor-pointer group"
        >
          <AnimatePresence>
            {magicNotif && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: -15 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="absolute -top-6 -right-4 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1 z-50"
              >
                <Bell size={10} className="text-pink-400" /> Price Dropped!
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative h-20 w-full rounded-[14px] bg-gradient-to-br from-pink-400 to-rose-600 mb-2 flex items-center justify-center">
             <Headphones size={32} color="#fff" strokeWidth={1.5} />
             <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 border-2 border-white animate-pulse" />
          </div>
          <h4 className="text-[11px] font-bold text-gray-800 leading-tight mb-1">Sony WH-1000XM4</h4>
          <span className="text-[14px] font-black text-gray-900">₹14,000</span>
        </motion.div>
      </motion.div>
    );
  };

  // Card 5: Cycle (Medium, Far Bottom Right)
  const CardCycle = () => {
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
    return (
      <motion.div
        className="absolute bottom-[30%] right-[2%] z-0 hidden 2xl:block opacity-50 blur-[1px]"
        animate={{ y: [0, 15, 0], rotateZ: [-4, 2, -4] }}
        transition={{ duration: 12, delay: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.1, opacity: 1, filter: "blur(0px)", zIndex: 50 }}
          className="relative w-48 rounded-[24px] bg-white/60 backdrop-blur-sm border border-emerald-100 p-4 shadow-md cursor-pointer group transition-[filter] duration-300"
        >
          <div className="relative h-24 w-full rounded-[16px] bg-gradient-to-br from-emerald-300 to-teal-500 mb-3 flex items-center justify-center">
             <Bike size={40} color="#fff" strokeWidth={1.5} />
             <QrCode size={16} color="rgba(255,255,255,0.3)" className="absolute bottom-2 right-2" />
          </div>
          <h4 className="text-[12px] font-bold text-gray-800 mb-1">Hero Sprint Pro</h4>
          <span className="text-[13px] font-black text-gray-900">₹3,500</span>
        </motion.div>
      </motion.div>
    );
  };

  // Card 6: DSLR Camera (Portrait, Far Left Edge)
  const CardCamera = () => {
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
    return (
      <motion.div
        className="absolute bottom-[20%] left-[2%] z-0 hidden 2xl:block opacity-60 blur-[1px]"
        animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.1, opacity: 1, filter: "blur(0px)", zIndex: 50 }}
          className="relative w-44 rounded-[20px] bg-white/70 backdrop-blur-md border border-amber-100 p-4 shadow-sm cursor-pointer group transition-[filter] duration-300"
        >
          <div className="relative h-24 w-full rounded-[16px] bg-gradient-to-br from-amber-300 to-orange-500 mb-3 flex items-center justify-center">
             <Camera size={36} color="#fff" strokeWidth={1.5} />
             <div className="absolute top-2 right-2 text-[6px] font-mono text-white/50 tracking-widest">| | || | |||</div>
          </div>
          <h4 className="text-[12px] font-bold text-gray-800 mb-1">Sony A6400</h4>
          <span className="text-[14px] font-black text-gray-900">₹45,000</span>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Enable pointer events only on the cards themselves */}
      <div className="absolute inset-0 [&>*]:pointer-events-auto">
        <CardBooks />
        <CardElectronics />
        <CardGaming />
        <CardHeadphones />
        <CardCycle />
        <CardCamera />
      </div>
    </div>
  );
}
