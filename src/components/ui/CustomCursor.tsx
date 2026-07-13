"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovered(true);
        setIsText(false);
      } else if (
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.classList.contains('cursor-text')
      ) {
        setIsHovered(false);
        setIsText(true);
      } else {
        setIsHovered(false);
        setIsText(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  // Don't render on mobile devices
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - (isText ? 1 : 8),
          y: mousePosition.y - (isText ? 12 : 8),
          width: isText ? 2 : 16,
          height: isText ? 24 : 16,
          borderRadius: isText ? "0px" : "50%",
          scale: isHovered ? 2.5 : 1,
          opacity: isVisible && !isText ? 0.9 : 0,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.2 }}
        style={{ 
          background: 'linear-gradient(135deg, #7BC4AC 0%, #F28C6A 100%)',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovered ? 1.2 : 1,
          opacity: isVisible && !isHovered && !isText ? 0.5 : 0,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.8 }}
        style={{ borderColor: '#7BC4AC' }}
      />
    </>
  );
}
