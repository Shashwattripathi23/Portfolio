"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ProjectCarousel from "./ProjectCarousel";

interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  images: string[];
  thumbnail: string;
}

interface HeroProps {
  onProjectsClick: () => void;
  projects: Project[];
  onProjectClick: (project: Project) => void;
  scrollProgress: number;
}

export default function Hero({
  onProjectsClick,
  projects,
  onProjectClick,
  scrollProgress,
}: HeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const blueBoxTransform = `translateY(-${scrollProgress * 120}%)`;
  const redBoxTransform = `translateX(${scrollProgress * 120}%)`;

  const yellowBoxBorderRadius = `${scrollProgress * 24}px`;

  // Yellow box stays in relative flow and scales up in place
  const yellowBoxScale = 1 + scrollProgress * 0.8;
  const yellowBoxOpacity = 1;
  const yellowBoxTransform = `scale(${yellowBoxScale}) translateX(${scrollProgress * 10}%)`;

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="min-h-[95vh] py-40 w-11/12 flex flex-row px-8 text-center bg-black relative overflow-hidden">
        <div className="h-flex-1 bg-black w-2/3 border-gray-300 flex flex-col relative">
          <div
            style={{ transform: blueBoxTransform }}
            className="bg-blue-500 h-1/2 p-12 flex flex-col justify-center transition-transform duration-700 ease-out"
          >
            <h2 className="text-3xl font-light text-white/80 mb-2 text-left">
              Hello
            </h2>
            <h1 className="text-7xl font-bold text-white mb-8 text-left">
              I am Shashwat
            </h1>
            <p className="text-lg text-white/50 mb-6 text-left">
              May I interest you with some music while you scroll?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all flex items-center gap-3 w-fit"
            >
              <span className="text-xl">{isPlaying ? "⏸" : "▶"}</span>
              <span>{isPlaying ? "Pause Music" : "Play Music"}</span>
            </motion.button>
          </div>

          <div
            style={{
              transform: yellowBoxTransform,
              borderRadius: yellowBoxBorderRadius,
              transformOrigin: "center center",
              zIndex: 20,
            }}
            className="bg-yellow-500 h-1/2 p-6 overflow-hidden transition-all duration-700 ease-out"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white text-left">
                Selected Works
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={onProjectsClick}
                className="text-white/80 hover:text-white text-sm transition-colors font-medium"
              >
                View All →
              </motion.button>
            </div>
            <div className="h-full">
              <ProjectCarousel
                projects={projects}
                onProjectClick={onProjectClick}
                state={scrollProgress > 0.5 ? "expand" : "hero"}
              />
            </div>
          </div>
        </div>
        <div
          style={{ transform: redBoxTransform }}
          className="flex-1 bg-red-900 w-1/3 transition-transform duration-700 ease-out"
        />
      </div>
    </div>
  );
}
