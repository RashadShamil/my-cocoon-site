"use client";

import { motion } from "framer-motion";
import { Heart, Mail, Phone, ArrowRight, Sparkles } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },                                                    
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative mt-32">
      {/* 1. THE WOW FACTOR: SVG Wave Top */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[98%] w-full overflow-hidden leading-none z-10">
        <svg
          className="relative block w-full h-[80px] md:h-[120px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-secondary/30"
          ></path>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-secondary/10"
          ></path>
        </svg>
      </div>

      {/* Main Gradient Background */}
      <div className="relative bg-gradient-to-b from-secondary/30 via-pink-50 to-white pt-10 pb-10">
        
        {/* Decorative Background Sparkle */}
        <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <Sparkles size={150} className="text-primary" />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20"
        >
          <div className="grid md:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand Section (Left) */}
            <motion.div variants={itemVariants} className="md:col-span-5 lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* Glowing effect behind logo */}
                  <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
                  <motion.img
                    src="/logo.png"
                    alt="Cocoon"
                    className="h-16 w-auto relative z-10"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Cocoon Kids
                  </h3>
                  <p className="text-xs tracking-wider uppercase text-primary font-medium">Little Princess Dreams</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Creating magical moments with beautiful frocks for your little ones. 
                Every dress is stitched with love, sprinkled with fairy dust, and designed to make memories last forever.
              </p>
              
              <div className="flex gap-4">
                {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ y: -5, backgroundColor: "hsl(var(--primary))", color: "white" }}
                    className="h-10 w-10 rounded-full bg-white shadow-lg shadow-pink-100 flex items-center justify-center text-primary transition-colors border border-pink-100"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links (Center) */}
            <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-2 md:col-start-7 lg:col-start-6">
              <h4 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                Explore <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </h4>
              <ul className="space-y-4">
                {[
                  { name: "Home", href: "/" },
                  { name: "Shop Collection", href: "/shop" },
                  { name: "Our Story", href: "/about" },
                  { name: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span className="group-hover:font-medium">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter "Glass Card" (Right) */}
            <motion.div variants={itemVariants} className="md:col-span-4 lg:col-span-4">
              <h4 className="text-lg font-bold text-foreground mb-6">Stay in the Magic</h4>
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl shadow-xl shadow-pink-100/50 border border-white">
                <p className="text-sm text-muted-foreground mb-4">Subscribe for exclusive offers and new arrivals!</p>
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input 
                      type="email" 
                      placeholder="mommy@email.com" 
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-100 bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    Subscribe
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground pl-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  <span>+94 77 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  <span>hello@cocoonkids.lk</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 pt-8 border-t border-pink-100 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              © {currentYear} Cocoon Kids. Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> in Sri Lanka.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
