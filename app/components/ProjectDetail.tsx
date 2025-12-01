"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// --- Types ---
interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  images: string[];
  thumbnail: string;
  tags: string[];
}

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

// --- Animation Variants ---
const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { opacity: 1, backdropFilter: "blur(12px)" },
  exit: { opacity: 0, backdropFilter: "blur(0px)" },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.4 },
  },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.1,
    filter: "blur(4px)",
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
  }),
};

export default function ProjectDetail({
  project,
  onClose,
}: ProjectDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Use tags from project data instead of hardcoded stack
  const tags = project?.tags || [
    "React",
    "Next.js",
    "Tailwind",
    "Framer Motion",
  ];

  useEffect(() => {
    setCurrentImageIndex(0);
    setDirection(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentImageIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex < 0) nextIndex = project.images.length - 1;
      if (nextIndex >= project.images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) paginate(1);
    else if (isRightSwipe) paginate(-1);
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/10 p-0 md:p-6"
        onClick={onClose}
      >
        {/* Animated Background Noise/Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" />

        <motion.div
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-[100dvh] md:h-[85vh] md:max-w-7xl bg-black/20 md:rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row group"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-black/40 text-white/50 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md border border-white/5 group-hover:border-white/20"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* === IMAGE SECTION (Left/Top) === */}
          <div
            className="relative w-full h-[45vh] md:h-full md:w-[62%] bg-black/40 overflow-hidden select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Gradient Vignette */}
            <div className="absolute inset-0 z-10 bg-black/10 opacity-80 md:opacity-40" />

            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentImageIndex}
                src={`/assets/${project.images[currentImageIndex]}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 w-full h-full object-contain md:object-contain bg-black/40"
                draggable={false}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/1200x800/18181b/3f3f46?text=${project.name}`;
                }}
              />
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute inset-0 z-20 flex items-center justify-between px-4 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <button
                onClick={() => paginate(-1)}
                className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/10 hover:scale-110 active:scale-95 transition-all pointer-events-auto"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/10 hover:scale-110 active:scale-95 transition-all pointer-events-auto"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Mobile Pagination Dots */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2 md:hidden">
              {project.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* === INFO SECTION (Right/Bottom) === */}
          <motion.div className="flex-1 w-full md:w-[38%] h-full bg-zinc-900/50 backdrop-blur-sm border-l border-white/5 flex flex-col relative">
            {/* Decorative Top Line */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-12 scrollbar-hide">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Header */}
                <motion.div variants={staggerItem} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium border border-zinc-700/50 px-2 py-1 rounded bg-zinc-800/30">
                      Interactive
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span className="text-xs text-zinc-500 font-mono">
                      0{project.id}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-[0.9]">
                    {project.name}
                  </h2>
                </motion.div>

                {/* Description */}
                <motion.div variants={staggerItem} className="space-y-6">
                  <p className="text-base md:text-lg text-zinc-400 font-light leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs text-zinc-300 bg-zinc-800/50 border border-white/5 rounded-full hover:border-white/20 hover:bg-zinc-800 transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Thumbnail Gallery (Interactive) */}
                <motion.div variants={staggerItem} className="pt-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Gallery Preview
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mask-linear-fade">
                    {project.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDirection(index > currentImageIndex ? 1 : -1);
                          setCurrentImageIndex(index);
                        }}
                        className={`relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden transition-all duration-300 ${
                          currentImageIndex === index
                            ? " border-b -offset-2 ring-offset-zinc-900 opacity-100 grayscale-0"
                            : "<opacity-5> </opacity-5>0"
                        }`}
                      >
                        <img
                          src={`/assets/${img}`}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Footer Actions */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="p-6 md:p-8  border-white/5 bg-black/5 backdrop-blur-xl z-20"
            >
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-white via-white/50 to-white/25  text-black font-semibold overflow-hidden transition-transform active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    Live Demo
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>

                <a
                  href={project.repo || "#"}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-black/30 text-white font-medium border border-white/20 hover:bg-zinc-700 transition-colors active:scale-95"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  Code
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
