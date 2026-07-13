"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Ticket, Bus, TrainFront, Banknote, Coins, Tag, 
  MapPin, Book, MessageSquare, Heart, Package, 
  Sparkles, Smartphone, Laptop, Gamepad2, GraduationCap, Bike
} from "lucide-react";

const ICONS = [Ticket, Bus, TrainFront, Banknote, Coins, Tag, MapPin, Book, MessageSquare, Heart, Package, Sparkles, Smartphone, Laptop, Gamepad2, GraduationCap, Bike];

export default function AnimatedGradientBackground() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 });

  useEffect(() => {
    setMounted(true);
    
    // Generate 60 background items across 3 layers
    const newItems = Array.from({ length: 60 }).map((_, i) => {
      const layer = i < 15 ? 1 : i < 40 ? 2 : 3; // 1: Foreground, 2: Middle, 3: Background
      
      const sizeMultiplier = layer === 1 ? 1.5 : layer === 2 ? 1 : 0.6;
      const opacityMultiplier = layer === 1 ? 0.08 : layer === 2 ? 0.05 : 0.03;
      const baseDuration = layer === 1 ? 25 : layer === 2 ? 40 : 60;
      
      return {
        id: i,
        Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        layer,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: (Math.random() * 12 + 12) * sizeMultiplier,
        opacity: opacityMultiplier,
        duration: baseDuration + Math.random() * 20,
        delay: Math.random() * -30,
        rotationStart: Math.random() * 360,
        rotationEnd: Math.random() * 360 + (Math.random() > 0.5 ? 360 : -360),
        driftX: (Math.random() - 0.5) * 15,
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
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fgX = useTransform(springX, [-1, 1], [-40, 40]);
  const fgY = useTransform(springY, [-1, 1], [-40, 40]);
  const midX = useTransform(springX, [-1, 1], [-20, 20]);
  const midY = useTransform(springY, [-1, 1], [-20, 20]);
  const bgX = useTransform(springX, [-1, 1], [-10, 10]);
  const bgY = useTransform(springY, [-1, 1], [-10, 10]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#FCFDFD]">
      
      {/* Animated Mesh Gradient */}
      <motion.div 
        className="absolute inset-0 opacity-[0.35] blur-[120px]"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, #E0F2FE 0%, transparent 50%), radial-gradient(circle at 100% 0%, #EDE9FE 0%, transparent 50%), radial-gradient(circle at 100% 100%, #D1FAE5 0%, transparent 50%), radial-gradient(circle at 0% 100%, #FEFCE8 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, #E0F2FE 0%, transparent 50%), radial-gradient(circle at 100% 100%, #EDE9FE 0%, transparent 50%), radial-gradient(circle at 0% 100%, #D1FAE5 0%, transparent 50%), radial-gradient(circle at 0% 0%, #FEFCE8 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, #E0F2FE 0%, transparent 50%), radial-gradient(circle at 0% 100%, #EDE9FE 0%, transparent 50%), radial-gradient(circle at 0% 0%, #D1FAE5 0%, transparent 50%), radial-gradient(circle at 100% 0%, #FEFCE8 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, #E0F2FE 0%, transparent 50%), radial-gradient(circle at 0% 0%, #EDE9FE 0%, transparent 50%), radial-gradient(circle at 100% 0%, #D1FAE5 0%, transparent 50%), radial-gradient(circle at 100% 100%, #FEFCE8 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, #E0F2FE 0%, transparent 50%), radial-gradient(circle at 100% 0%, #EDE9FE 0%, transparent 50%), radial-gradient(circle at 100% 100%, #D1FAE5 0%, transparent 50%), radial-gradient(circle at 0% 100%, #FEFCE8 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Elements */}
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
              filter: item.layer === 3 ? "blur(3px)" : item.layer === 2 ? "blur(1px)" : "none",
              color: item.layer === 1 ? "#3B82F6" : item.layer === 2 ? "#60A5FA" : "#9CA3AF"
            }}
            initial={{ top: "110%", opacity: 0, rotate: item.rotationStart }}
            animate={{
              top: "-10%",
              left: `${item.x + item.driftX}%`,
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
    </div>
  );
}
