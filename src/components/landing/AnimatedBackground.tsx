"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  Ticket, Tag, Book, MessageSquare, MapPin, Package, Heart, Sparkles, 
  Smartphone, Laptop, Gamepad2, Bus, TrainFront, Banknote, Coins, GraduationCap, Headphones, Calculator, Camera
} from "lucide-react";

// Helper for premium rich icons
function PremiumIcon({ icon: Icon, color, bgGradient }: { icon: any, color: string, bgGradient: string }) {
  return (
    <div className={`relative flex items-center justify-center p-2 rounded-xl shadow-lg ${bgGradient}`}>
      <Icon size={24} color={color} strokeWidth={2} className="relative z-10" />
      <div className="absolute inset-0 bg-white/20 rounded-xl" />
      <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-xl" />
    </div>
  );
}

// Map for rich items
const RICH_ITEMS = [
  { id: 'book', el: <PremiumIcon icon={Book} color="#FFFFFF" bgGradient="bg-gradient-to-br from-blue-400 to-blue-600" /> },
  { id: 'laptop', el: <PremiumIcon icon={Laptop} color="#FFFFFF" bgGradient="bg-gradient-to-br from-gray-700 to-gray-900" /> },
  { id: 'gamepad', el: <PremiumIcon icon={Gamepad2} color="#FFFFFF" bgGradient="bg-gradient-to-br from-purple-500 to-indigo-600" /> },
  { id: 'headphones', el: <PremiumIcon icon={Headphones} color="#FFFFFF" bgGradient="bg-gradient-to-br from-pink-500 to-rose-600" /> },
  { id: 'smartphone', el: <PremiumIcon icon={Smartphone} color="#FFFFFF" bgGradient="bg-gradient-to-br from-teal-400 to-emerald-600" /> },
  { id: 'calculator', el: <PremiumIcon icon={Calculator} color="#FFFFFF" bgGradient="bg-gradient-to-br from-orange-400 to-red-500" /> },
  { id: 'camera', el: <PremiumIcon icon={Camera} color="#FFFFFF" bgGradient="bg-gradient-to-br from-amber-400 to-orange-500" /> },
  { id: 'ticket', el: <PremiumIcon icon={Ticket} color="#FFFFFF" bgGradient="bg-gradient-to-br from-yellow-400 to-amber-600" /> },
  { id: 'banknote', el: <PremiumIcon icon={Banknote} color="#FFFFFF" bgGradient="bg-gradient-to-br from-green-400 to-emerald-600" /> },
  { id: 'coins', el: <PremiumIcon icon={Coins} color="#FFFFFF" bgGradient="bg-gradient-to-br from-yellow-300 to-yellow-500" /> },
  { id: 'gradcap', el: <PremiumIcon icon={GraduationCap} color="#FFFFFF" bgGradient="bg-gradient-to-br from-slate-700 to-black" /> },
  { id: 'package', el: <PremiumIcon icon={Package} color="#FFFFFF" bgGradient="bg-gradient-to-br from-amber-600 to-amber-800" /> },
  { id: 'tag', el: <PremiumIcon icon={Tag} color="#FFFFFF" bgGradient="bg-gradient-to-br from-red-400 to-rose-600" /> },
];

const PREVIEW_CARDS = [
  { id: 1, title: "Engineering Mathematics", price: "₹450", condition: "Like New", top: "15%", left: "10%", delay: 0 },
  { id: 2, title: "PS5 Controller", price: "₹900", condition: "Excellent", top: "25%", left: "75%", delay: 2 },
  { id: 3, title: "Hero Sprint Cycle", price: "₹3200", condition: "Good", top: "65%", left: "8%", delay: 4 },
  { id: 4, title: "Sony Headphones", price: "₹1800", condition: "Almost New", top: "70%", left: "80%", delay: 1 },
];

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [accentEvents, setAccentEvents] = useState<any[]>([]);

  // Parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 30 });

  useEffect(() => {
    setMounted(true);
    
    // Generate 90 background items across 3 core layers (Bg, Mid, Fg)
    const newItems = Array.from({ length: 90 }).map((_, i) => {
      // 1: Fg, 2: Mid, 3: Bg
      const layer = i < 25 ? 1 : i < 55 ? 2 : 3;
      
      const sizeMultiplier = layer === 1 ? 1.5 : layer === 2 ? 1 : 0.6;
      // requested: Bg 3-5%, Mid 5-8%, Fg 8-12%
      const opacityMultiplier = layer === 1 ? (Math.random() * 0.04 + 0.08) : layer === 2 ? (Math.random() * 0.03 + 0.05) : (Math.random() * 0.02 + 0.03);
      const baseDuration = layer === 1 ? 25 : layer === 2 ? 45 : 70;
      
      const richItem = RICH_ITEMS[Math.floor(Math.random() * RICH_ITEMS.length)];

      return {
        id: i,
        element: richItem.el,
        layer,
        x: Math.random() * 100, 
        y: Math.random() * 100, 
        scale: sizeMultiplier * (Math.random() * 0.4 + 0.8),
        opacity: opacityMultiplier,
        duration: baseDuration + Math.random() * 30,
        delay: Math.random() * -50,
        rotationStart: Math.random() * 360,
        rotationEnd: Math.random() * 360 + (Math.random() > 0.5 ? 360 : -360),
        driftX: (Math.random() - 0.5) * 30,
        driftY: (Math.random() - 0.5) * 30,
        blur: layer === 3 ? "blur(4px)" : layer === 2 ? "blur(2px)" : "blur(0px)",
      };
    });
    setItems(newItems);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Ambient Activity Spawner (Accent Layer)
    const interval = setInterval(() => {
      const eventType = Math.random();
      const id = Date.now();
      
      if (eventType < 0.2) {
        // Bus
        setAccentEvents(prev => [...prev, { id, type: 'bus', duration: 15 }]);
      } else if (eventType < 0.4) {
        // Train
        setAccentEvents(prev => [...prev, { id, type: 'train', duration: 25 }]);
      } else if (eventType < 0.7) {
        // Floating Ticket
        setAccentEvents(prev => [...prev, { id, type: 'ticket', duration: 10 }]);
      } else if (eventType < 0.85) {
        // Sparkling Coin
        setAccentEvents(prev => [...prev, { id, type: 'coin', duration: 5 }]);
      } else {
        // Parcel
        setAccentEvents(prev => [...prev, { id, type: 'parcel', duration: 12 }]);
      }
    }, 8000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const removeAccent = (id: number) => {
    setAccentEvents(prev => prev.filter(e => e.id !== id));
  };

  const fgX = useTransform(springX, [-1, 1], [-50, 50]);
  const fgY = useTransform(springY, [-1, 1], [-50, 50]);
  const midX = useTransform(springX, [-1, 1], [-25, 25]);
  const midY = useTransform(springY, [-1, 1], [-25, 25]);
  const bgX = useTransform(springX, [-1, 1], [-10, 10]);
  const bgY = useTransform(springY, [-1, 1], [-10, 10]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#FAFAFA]">
      
      {/* Soft Colorful Gradient Blobs */}
      <div className="absolute inset-0 opacity-10 blur-[100px]">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-blue-400" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] rounded-full bg-purple-400" 
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -100, 0] }} 
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/3 w-[30vw] h-[30vw] rounded-full bg-mint-400" 
          style={{ backgroundColor: '#6EE7B7' }}
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 100, 0] }} 
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/3 w-[25vw] h-[25vw] rounded-full bg-orange-400" 
        />
      </div>

      {/* Floating Decorative Mock Cards */}
      {PREVIEW_CARDS.map((card) => (
        <motion.div
          key={card.id}
          className="absolute z-10 w-48 rounded-2xl bg-white/70 backdrop-blur-xl border border-white p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          style={{ top: card.top, left: card.left }}
          animate={{ 
            y: [0, -15, 0], 
            rotate: [Math.random() * 5 - 2.5, Math.random() * -5 + 2.5, Math.random() * 5 - 2.5] 
          }}
          transition={{ duration: 6, delay: card.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-24 w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 mb-2 border border-gray-200/50" />
          <h4 className="text-[10px] font-bold text-gray-900 leading-tight mb-0.5 truncate">{card.title}</h4>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black text-gray-900">{card.price}</span>
            <span className="text-[8px] font-semibold text-gray-500 uppercase">{card.condition}</span>
          </div>
        </motion.div>
      ))}

      {/* 3 Core Animation Layers */}
      {items.map((item) => {
        const pX = item.layer === 1 ? fgX : item.layer === 2 ? midX : bgX;
        const pY = item.layer === 1 ? fgY : item.layer === 2 ? midY : bgY;

        return (
          <motion.div
            key={item.id}
            className="absolute"
            style={{ 
              x: pX, 
              y: pY,
              left: `${item.x}%`,
              filter: item.blur,
              scale: item.scale,
              opacity: item.opacity
            }}
            initial={{
              top: "110%",
              rotate: item.rotationStart,
            }}
            animate={{
              top: "-20%",
              left: `${item.x + item.driftX}%`,
              rotate: item.rotationEnd,
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {item.element}
          </motion.div>
        );
      })}

      {/* Accent Layer Events */}
      <AnimatePresence>
        {accentEvents.map((ev) => {
          if (ev.type === 'bus') {
            return (
              <motion.div
                key={ev.id}
                initial={{ left: "-10%", bottom: "5%" }}
                animate={{ left: "110%" }}
                transition={{ duration: ev.duration, ease: "linear" }}
                onAnimationComplete={() => removeAccent(ev.id)}
                className="absolute z-20 opacity-20"
              >
                <PremiumIcon icon={Bus} color="#fff" bgGradient="bg-gradient-to-r from-yellow-400 to-orange-500" />
              </motion.div>
            );
          }
          if (ev.type === 'train') {
            return (
              <motion.div
                key={ev.id}
                initial={{ right: "-10%", bottom: "25%", scale: 0.7 }}
                animate={{ right: "110%" }}
                transition={{ duration: ev.duration, ease: "linear" }}
                onAnimationComplete={() => removeAccent(ev.id)}
                className="absolute z-0 opacity-10 blur-[2px]"
              >
                <PremiumIcon icon={TrainFront} color="#fff" bgGradient="bg-gradient-to-r from-blue-400 to-cyan-500" />
              </motion.div>
            );
          }
          if (ev.type === 'ticket') {
            return (
              <motion.div
                key={ev.id}
                initial={{ left: `${Math.random() * 80 + 10}%`, bottom: "-10%" }}
                animate={{ bottom: "110%", rotate: 360, x: [0, 50, -50, 0] }}
                transition={{ duration: ev.duration, ease: "easeOut" }}
                onAnimationComplete={() => removeAccent(ev.id)}
                className="absolute z-10 opacity-15"
              >
                <PremiumIcon icon={Ticket} color="#fff" bgGradient="bg-gradient-to-r from-rose-400 to-pink-500" />
              </motion.div>
            );
          }
          if (ev.type === 'coin') {
            return (
              <motion.div
                key={ev.id}
                initial={{ left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 80 + 10}%`, scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 0.4, 0], rotateY: 720 }}
                transition={{ duration: ev.duration }}
                onAnimationComplete={() => removeAccent(ev.id)}
                className="absolute z-10"
              >
                <PremiumIcon icon={Coins} color="#fff" bgGradient="bg-gradient-to-r from-yellow-300 to-amber-400" />
              </motion.div>
            );
          }
          if (ev.type === 'parcel') {
            return (
              <motion.div
                key={ev.id}
                initial={{ left: "-10%", top: `${Math.random() * 60 + 20}%` }}
                animate={{ left: "110%", y: [0, 20, -20, 0] }}
                transition={{ duration: ev.duration, ease: "linear" }}
                onAnimationComplete={() => removeAccent(ev.id)}
                className="absolute z-10 opacity-10"
              >
                <PremiumIcon icon={Package} color="#fff" bgGradient="bg-gradient-to-r from-amber-600 to-orange-700" />
              </motion.div>
            );
          }
          return null;
        })}
      </AnimatePresence>

      {/* Elegant Line-Art Campus Skyline (White, 5% opacity) */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-5 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full fill-none stroke-white" strokeWidth="2">
          {/* Base ground line */}
          <path d="M0,195 L1440,195" />
          
          {/* Main Academic Building */}
          <path d="M500,195 L500,100 L550,50 L600,100 L600,195 M550,50 L550,195 M520,120 L580,120" />
          <rect x="520" y="140" width="15" height="20" />
          <rect x="565" y="140" width="15" height="20" />
          
          {/* Library */}
          <path d="M300,195 L300,120 L420,120 L420,195" />
          <path d="M290,120 L430,120 M310,140 L310,195 M330,140 L330,195 M350,140 L350,195 M370,140 L370,195 M390,140 L390,195 M410,140 L410,195" />

          {/* Dorms */}
          <rect x="700" y="100" width="80" height="95" />
          <rect x="715" y="120" width="15" height="15" />
          <rect x="750" y="120" width="15" height="15" />
          <rect x="715" y="150" width="15" height="15" />
          <rect x="750" y="150" width="15" height="15" />
          
          <rect x="800" y="80" width="60" height="115" />
          <rect x="815" y="100" width="10" height="15" />
          <rect x="835" y="100" width="10" height="15" />
          <rect x="815" y="130" width="10" height="15" />
          <rect x="835" y="130" width="10" height="15" />
          <rect x="815" y="160" width="10" height="15" />
          <rect x="835" y="160" width="10" height="15" />

          {/* Trees */}
          <path d="M150,195 L150,160 M130,160 C130,140 170,140 170,160 Z" />
          <path d="M220,195 L220,150 M195,150 C195,120 245,120 245,150 Z" />
          <path d="M950,195 L950,140 M920,140 C920,100 980,100 980,140 Z" />
          <path d="M1100,195 L1100,165 M1085,165 C1085,150 1115,150 1115,165 Z" />

          {/* Benches & Paths */}
          <path d="M630,195 L650,185 L690,195" />
          <rect x="250" y="185" width="20" height="10" />
          <path d="M255,195 L255,185 M265,195 L265,185" />

          {/* Bicycle */}
          <circle cx="1020" cy="185" r="8" />
          <circle cx="1050" cy="185" r="8" />
          <path d="M1020,185 L1030,170 L1045,170 L1050,185 M1030,170 L1040,185 M1025,165 L1035,165 M1040,165 L1045,170" />
        </svg>
      </div>

    </div>
  );
}
