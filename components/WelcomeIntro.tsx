"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

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
  const containerRef = useRef(null);

  // ✅ PARALLAX SETUP for Desktop Intro
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // A subtle parallax effect for the intro background
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);


  useEffect(() => {
    document.body.style.overflow = "hidden"; // Lock scroll

    // Generate butterflies
    const width = window.innerWidth;
    const height = window.innerHeight;
    const items = [...Array(25)].map((_, i) => ({
      id: i,
      initialX: Math.random() > 0.5 ? -100 : width + 100,
      initialY: Math.random() * height,
      pathX: Array.from({ length: 5 }, () => Math.random() * width),
      pathY: Array.from({ length: 5 }, () => Math.random() * height),
      rotate: Array.from({ length: 5 }, () => (Math.random() - 0.5) * 180),
      delay: Math.random() * 2,
      duration: 6 + Math.random() * 4,
      size: 20 + Math.random() * 40,
      color: i % 2 === 0 ? "#E879B9" : "#FBCFE8",
    }));
    setButterflies(items);

    // Shorter timer for a snappier intro (6 seconds total)
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "auto"; // Unlock scroll
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          key="welcome-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-pink-50"
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          
          {/* ==================== LAYER 1: The Backgrounds ==================== */}
          
          {/* 1a. MOBILE STATIC BG */}
          <div 
            className="fixed inset-0 z-0 h-full w-full bg-[url('/Pbanner-bg.jpg')] bg-cover bg-center bg-no-repeat md:hidden"
            style={{ filter: 'brightness(0.9)' }} // Slightly dim for text readability
          />

          {/* 1b. DESKTOP PARALLAX BG */}
          <motion.div 
            style={{ y }}
            className="hidden md:block fixed inset-0 z-0 w-full h-[120vh]"
          >
             <img src="/banner-bg.jpg" alt="Welcome Background" className="w-full h-full object-cover brightness-90" />
          </motion.div>
          
          {/* 1c. Aurora Blobs (On top of BG image) */}
          <motion.div
            animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-primary/30 rounded-full blur-[150px] z-1"
          />
          <motion.div
            animate={{ x: [0, -150, 50, 0], y: [0, 50, -50, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
            className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] bg-accent/30 rounded-full blur-[150px] z-1"
          />

          {/* ==================== LAYER 2: Butterflies ==================== */}
          {butterflies.map((b) => (
            <motion.div
              key={b.id}
              className="absolute z-10 pointer-events-none"
              initial={{ x: b.initialX, y: b.initialY, opacity: 0, scale: 0 }}
              animate={{
                x: b.pathX, y: b.pathY, rotate: b.rotate,
                opacity: [0, 1, 1, 1, 0], scale: [0, 1, 1, 0.5],
              }}
              transition={{ duration: b.duration, ease: "easeInOut", delay: b.delay }}
            >
              <Butterfly size={b.size} color={b.color} />
            </motion.div>
          ))}

          {/* ==================== LAYER 3: Content Card ==================== */}
          {/* A beautiful frosted glass box to hold the content */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
             className="relative z-20 flex flex-col items-center p-12 rounded-[3rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl mx-4 max-w-2xl"
          >
          

            {/* LOGO & FLOATING ANIMATION */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "blur(15px)" }}
              animate={{ 
                  scale: 1, opacity: 1, filter: "blur(0px)",
                  y: [0, -15, 0] // Floating effect
              }}
              transition={{ 
                  delay: 2.2, duration: 1.5, type: "spring", bounce: 0.4,
                  y: { delay: 3.7, duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              }}
              className="mb-10 relative"
            >
               <img 
                  src="/logo.png" 
                  alt="Cocoon Kids Logo" 
                  className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-xl"
               />
            </motion.div>

            {/* SEPARATOR LINE */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "140px", opacity: 1 }}
              transition={{ delay: 3.5, duration: 1.2, ease: "easeOut" }}
              className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8 rounded-full"
            />

            {/* ✅ NEW GORGEOUS TAGLINE */}
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 4.2, duration: 1.5, ease: "easeOut" }}
              // Beautiful gradient text with a soft shadow for elegance
              className="text-4xl md:text-6xl font-black text-center bg-gradient-to-r from-primary via-pink-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm leading-tight tracking-tight pb-2"
            >
              Spreading Joy, Love & Style
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}