"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Ticket, Tag, ShoppingBag, Book, GraduationCap, 
  MessageSquare, MapPin, Package, Heart, Star, 
  CreditCard, Percent
} from "lucide-react";

const ICONS = [Ticket, Tag, ShoppingBag, Book, GraduationCap, MessageSquare, MapPin, Package, Heart, Star, CreditCard, Percent];
const NOTIFICATIONS = ["Book Sold", "New Deal", "Roommate Found", "Item Exchanged", "Price Dropped"];

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [confetti, setConfetti] = useState<any[]>([]);
  
  // Parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    
    // Generate 70 background items across 3 layers
    const newItems = Array.from({ length: 70 }).map((_, i) => {
      const layer = i < 20 ? 1 : i < 50 ? 2 : 3; // 1: Foreground, 2: Middle, 3: Background
      
      const sizeMultiplier = layer === 1 ? 1.5 : layer === 2 ? 1 : 0.6;
      const opacityMultiplier = layer === 1 ? 0.12 : layer === 2 ? 0.08 : 0.05;
      const baseDuration = layer === 1 ? 20 : layer === 2 ? 35 : 55;
      
      return {
        id: i,
        Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        layer,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: (Math.random() * 12 + 12) * sizeMultiplier,
        opacity: opacityMultiplier,
        duration: baseDuration + Math.random() * 20,
        delay: Math.random() * -30, // Start at different points in animation
        rotationStart: Math.random() * 360,
        rotationEnd: Math.random() * 360 + (Math.random() > 0.5 ? 360 : -360),
        driftX: (Math.random() - 0.5) * 20, // drift up to 20vw
      };
    });
    setItems(newItems);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse values between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Occasional notifications
    const notifInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)],
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20,
          }
        ]);
      }
    }, 8000);

    // Occasional confetti
    const confettiInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        const newConfetti = Array.from({ length: 5 }).map((_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 20 - 10, // Start slightly offscreen left
          y: Math.random() * 100,
          duration: Math.random() * 10 + 10,
        }));
        setConfetti((prev) => [...prev, ...newConfetti]);
      }
    }, 18000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(notifInterval);
      clearInterval(confettiInterval);
    };
  }, []);

  // Parallax transform functions based on layer depth
  const fgX = useTransform(springX, [-1, 1], [-30, 30]);
  const fgY = useTransform(springY, [-1, 1], [-30, 30]);
  
  const midX = useTransform(springX, [-1, 1], [-15, 15]);
  const midY = useTransform(springY, [-1, 1], [-15, 15]);
  
  const bgX = useTransform(springX, [-1, 1], [-5, 5]);
  const bgY = useTransform(springY, [-1, 1], [-5, 5]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/50 mix-blend-multiply blur-3xl animate-mesh-slow" />
      </div>

      {/* Faint Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />

      {/* Floating Icons */}
      {items.map((item) => {
        const pX = item.layer === 1 ? fgX : item.layer === 2 ? midX : bgX;
        const pY = item.layer === 1 ? fgY : item.layer === 2 ? midY : bgY;

        return (
          <motion.div
            key={item.id}
            className="absolute text-gray-500"
            style={{ 
              x: pX, 
              y: pY,
              left: \`\${item.x}%\`,
              filter: item.layer === 3 ? "blur(2px)" : item.layer === 2 ? "blur(0.5px)" : "none"
            }}
            initial={{
              top: "110%",
              opacity: 0,
              rotate: item.rotationStart,
            }}
            animate={{
              top: "-10%",
              left: \`\${item.x + item.driftX}%\`,
              opacity: [0, item.opacity, item.opacity, 0],
              rotate: item.rotationEnd,
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <item.Icon size={item.size} strokeWidth={1.5} />
          </motion.div>
        );
      })}

      {/* Occasional Confetti (Tickets drifting diagonally) */}
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          className="absolute text-gray-400"
          initial={{ left: "-5%", top: \`\${c.y}%\`, opacity: 0, rotate: 0, scale: 0.8 }}
          animate={{
            left: "105%",
            top: \`\${c.y - 20}%\`,
            opacity: [0, 0.1, 0.1, 0],
            rotate: 360,
          }}
          transition={{ duration: c.duration, ease: "linear" }}
          onAnimationComplete={() => setConfetti((prev) => prev.filter(item => item.id !== c.id))}
        >
          <Ticket size={16} strokeWidth={1} />
        </motion.div>
      ))}

      {/* Notifications */}
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          className="absolute bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100/50 text-[10px] font-semibold text-gray-500"
          style={{ left: \`\${n.x}%\`, top: \`\${n.y}%\` }}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: [0, 0.15, 0.15, 0], y: -20, scale: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          onAnimationComplete={() => setNotifications((prev) => prev.filter(item => item.id !== n.id))}
        >
          {n.text}
        </motion.div>
      ))}

      {/* Static Campus Skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full fill-none stroke-gray-900" strokeWidth="1">
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
