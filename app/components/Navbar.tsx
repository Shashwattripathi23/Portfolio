"use client";

import { motion, animate } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

interface NavbarProps {
  scrollProgres?: number;
  setScrollIndex?: (progress: number) => void;
  musicOn?: boolean;
  setMusicOn?: (on: boolean) => void;
}

export default function Navbar({
  scrollProgres = 0,
  setScrollIndex,
  musicOn,
  setMusicOn,
}: NavbarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    {
      name: "Home",
      scrollProgress: 0,
    },
    {
      name: "Projects",
      scrollProgress: 1,
    },
    {
      name: "About me",
      scrollProgress: 3,
    },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-10 mx-auto z-50 px-10" // Adjusted padding/positioning for consistency
    >
      {/* Changed flex to grid so col-span works, or use flex w/ auto margins */}
      <div className="w-full flex ml-28 mt-10 grid-cols-12 items-start">
        <div className="col-span-6 lg:col-span-7" />

        <div className="col-span-6 lg:col-span-5 flex justify-start items-start gap-6 md:gap-8 bg-black/10 border backdrop-blur-sm rounded-full pr-8 pl-2 py-2  border-white/5">
          <motion.button
            onClick={() => window.open("https://github.com", "_blank")}
            className="flex items-center gap-3 pl-4 pr-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub size={20} />
            <span>Github</span>
          </motion.button>

          {navItems.map((item) => {
            // Determine if this item is currently active based on scroll progress
            const isActive = Math.abs(scrollProgres - item.scrollProgress) < 0.1; // Using a small threshold for safer float comparison
            
            return (
              <motion.button
                key={item.name}
                onClick={() => {
                  if (setScrollIndex) {
                    const startValue = scrollProgres;
                    const targetValue = item.scrollProgress;

                    animate(startValue, targetValue, {
                      duration: 1,
                      ease: "easeInOut",
                      onUpdate: (latestValue) => {
                        setScrollIndex(latestValue);
                      },
                    });
                  }
                }}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative transition-colors text-sm font-medium py-2 px-1 ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                
                {/* Underline Animation */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    // Width is 100% if hovered OR if it matches the current scroll progress
                    width: hoveredItem === item.name || isActive ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
            );
          })}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMusicOn && setMusicOn(!musicOn)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ml-2"
            title={musicOn ? "Pause Music" : "Play Music"}
          >
            <span className="text-sm">{musicOn ? " ⏸" : "▶"}</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}