"use client";

import { motion } from "framer-motion";
import ProjectCarousel from "./ProjectCarousel";

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

interface ExpandedProjectViewProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onBackClick: () => void;
}

export default function ExpandedProjectView({
  projects,
  onProjectClick,
  onBackClick,
}: ExpandedProjectViewProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="w-full max-w-7xl h-[90vh] bg-yellow-500 rounded-3xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Selected Works</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackClick}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
            >
              ← Back
            </motion.button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ProjectCarousel
              projects={projects}
              onProjectClick={onProjectClick}
              state="expand"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
