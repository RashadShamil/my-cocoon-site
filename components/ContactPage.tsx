'use client'

import { useRef } from "react"; // ✅ Added useRef
// ✅ Added useScroll and useTransform
import { motion, useScroll, useTransform } from "motion/react";
import { Mail, MapPin, Phone, Facebook, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { useState } from "react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Construct the email details
    const recipient = "Coccoonkids@gmail.com";
    const subject = `New Inquiry from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`;

    // 2. Open the user's email client
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // ✅ PARALLAX SETUP
  const containerRef = useRef(null);
  // Track scroll progress of the entire page container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], 
  });

  // Map scroll to movement. The background moves slower than scroll (0% to 20%)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    // ✅ Added ref and changed to relative
    <div className="min-h-screen relative" ref={containerRef}>
      
      {/* =========================================
          ✅ PARALLAX BACKGROUND LAYER
      ========================================= */}
      <motion.div 
        style={{ y }} 
        className="fixed top-0 left-0 w-full h-[120vh] -z-10"
      >
        <img
          // ⚠️ REPLACE with your beautiful banner image path
          src="/banner-bg.jpg"
          alt="Contact Background"
          // ✅ Brightness kept at 100% (no filter)
          className="w-full h-full object-cover" 
        />
      </motion.div>

      {/* =========================================
          MAIN CONTENT AREA (Scrolling on top)
      ========================================= */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* WRAPPER BOX for readability against parallax bg */}
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-[3rem] p-6 md:p-12 shadow-2xl border border-white/50">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-gray-900">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have a question or want to place a special order? We'd love to hear from
              you!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* ✅ Changed card background to be slightly transparent white for consistency */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Your Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      // Updated input styles for better contrast
                      className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                       className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="+94771234567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                       className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700">Message</label>
                    <Textarea
                      placeholder="Tell us about your requirements..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={5}
                       className="w-full bg-white border-gray-300 focus:border-primary focus:ring-primary resize-none"
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                    >
                      Send Message
                      <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Contact Cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    title: "Phone",
                    content: "+94 77 383 4674",
                    subtext: "Mon-Sun 9am-6pm",
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    content: "Coccoonkids@gmail.com",
                    subtext: "We reply within 24 hours",
                  },
                  {
                    icon: MapPin,
                    title: "Visit Us",
                    content: "Factory outlet: 4/3, Isnapulla Road, Dharga Town, Aluthgama",
                    subtext: "Come say hello!",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 10 }}
                    // ✅ Updated card style for better contrast
                    className="flex items-start gap-4 p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                      <item.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900">{item.title}</h3>
                      <p className="text-gray-800 mb-1 font-medium">{item.content}</p>
                      <p className="text-sm text-muted-foreground">{item.subtext}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                // ✅ Updated style for better contrast
                className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 backdrop-blur-sm border border-white/50 shadow-sm"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Follow Us on Social Media
                </h3>
                <p className="text-sm text-gray-700 mb-6">
                  Stay updated with our latest collections and special offers
                </p>

                <motion.a
                  href="https://www.facebook.com/cocoon123"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors w-fit shadow-md"
                >
                  <Facebook className="w-5 h-5" />
                  <span>Visit our Facebook Page</span>
                </motion.a>
              </motion.div>

              {/* Decorative Element */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-md border-4 border-white/50"
              >
                <img
                  src="https://images.unsplash.com/photo-1663501651058-ceb8e19d8594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXJmbHklMjBmbG93ZXJzJTIwcGlua3xlbnwxfHx8fDE3Njc0MzM3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Contact Cocoon"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-6">
                  <p className="text-white font-bold text-lg drop-shadow-sm">
                    We can't wait to help make your little one's dreams come true! ✨
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div> {/* End Wrapper Box */}
      </div>
    </div>
  );
}