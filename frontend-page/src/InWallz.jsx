import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
const isDark = true;

import logo from "./assets/logo.svg";// CONFIGURATION - Easy to edit all content
// ============================================================================
const CONFIG = {
  companyName: "InWallz",
  tagline: "Transform Your Walls Into Dynamic Digital Experiences",
  description: "InWallz revolutionizes how businesses communicate with intelligent wall-mounted digital signage. Display real-time content, engage your audience, and manage everything from one powerful dashboard.",
  
  heroStats: [
    { value: "20", label: "Active Clients" },
    { value: "50+", label: "Displays Deployed" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ],

  features: [
  {
    icon: Monitor,
    title: "Centralized Screen Control",
    description:
      "Manage all your TVs and displays from one powerful dashboard. Control single screens or groups effortlessly.",
  },
  {
    icon: CalendarClock,
    title: "Smart Scheduling",
    description:
      "Schedule content by time, date, or repeat patterns. Automate playlists for different hours, days, or events.",
  },
  {
    icon: Users,
    title: "Group-Based Management",
    description:
      "Create screen groups for wards, floors, departments, or branches and update them all at once.",
  },
  {
    icon: WifiOff,
    title: "Offline Playback Support",
    description:
      "Content continues to play even without internet. Screens auto-sync once connectivity is restored.",
  },
  {
    icon: Zap,
    title: "Instant Content Updates",
    description:
      "Push updates instantly to any screen. Change announcements, information, or promotions in seconds.",
  },
  {
    icon: Megaphone,
    title: "Live Ticker & Alerts",
    description:
      "Display live announcements, emergency alerts, or scrolling messages across screens in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Role-Based Access",
    description:
      "Enterprise-grade security with admin, editor, and viewer roles to keep content safe and controlled.",
  },
],

  
  founders: [
    {
      name: "Arun Shankar",
      role: "Managing Director",
      email: "sarah.chen@inwallz.com",
      phone: "+91 9790881371",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      name: "Rahul Krishnamoorthy",
      role: "Product Director",
      email: "michael.rodriguez@inwallz.com",
      phone: "+91 9176302567",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      name: "Inba Raj",
      role: "Design Director",
      email: "priya.patel@inwallz.com",
      phone: "+91 6382188896",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    }
  ],
  
  pricing: [
    {
      name: "Initial Setup",
      price: "₹3000",
      period: "",
      description: "Includes Complete Online and Offline Device Setup",
      features: [
        "Incudes Android Box",
        "Lifetime Box Replacement",
        "5 Free Designs",
        "User Application",
        "*Price May Reduce On Bulk Orders"
      ],
      highlighted: true,
      cta: "Start Free Trial"
    },
    {
      name: "Silver Plan",
      price: "₹350",
      period: "/month",
      description: "Ideal for growing businesses with multiple locations",
      features: [
        "Access to Application",
        "Monthly Device Check",
        "24/5 Customer Service",
        "Custom branding",
        "API access",
      ],
      highlighted: false,
      cta: "Most Popular"
    },
    {
      name: "Gold Plan",
      price: "₹400",
      period: "/month",
      description: "Unlimited scale with dedicated support",
      features: [
        "Access to Application",
        "24/7 dedicated support",
        "Content Management",
        "Weekly Device Check",
        "Advanced Analytics",
      ],
      highlighted: true,
      cta: "Contact Sales"
    }
  ],
  
  contact: {
    email: "tech.inwallz@gmail.com",
    phone: " ",
    hours: "24/7 Support",
    social: {
      instagram: "https://www.instagram.com/inwallz.tech?igsh=ajM2b3cxdjludHM5"
    }
  },

};



// ============================================================================
// NAVBAR COMPONENT
// ============================================================================
const Navbar = ({ activeSection, setActiveSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = ['Home', 'Features', 'Pricing', 'Contact'];

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? isDark 
            ? 'bg-black/95 backdrop-blur-xl shadow-lg shadow-cyan-500/5' 
            : 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => scrollToSection('Home')}
          >
            {/*<div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
              isDark 
                ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600' 
                : 'bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500'
            }`}>
              <span className="text-white font-bold text-lg sm:text-xl">IW</span>
            </div>*/}
            <img src={logo} alt="InWallz Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className={`text-xl sm:text-2xl font-bold ${
              isDark 
                ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent'
            }`}>
              {CONFIG.companyName}
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === item
                    ? isDark
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400'
                      : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'
                    : isDark
                      ? 'text-gray-300 hover:text-white hover:bg-white/5'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-4">
           
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${
                isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden overflow-hidden ${
                isDark ? 'bg-gray-900/50' : 'bg-white/50'
              } backdrop-blur-xl rounded-2xl mb-4`}
            >
              <div className="py-4 px-2 space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(item)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                      activeSection === item
                        ? isDark
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400'
                          : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'
                        : isDark
                          ? 'text-gray-300 hover:bg-white/5'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// ============================================================================
// HERO/HOME SECTION
// ============================================================================
const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  const [showDemo, setShowDemo] = useState(false);


  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section id="home" className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
      isDark ? 'bg-black' : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-black"></div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
            />
          </>
        ) : (
          <>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                x: [0, 50, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-cyan-300/40 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.1, 1, 1.1],
                x: [0, -50, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-300/30 to-blue-300/30 rounded-full blur-3xl"
            />
          </>
        )}
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 ${
              isDark 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' 
                : 'bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200'
            }`}
          >
            <span className={`text-xs sm:text-sm font-semibold ${
              isDark ? 'text-cyan-400' : 'text-blue-700'
            }`}>
              🚀 Next-Gen Digital Signage Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight ${
              isDark 
                ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent'
            }`}
          >
            {CONFIG.tagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {CONFIG.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: isDark ? '0 0 30px rgba(34, 211, 238, 0.5)' : '0 0 30px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemo(true)}
              className={`px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg shadow-cyan-500/50' 
                  : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-lg shadow-blue-500/30'
              } w-full sm:w-auto`}
            >
              Start Free Trial
            </motion.button>
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
    onClick={() => setShowVideo(true)}

  className={`px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 ${
    isDark 
      ? 'bg-white/10 text-white border-2 border-cyan-500/50 hover:bg-white/20 backdrop-blur-sm' 
      : 'bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-50 shadow-md'
  } w-full sm:w-auto`}
>
  Watch Demo
</motion.button>

          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-16 sm:mt-20 max-w-5xl mx-auto px-4"
          >
            {CONFIG.heroStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
                  isDark 
                    ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-sm' 
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${
                  isDark 
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>aa
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`w-6 h-10 rounded-full border-2 ${
            isDark ? 'border-cyan-500' : 'border-blue-600'
          } flex items-start justify-center p-2`}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-1.5 h-1.5 rounded-full ${
              isDark ? 'bg-cyan-500' : 'bg-blue-600'
            }`}
          />
        </motion.div>
      </motion.div>
      <AnimatePresence>
  {showDemo && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-[95%] max-w-4xl h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowDemo(false)}
          className="absolute top-4 right-4 z-50 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
        >
          ✕
        </button>

        {/* Google Form */}
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdhJD4ye2aygD-adRbehVbSs2K7aAs-Bwa68fnuudugXS5tWw/viewform?embedded=true"
          className="w-full h-full border-none"
          title="Watch Demo Form"
        ></iframe>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
<AnimatePresence>
  {showVideo && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-[95%] max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowVideo(false)}
          className="absolute top-4 right-4 z-50 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
        >
          ✕
        </button>

        {/* VIDEO */}
        <video
  src="/demo.mp4"
  controls
  autoPlay
  playsInline
  className="w-full h-full object-contain bg-black"
/>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </section>
  );
};

// ============================================================================
// FEATURES SECTION
// ============================================================================
import {
  Monitor,
  CalendarClock,
  Users,
  WifiOff,
  Zap,
  Megaphone,
  ShieldCheck,
} from "lucide-react";


const Features = () => {
 
  

  return (
    <section id="features" className={`py-16 sm:py-24 lg:py-32 ${
      isDark ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-b from-white via-gray-50 to-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
          }`}>
            Powerful Features
          </h2>
          <p className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Everything you need to create, manage, and optimize your digital signage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CONFIG.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-cyan-500/50 backdrop-blur-sm' 
                  : 'bg-white border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="mb-4 sm:mb-6">
  <feature.icon
  size={48}
  className={`${
    isDark
      ? "text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
      : "text-blue-600"
  }`}
/>

</div>

              <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// PRICING SECTION
// ============================================================================
const Pricing = ({ setActiveForm }) => {
  const FORM_LINKS = {
  "Initial Setup":
    "https://docs.google.com/forms/d/e/1FAIpQLSdhJD4ye2aygD-adRbehVbSs2K7aAs-Bwa68fnuudugXS5tWw/viewform?embedded=true",

  "Silver Plan":
    "https://docs.google.com/forms/d/e/1FAIpQLSdhJD4ye2aygD-adRbehVbSs2K7aAs-Bwa68fnuudugXS5tWw/viewform?embedded=true",

  "Gold Plan":
    "https://docs.google.com/forms/d/e/1FAIpQLSdhJD4ye2aygD-adRbehVbSs2K7aAs-Bwa68fnuudugXS5tWw/viewform?embedded=true",
};


 

  return (
    <section id="pricing" className={`py-16 sm:py-24 lg:py-32 ${
      isDark ? 'bg-black' : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
          }`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Choose the perfect plan for your business. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {CONFIG.pricing.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -15, scale: 1.03 }}
              className={`relative p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl transition-all duration-300 ${
                plan.highlighted
                  ? isDark
                    ? 'bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-blue-500/20 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                    : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-2 border-blue-400 shadow-2xl shadow-blue-500/20'
                  : isDark
                    ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-cyan-500/30'
                    : 'bg-white border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.highlighted && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold ${
                  isDark 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                }`}>
                  {plan.cta}
                </div>
              )}

              <div className="mb-6 sm:mb-8">
                <h3 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm sm:text-base ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${
                    isDark 
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg sm:text-xl ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 ${
                      isDark ? 'text-cyan-400' : 'text-blue-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm sm:text-base ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                 onClick={() => setActiveForm(FORM_LINKS[plan.name])}
                className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 ${
                  plan.highlighted
                    ? isDark
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-lg shadow-blue-500/30'
                    : isDark
                      ? 'bg-white/10 text-white border-2 border-cyan-500/50 hover:bg-white/20'
                      : 'bg-gray-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-50'
                }`}
              >
                {plan.highlighted && !plan.cta.includes('Popular') ? plan.cta : 'Get Started'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ============================================================================
// CONTACT SECTION
// ============================================================================
const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSending(true);
    setIsSent(false);

    try {
      const response = await fetch("http://localhost:5000/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSent(true);

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        setTimeout(() => {
          setIsSent(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsSending(false);
  };


  return (
    <section id="contact" className={`py-16 sm:py-24 lg:py-32 ${
      isDark ? 'bg-black' : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
          }`}>
            Get In Touch
          </h2>
          <p className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className={`p-6 sm:p-8 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10' 
                : 'bg-white border border-gray-200 shadow-lg'
            }`}>
              <h3 className={`text-xl sm:text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Contact Information
              </h3>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
                      : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                  }`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <a href={`mailto:${CONFIG.contact.email}`} className={`text-base sm:text-lg font-medium ${
                      isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      {CONFIG.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
                      : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                  }`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                    <a href={`tel:${CONFIG.contact.phone}`} className={`text-base sm:text-lg font-medium ${
                      isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      {CONFIG.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
                      : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                  }`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Address</p>
                    <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {CONFIG.contact.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
                      : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                  }`}>
                    <svg className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Business Hours</p>
                    <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {CONFIG.contact.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className={`p-6 sm:p-8 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10' 
                : 'bg-white border border-gray-200 shadow-lg'
            }`}>
              <h3 className={`text-xl sm:text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Follow Us
              </h3>
<div className="flex items-center gap-5">
  {/* Instagram Icon */}
  <motion.a
    href={CONFIG.contact.social.instagram}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.15, rotate: 5 }}
    whileTap={{ scale: 0.95 }}
    className={`p-4 rounded-2xl transition-all duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 hover:from-pink-500/30 hover:to-orange-500/30'
        : 'bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 hover:from-pink-200 hover:to-orange-200'
    }`}
  >
    {/* Instagram SVG */}
    <svg
  className={`w-8 h-8 ${isDark ? 'text-pink-400' : 'text-pink-600'}`}
  fill="currentColor"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path
    fillRule="evenodd"
    d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.5A4 4 0 0 0 3.5 7.5v9a4 4 0 0 0 4 4h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-.88a.88.88 0 1 1-1.75 0 .88.88 0 0 1 1.75 0Z"
    clipRule="evenodd"
  />
</svg>

  </motion.a>

  {/* Text beside icon */}
  <div>
    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      Follow us on Instagram
    </p>
    <a
      href={CONFIG.contact.social.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-base font-semibold hover:underline ${
        isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'
      }`}
    >
      @inwallz.tech
    </a>
  </div>
</div>

            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className={`p-6 sm:p-8 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10' 
                : 'bg-white border border-gray-200 shadow-lg'
            }`}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-white/10' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                    } focus:outline-none focus:ring-2 ${
                      isDark ? 'focus:ring-cyan-500/20' : 'focus:ring-blue-500/20'
                    }`}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-white/10' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                    } focus:outline-none focus:ring-2 ${
                      isDark ? 'focus:ring-cyan-500/20' : 'focus:ring-blue-500/20'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-white/10' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                    } focus:outline-none focus:ring-2 ${
                      isDark ? 'focus:ring-cyan-500/20' : 'focus:ring-blue-500/20'
                    }`}
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 resize-none ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-white/10' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                    } focus:outline-none focus:ring-2 ${
                      isDark ? 'focus:ring-cyan-500/20' : 'focus:ring-blue-500/20'
                    }`}
                    placeholder="Tell us more about your needs..."
                  />
                </div>

                <motion.button
  type="submit"
  disabled={isSending}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
    isDark 
      ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70' 
      : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
  }`}
>
  {isSending
    ? "Sending..."
    : isSent
    ? "Sent ✅"
    : "Send Message"}
</motion.button>

              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// FOOTER COMPONENT
// ============================================================================
const Footer = () => {
 

  return (
    <footer className={`py-12 sm:py-16 ${
      isDark 
        ? 'bg-gradient-to-b from-gray-900 to-black border-t border-white/10' 
        : 'bg-gradient-to-b from-gray-100 to-gray-200 border-t border-gray-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
  <img
    src={logo}  
    alt="InWallz Logo"
    className="w-10 h-10"
  />
  <span className="text-xl font-bold text-cyan-400">
    InWallz
  </span>
</div>

            <p className={`text-sm sm:text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Transforming walls into dynamic digital experiences for businesses worldwide.
            </p>
           
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'About Us', 'Blog', 'Careers'].map((link) => (
                <li key={link}>
                  <a href="#" className={`text-sm sm:text-base transition-colors duration-300 ${
                    isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Support
            </h3>
            <ul className="space-y-3">
              {['Help Center', 'Documentation', 'API Reference', 'System Status', 'Contact Support'].map((link) => (
                <li key={link}>
                  <a href="#" className={`text-sm sm:text-base transition-colors duration-300 ${
                    isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <a href={`mailto:${CONFIG.contact.email}`} className={`hover:${isDark ? 'text-cyan-400' : 'text-blue-600'} transition-colors`}>
                  {CONFIG.contact.email}
                </a>
              </li>
              <li className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <a href={`tel:${CONFIG.contact.phone}`} className={`hover:${isDark ? 'text-cyan-400' : 'text-blue-600'} transition-colors`}>
                  {CONFIG.contact.phone}
                </a>
              </li>
              <li className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {CONFIG.contact.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center sm:text-left`}>
              © {new Date().getFullYear()} {CONFIG.companyName}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
const App = () => {
  const [activeSection, setActiveSection] = useState('Home');
  const [activeForm, setActiveForm] = useState(null); // 🔑 ONE GLOBAL STATE

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <Hero />
      <Features />

      {/* ✅ PASS CONTROL TO PRICING */}
      <Pricing setActiveForm={setActiveForm} />

      <Contact />
      <Footer />

      {/* ✅ GLOBAL GOOGLE FORM MODAL */}
      <AnimatePresence>
        {activeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-[95%] max-w-4xl h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActiveForm(null)}
                className="absolute top-4 right-4 z-50 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                ✕
              </button>

              <iframe
                src={activeForm}
                className="w-full h-full border-none"
                title="InWallz Form"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default App;