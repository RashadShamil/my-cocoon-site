"use client";

import { motion } from "framer-motion";

// Hardcoded Decor Icons
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>
);
const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);

export function OrdersBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden h-full w-full bg-white">
      {/* 1. The Breathing Image (Same as Mobile Menu) */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}
      >
        <img
          src="/Pbanner-bg.jpg" 
          alt="Background"
          className="w-full h-full object-cover opacity-30" 
        />
      </motion.div>

      {/* 2. Glassy Gradient Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-pink-50/80" />
      
      {/* 3. Floating Decor Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-10 text-primary opacity-30"
      >
        <SparklesIcon className="w-10 h-10" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-10 text-pink-400 opacity-20"
      >
        <HeartIcon className="w-16 h-16" />
      </motion.div>
    </div>
  );
}