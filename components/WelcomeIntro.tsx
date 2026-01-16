"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// === 1. The Custom Butterfly ===
const Butterfly = ({ size = 30, color = "#E879B9" }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    // The "Flutter" animation (wings beating)
    animate={{
      scaleX: [1, 0.2, 1], 
      translateY: [0, -2, 0], // Bobbing up and down slightly while flapping
    }}
    transition={{
      duration: 0.1 + Math.random() * 0.15, // Highly random flap speed
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
    style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }} // Shadow for depth
  >
    <path d="M12 12C12 12 8 5 3 8C-1 10 2 17 6 16C6 16 9 16 12 12Z" opacity="0.9" />
    <path d="M12 12C12 12 16 5 21 8C25 10 22 17 18 16C18 16 15 16 12 12Z" opacity="0.9" />
    <path d="M12 12C12 12 9 19 5 21C2 23 2 18 6 16C6 16 9 14 12 12Z" opacity="0.75" />
    <path d="M12 12C12 12 15 19 19 21C22 23 22 18 18 16C18 16 15 14 12 12Z" opacity="0.75" />
  </motion.svg>
);

export function WelcomeIntro() {
  const [isVisible, setIsVisible] = useState(true);
  // We use state to hold random paths so they are consistent during render
  const [butterflies, setButterflies] = useState<any[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Lock scroll

    // === 2. Generate Chaotic Flight Paths ===
    const width = window.innerWidth;
    const height = window.innerHeight;

    const items = [...Array(30)].map((_, i) => ({
      id: i,
      // Start from random edges or center
      initialX: Math.random() > 0.5 ? -100 : width + 100,
      initialY: Math.random() * height,
      // Complex curvy paths
      pathX: Array.from({ length: 6 }, () => Math.random() * width),
      pathY: Array.from({ length: 6 }, () => Math.random() * height),
      // Random rotation to look like they are turning
      rotate: Array.from({ length: 6 }, () => (Math.random() - 0.5) * 180),
      delay: Math.random() * 2,
      duration: 5 + Math.random() * 5,
      size: 15 + Math.random() * 45,
      color: i % 2 === 0 ? "#E879B9" : "#FBCFE8", // Mix of Dark and Light Pink
    }));
    setButterflies(items);

    // === 3. Extended Timer (7 Seconds) ===
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "auto";
    }, 7000); // 7 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="welcome-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 1.5 } }} // Slow fade out
        >
          {/* ==============================================
              LAYER 1: The "Pink Aurora" Background 
             ============================================== */}
          <div className="absolute inset-0 bg-pink-50/50" />
          
          {/* Moving Blobs */}
          <motion.div 
            animate={{ 
              x: [0, 100, -100, 0], 
              y: [0, -100, 100, 0], 
              scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              x: [0, -150, 50, 0], 
              y: [0, 50, -50, 0], 
              scale: [1, 1.3, 1] 
            }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-accent/20 rounded-full blur-[120px]" 
          />

          {/* Glass Overlay to smooth everything out */}
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/30" />


          {/* ==============================================
              LAYER 2: The Butterfly Swarm 
             ============================================== */}
          {butterflies.map((b) => (
            <motion.div
              key={b.id}
              className="absolute z-10"
              initial={{ x: b.initialX, y: b.initialY, opacity: 0, scale: 0 }}
              animate={{
                x: b.pathX,
                y: b.pathY,
                rotate: b.rotate,
                opacity: [0, 1, 1, 1, 0], // Fade in then out
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


          {/* ==============================================
              LAYER 3: The Content (Blooming Text) 
             ============================================== */}
          <div className="relative z-20 text-center px-4">
            {/* A "Holy Light" Glow behind text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white rounded-full blur-[80px]"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-7xl font-bold mb-2 tracking-tight text-foreground drop-shadow-sm">
                Welcome to
              </h1>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 1.5, duration: 1.5, type: "spring", bounce: 0.5 }}
                className="text-6xl md:text-9xl font-extrabold bg-gradient-to-r from-primary via-pink-400 to-accent bg-clip-text text-transparent pb-4"
              >
                Cocoon Kids
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ delay: 2.5, duration: 1.5 }}
              className="h-1 bg-primary/50 mx-auto mb-8 rounded-full"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 1.5 }}
              className="text-xl md:text-3xl text-muted-foreground font-light italic"
            >
              "Spreading joy, love and style"
            </motion.p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}