"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// === 1. The Custom Butterfly (Unchanged) ===
const Butterfly = ({ size = 30, color = "#E879B9" }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    animate={{
      scaleX: [1, 0.2, 1],
      translateY: [0, -2, 0],
    }}
    transition={{
      duration: 0.1 + Math.random() * 0.15,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
    style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }}
  >
    <path d="M12 12C12 12 8 5 3 8C-1 10 2 17 6 16C6 16 9 16 12 12Z" opacity="0.9" />
    <path d="M12 12C12 12 16 5 21 8C25 10 22 17 18 16C18 16 15 16 12 12Z" opacity="0.9" />
    <path d="M12 12C12 12 9 19 5 21C2 23 2 18 6 16C6 16 9 14 12 12Z" opacity="0.75" />
    <path d="M12 12C12 12 15 19 19 21C22 23 22 18 18 16C18 16 15 14 12 12Z" opacity="0.75" />
  </motion.svg>
);

export function WelcomeIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [butterflies, setButterflies] = useState<any[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const width = window.innerWidth;
    const height = window.innerHeight;

    const items = [...Array(30)].map((_, i) => ({
      id: i,
      initialX: Math.random() > 0.5 ? -100 : width + 100,
      initialY: Math.random() * height,
      pathX: Array.from({ length: 6 }, () => Math.random() * width),
      pathY: Array.from({ length: 6 }, () => Math.random() * height),
      rotate: Array.from({ length: 6 }, () => (Math.random() - 0.5) * 180),
      delay: Math.random() * 2,
      duration: 5 + Math.random() * 5,
      size: 15 + Math.random() * 45,
      color: i % 2 === 0 ? "#E879B9" : "#FBCFE8",
    }));
    setButterflies(items);

    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "auto";
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="welcome-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 1.5 } }}
        >
          {/* ==================== LAYER 1: Background ==================== */}
          <div className="absolute inset-0 bg-pink-50/50" />
          <motion.div
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -150, 50, 0],
              y: [0, 50, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-accent/20 rounded-full blur-[120px]"
          />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/30" />

          {/* ==================== LAYER 2: Butterflies ==================== */}
          {butterflies.map((b) => (
            <motion.div
              key={b.id}
              className="absolute z-10"
              initial={{ x: b.initialX, y: b.initialY, opacity: 0, scale: 0 }}
              animate={{
                x: b.pathX,
                y: b.pathY,
                rotate: b.rotate,
                opacity: [0, 1, 1, 1, 0],
                scale: [0, 1, 1, 0.5],
              }}
              transition={{
                duration: b.duration,
                ease: "easeInOut",
                delay: b.delay,
              }}
            >
              <Butterfly size={b.size} color={b.color} />
            </motion.div>
          ))}

          {/* ==================== LAYER 3: Content (Logo & Tagline) ==================== */}
          <div className="relative z-20 text-center px-4 flex flex-col items-center">
            {/* Glow behind logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/80 rounded-full blur-[100px] -z-10"
            />


            {/* LOGO REPLACEMENT & ANIMATION */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "blur(15px)" }}
              animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  filter: "blur(0px)",
                  // Add a subtle floating effect after it appears
                  y: [0, -15, 0]
              }}
              transition={{ 
                  // Entrance animation
                  delay: 1.2, 
                  duration: 1.8, 
                  type: "spring", 
                  bounce: 0.4,
                  // Floating animation
                  y: {
                      delay: 3, // Wait for entrance to finish
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut"
                  }
              }}
              className="mb-8 relative"
            >
               {/* ⚠️ MAKE SURE public/logo.png EXISTS */}
               <img 
                  src="/logo.png" 
                  alt="Cocoon Kids Logo" 
                  // Adjusted size for impact. Change w-64/h-64 if needed.
                  className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-xl"
               />
            </motion.div>

            {/* Separator Line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "120px", opacity: 1 }}
              transition={{ delay: 2.8, duration: 1.2, ease: "easeOut" }}
              className="h-1.5 bg-gradient-to-r from-primary/40 via-pink-400/60 to-accent/40 mx-auto mb-8 rounded-full"
            />

            {/* ✅ TAGLINE RESTYLING FOR CLARITY */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 1.5, ease: "easeOut" }}
              // Changed to solid dark text with a stronger shadow for maximum readability
              className="text-3xl md:text-5xl font-bold text-foreground drop-shadow-md tracking-wide pb-2"
            >
              Spreading Joy, Love and Style
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}