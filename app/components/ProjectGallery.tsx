"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

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

interface ProjectGalleryProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectGallery({
  projects,
  onProjectClick,
}: ProjectGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex items-center justify-center px-8"
    >
      <div className="max-w-7xl w-full">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-8"
        >
          Featured Projects
        </motion.h2>

        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden pb-6 scrollbar-hide"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.3) transparent",
          }}
        >
          <div className="flex gap-6 min-w-max">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => onProjectClick(project)}
                className="bento-box w-80 h-96 cursor-pointer overflow-hidden group"
              >
                <div className="w-full h-64 bg-linear-to-br from-purple-500/20 to-blue-500/20 relative overflow-hidden">
                  <motion.div
                    className="w-full h-full bg-white/5"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {projects.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/60 transition-colors cursor-pointer"
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
