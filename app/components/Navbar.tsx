"use client";

import { motion, animate } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";

interface NavbarProps {
  scrollProgres?: number;
  setScrollIndex?: (progress: number) => void;
  musicOn?: boolean;
  setMusicOn?: (on: boolean) => void;
  projectDetailOpen?: boolean;
}

export default function Navbar({
  scrollProgres = 0,
  setScrollIndex,
  musicOn,
  setMusicOn,
  projectDetailOpen = false,
}: NavbarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Track the active nav item based on scroll progress
  const [activeItem, setActiveItem] = useState<string | null>("Home");

  // 1. Defined navItems first so useEffect can read it
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

  useEffect(() => {
    // 2. This logic finds the closest item correctly
    const closestItem = navItems.reduce((prev, current) => {
      return Math.abs(current.scrollProgress - scrollProgres) <
        Math.abs(prev.scrollProgress - scrollProgres)
        ? current
        : prev;
    });

    setActiveItem(closestItem.name);
  }, [scrollProgres]); // React might ask for navItems dependency, but since it's constant inside render, this is okay for now.

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-10 mx-auto z-50 px-10"
    >
      <div className="w-full flex ml-28 mt-10 grid-cols-12 items-start">
        <div className="col-span-6 lg:col-span-7" />

        <div className="col-span-6 h-12 lg:col-span-5 flex justify-start items-start gap-4 md:gap-6 bg-black/10 border backdrop-blur-sm rounded-full pr-6 pl-2 py-2 border-white/5 max-w-fit">
          <motion.button
            onClick={() => window.open("https://github.com", "_blank")}
            className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub size={16} />
            <span>Github</span>
          </motion.button>

          {navItems.map((item) => {
            // 3. FIX HERE: Check against the state we calculated in useEffect
            // instead of doing the math check again.
            const isActive = activeItem === item.name;

            return (
              <motion.button
                key={item.name}
                onClick={() => {
                  if (setScrollIndex && !projectDetailOpen) {
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
                onMouseEnter={() =>
                  !projectDetailOpen && setHoveredItem(item.name)
                }
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative transition-colors text-xs font-medium py-2 px-1 ${
                  projectDetailOpen
                    ? "text-white/30 cursor-not-allowed"
                    : isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
                whileTap={{ scale: projectDetailOpen ? 1 : 0.95 }}
                disabled={projectDetailOpen}
              >
                {item.name}

                {/* Underline Animation */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    // Logic: Animate width to 100% if Hovered OR Active
                    width:
                      !projectDetailOpen &&
                      (hoveredItem === item.name || isActive)
                        ? "100%"
                        : "0%",
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
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ml-2"
            title={musicOn ? "Pause Music" : "Play Music"}
          >
            <span className="text-xs">{musicOn ? " ⏸" : "▶"}</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
