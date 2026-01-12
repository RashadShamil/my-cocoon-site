"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Heart, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/button";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Automatically detects current page

  // Detect scroll to shrink the navbar slightly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      >
        <motion.nav
          animate={{
            width: isScrolled ? "90%" : "95%",
            padding: isScrolled ? "0.75rem 1.5rem" : "1rem 2rem",
          }}
          className="max-w-6xl rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-lg shadow-pink-100/50 flex items-center justify-between"
        >
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.img
                src="/logo.png" // Ensure your logo is named logo.png in public folder
                alt="Cocoon"
                className="h-10 w-auto relative z-10"
                whileHover={{ rotate: 10, scale: 1.1 }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cocoon
              </span>
            </div>
          </Link>

          {/* Desktop Links - The "Pill" Effect */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 p-1 rounded-full border border-white/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors">
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? "text-white" : "text-muted-foreground hover:text-primary"}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-full bg-pink-50 text-primary border border-pink-100 hover:bg-primary hover:text-white transition-colors group"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white">
                2
              </span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full text-muted-foreground hover:bg-pink-50 hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </motion.button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-pink-50 text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Sparkles className="absolute top-20 left-10 text-pink-200 w-20 h-20 opacity-50" />
                <Heart className="absolute bottom-20 right-10 text-pink-100 w-32 h-32 opacity-50" />
            </div>

            {/* Mobile Links */}
            <nav className="flex flex-col gap-6 text-center relative z-10">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-3xl font-bold ${
                      pathname === item.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
            >
                <Button className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">
                    View Cart
                </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}