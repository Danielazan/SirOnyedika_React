

// Icons
import Ship from "../../assets/shipicon.png"
import MoneyBag from "../../assets/moneybagIcon.png"
import Wallet from "../../assets/walletIcon.png"
import Support from "../../assets/supportIcon.png"

import React from 'react';
import { motion } from 'framer-motion';
import HeroImg from "../../assets/hero.png"

// Animation configuration for staggered entrance effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,  // Each child animates 200ms after the previous
      delayChildren: 0.1,    // Slight pause before first animation starts
    },
  },
};

// Individual text element animation - slides up and fades in
const textItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30  // Starts below final position
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1], // Smooth cubic-bezier curve
    },
  },
};

// Image animation - slides in from right side
const imageVariants = {
  hidden: { 
    opacity: 0, 
    x: 60,  // Starts offset to the right
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: "easeOut",
      delay: 0.4, // Waits for text animations to begin
    },
  },
};

const HeroSection = () => {
  // Simulated backend API response data
  const heroContent = {
    subtitle: "New Season. New Style",
    headline: "Elevate Your Everyday Look",
    description: "Shop stylish outfits and accessories, skincare and hair essentials you'll love.",
    primaryCta: {
      label: "Shop Now",
      href: "/shop",
    },
    secondaryCta: {
      label: "Explore Collection",
      href: "/collection",
    },
    heroImage: {
      src: HeroImg,
      alt: "Fashion model wearing beige linen jumpsuit",
    },
  };

  const features = [
    {
      id: 1,
      icon: Ship,
      title: 'Free Shipping',
      description: 'Free shipping for order above $185',
      delay: 0.2
    },
    {
      id: 2,
      icon: MoneyBag,
      title: 'Members Discount',
      description: 'Discount for elite members',
      delay: 0.4
    },
    {
      id: 3,
      icon: Wallet,
      title: 'Flexible Payment',
      description: 'Secured payment options',
      delay: 0.6
    },
    {
      id: 4,
      icon: Support,
      title: 'Swift Support',
      description: '24/7 customer support',
      delay: 0.8
    }
  ];

  return (
    <section className="bg-stone-50 h-auto w-full">
      {/* Main container with mobile-first responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 md:pt-24 lg:pt-16 ">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20 xl:gap-24 ">
          
          {/* Left Content Column: Text and CTAs */}
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col items-start space-y-6 md:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Decorative Subtitle: Script-style italic text for seasonal messaging */}
            <motion.p 
              variants={textItemVariants}
              className="font-['Pacifico'] italic text-lg font-extrabold md:text-xl lg:text-xl text-black-800 tracking-wide"
            >
              {heroContent.subtitle}
            </motion.p>

            {/* Main Headline: Bold, large typography for primary value proposition */}
            <motion.h1 
              variants={textItemVariants}
              className="text-2xl font-[poppins] sm:text-2xl md:text-4xl font-bold text-gray-900 leading-[1.1] tracking-tight"
            >
              {heroContent.headline}
            </motion.h1>

            {/* Description: Body copy explaining product categories */}
            <motion.p 
              variants={textItemVariants}
              className="text-base md:text-medium text-black max-w-xl leading-relaxed"
            >
              {heroContent.description}
            </motion.p>

            {/* CTA Group: Primary solid button and secondary outline button */}
            <motion.div 
              variants={textItemVariants}
              className="flex flex-col md:gap-12 sm:flex-row sm:gap-4 md:w-full sm:w-auto pt-2"
            >
              {/* Primary Action: High-emphasis conversion button */}
              <a
                href={heroContent.primaryCta.href}
                className="inline-flex items-center justify-center px-10 py-3.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-sm uppercase tracking-wider transition-all duration-300 rounded-sm shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {heroContent.primaryCta.label}
              </a>

              {/* Secondary Action: Low-emphasis exploration button */}
              <a
                href={heroContent.secondaryCta.href}
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white active:bg-orange-700 font-semibold text-sm uppercase tracking-wider transition-all duration-300 rounded-sm"
              >
                {heroContent.secondaryCta.label}
              </a>
            </motion.div>
          </motion.div>

          {/* Right Visual Column: Hero imagery with subtle scale effect */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center lg:justify-end "
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg ">
              {/* Soft ambient glow effect behind model */}
              <div className="absolute -inset-4 bg-orange-200/30 rounded-full blur-3xl opacity-40"></div>
              
              <img
                src={heroContent.heroImage.src}
                alt={heroContent.heroImage.alt}
                className="relative w-full h-auto object-cover"
                style={{
                  maxHeight: '700px',
                  objectPosition: 'center top',
                }}
              />
            </div>
          </motion.div>
        </div>
        
      </div>
      {/* Last part */}
        <div className="w-full bg-white py-6 md:py-8 px-4 md:mt-0">
        <div className="max-w-7xl mx-auto ">
          {/* Features Grid Container */}
          <div className="grid md:grid-cols-4 grid-cols-2 gap-16 md:gap-10 ">
            {features.map((feature) => (
              /* Individual Feature Card - Animates sequentially */
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: feature.delay,
                  ease: "easeOut"
                }}
                className="flex flex-row md:items-start items-center md:text-left text-center gap-3 "
              >
                {/* Icon Container */}
                <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-between ">
                  <img
                    src={feature.icon}
                    alt={`${feature.title} icon`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Feature Title */}
                <div className='w-full h-20  justify-between'>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  {/* Feature Description */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;