"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  images: string[];
  thumbnail: string;
  tags: string[];
  repo?: string;
}

interface ProjectCarouselProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
  state: "hero" | "expand" | "collapse" | "mobile" | string;
}

export default function ProjectCarousel({
  projects,
  onProjectClick,
  state,
}: ProjectCarouselProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleNext = () => {
    setFocusedIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setFocusedIndex((prev) => (prev - 1 + projects.length) % projects.length);
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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const getSizeConfig = () => {
    switch (state) {
      case "hero":
        return { width: 280, height: 280, showName: false };
      case "expand":
        return { width: 320, height: 360, showName: true };
      case "collapse":
        return { width: 180, height: 180, showName: true };
      case "mobile":
        return {
          width: 240,
          height: 340,
          showName: true,
        };
      default:
        return { width: 500, height: 500, showName: true };
    }
  };

  const { width, height, showName } = getSizeConfig();

  const getItemStyle = (index: number) => {
    let distance = index - focusedIndex;

    if (distance > projects.length / 2) {
      distance = distance - projects.length;
    } else if (distance < -projects.length / 2) {
      distance = distance + projects.length;
    }

    const absDistance = Math.abs(distance);
    const isInView = absDistance <= 2;

    if (!isInView)
      return { opacity: 0, scale: 0.6, blur: 20, offset: distance, zIndex: 0 };

    if (absDistance === 0) {
      return { opacity: 1, scale: 1, blur: 0, zIndex: 10, offset: distance };
    }

    const blur = absDistance * 8;
    const scale = 1 - absDistance * 0.15;
    const opacity = 1 - absDistance * 0.3;

    return { opacity, scale, blur, zIndex: 10 - absDistance, offset: distance };
  };

  return (
    <div
      className="relative w-full h-full flex items-center  justify-center overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        onClick={handlePrev}
        data-cursor-text="PREV"
        className="absolute left-2 md:left-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 border border-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
        aria-label="Previous project"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="rotate-180"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="relative flex items-center justify-center w-full h-full perspective-1000">
        {projects.map((project, index) => {
          const style = getItemStyle(index);
          const spacingMultiplier = state === "mobile" ? 0.55 : 0.75;
          const offset = style.offset * (width * spacingMultiplier);

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, width, height }}
              animate={{
                opacity: style.opacity,
                scale: style.scale,
                x: offset,
                filter: `blur(${style.blur}px)`,
                width,
                height,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                zIndex: style.zIndex,
              }}
              onClick={() => {
                if (index === focusedIndex && onProjectClick) {
                  onProjectClick(project);
                } else {
                  setFocusedIndex(index);
                }
              }}
              className="cursor-pointer will-change-transform"
            >
              <div
                className="w-full h-full rounded-2xl shadow-2xl bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden transition-shadow duration-300 hover:shadow-white/10"
                style={{
                  pointerEvents: index === focusedIndex ? "auto" : "none",
                }}
              >
                <img
                  src={`/assets/${project.thumbnail}`}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/400x600/171717/ffffff?text=Project";
                  }}
                />
              </div>

              {showName && index === focusedIndex && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -bottom-12 left-0 right-0 flex flex-col items-center"
                >
                  <h3 className=" mx-12 text-white font-bold text-lg tracking-tight text-center drop-shadow-md max-w-xs overflow-hidden text-ellipsis">
                    {project.name}
                  </h3>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        data-cursor-text="NEXT"
        className="absolute right-2 md:right-4 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 border border-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
        aria-label="Next project"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="absolute bottom-4 flex gap-1.5 z-30">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setFocusedIndex(index)}
            aria-label={`Go to project ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === focusedIndex
                ? "bg-white w-6"
                : "bg-white/20 w-1.5 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
