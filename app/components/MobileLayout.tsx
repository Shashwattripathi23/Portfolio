"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCarousel from "./ProjectCarousel";
import StickmanRagdoll from "./Stickman";
import SocialCanvas from "./SocialCanvas";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Define variants for the individual text/link items
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

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

interface MobileLayoutProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  musicOn: boolean;
  setMusicOn: (on: boolean) => void;
}

export default function MobileLayout({
  projects,
  onProjectClick,
  musicOn,
  setMusicOn,
}: MobileLayoutProps) {
  const [activeSection, setActiveSection] = useState(0);

  const [modalCliked, setModalClicked] = useState(false);

  const sections = ["Home", "Projects", "Social"];
  const oliveAccent = "#8b947f";

  const techStack = [
    "React",
    "TypeScript",
    "Node.js",
    "Next.js",
    "Tailwind CSS",
    "MongoDB",
    "Express",
    "Git",
    "Python",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Figma",
    "Redux",
  ];

  return (
    <div className="h-screen bg-black text-white overflow-y-hidden font-sans selection:bg-white/20">
      {/* Main Content Area */}
      <div className="h-full pb-24 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {/* --- HOME SECTION --- */}
          {activeSection === 0 && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full flex flex-col relative"
            >
              {/* Text Content */}
              <div className="flex-1 px-8 pt-20 flex flex-col justify-start z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {
                    //     modalCliked ? null : <div className=" mb-4 text-sm text-neutral-400 italic border-l-4 border-neutral-600 pl-4">
                    //     <p>Tap on the stickman to see some fun!</p>
                    //   </div>
                  }
                  <h2 className="text-lg font-medium text-neutral-400 mb-2 tracking-wide uppercase text-sm">
                    Hello,
                  </h2>
                  <h1 className="text-5xl font-extrabold tracking-tighter text-white mb-4 leading-[1.1]">
                    I am <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">
                      Shashwat.
                    </span>
                  </h1>
                  <p className="text-neutral-400 text-lg max-w-[80%] leading-relaxed">
                    I build stuff for web and mobile.{" "}
                  </p>
                </motion.div>
              </div>

              {/* Visual Elements Layered Properly */}
              <div
                onClick={() => {
                  // setModalClicked(!modalCliked);
                }}
                className="z-10  "
              >
                {/* Stickman positioned at bottom right/center */}
                <div className="h-3/4 w-full">
                  <StickmanRagdoll />
                </div>
              </div>
            </motion.div>
          )}

          {/* --- PROJECTS SECTION --- */}
          {activeSection === 1 && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col pt-16"
            >
              <div className="px-8 overflow-hidden">
                {" "}
                {/* Added overflow-hidden for text animation */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="overflow-hidden" // Prevents initial slide-in from overflowing
                >
                  <motion.h3
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: "easeOut" },
                      },
                    }}
                    className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/60 leading-none"
                  >
                    Selected
                  </motion.h3>
                  <motion.h3
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                          delay: 0.1,
                        },
                      },
                    }}
                    className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-white/70 to-white/40 leading-none"
                  >
                    Works
                  </motion.h3>
                </motion.div>
                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-zinc-500 mt-3 md:text-base text-sm"
                >
                  Swipe to explore recent builds
                </motion.p>
              </div>

              <div className="h-1/2 mt-12 overflow-x-hidden  flex items-center justify-center ">
                <ProjectCarousel
                  projects={projects}
                  onProjectClick={onProjectClick}
                  state="hero"
                />
              </div>
            </motion.div>
          )}

          {/* --- SOCIAL / ABOUT SECTION --- */}
          {activeSection === 2 && (
            <motion.div
              key="social"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-full px-8 pt-16 pb-10"
            >
              {/* Bio Header */}
              <div className="mb-12">
                {/* 🌟 HEADING: Large, Gradiated, and Animated */}
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-8 
                   text-transparent bg-clip-text bg-gradient-to-r from-white to-white/10"
                >
                  About Me
                </motion.h1>

                {/* ✍️ BIO TEXT: Staggered entrance for each paragraph */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6 text-neutral-300 leading-relaxed text-[17px] max-w-2xl"
                >
                  {/* Paragraph 1: Key Skills */}
                  <motion.p variants={itemVariants}>
                    <p className="intro">
                      Full-stack dev. I build stuff that works, looks good, and
                      actually matters. I’m into{" "}
                      <span className="highlight">smooth UI</span>,{" "}
                      <span className="highlight">real-time systems</span>,{" "}
                      <span className="highlight">modern web tech</span> turning
                      ideas into products that bring me joy. For more of my
                      backend and systems design work, check out my{" "}
                      <a
                        href="https://github.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative font-bold text-white inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-purple-400 after:to-pink-500 after:scale-x-0 after:origin-bottom-left after:transition-transform hover:after:scale-x-100"
                      >
                        GitHub
                      </a>
                    </p>
                  </motion.p>
                </motion.div>
              </div>

              {/* Tech Stack */}
              <div className="mb-12">
                {/* 🚀 HEADING: Refined Typography with Subtle Accent */}
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-white/90">
                    <span style={{ color: oliveAccent }}>Tech stack</span>
                  </h3>
                  <div
                    className="w-16 h-0.5 mt-2 rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${oliveAccent}, transparent)`,
                    }}
                  />
                </div>

                {/* 🛠️ TECH TAGS: Enhanced Style and Animation */}
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: index * 0.05, // Increased delay for a slower, more deliberate cascade
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className={`
              relative px-4 py-2 rounded-lg text-sm font-medium 
              text-neutral-200 bg-neutral-900/50 
              border border-neutral-700 shadow-lg 
              hover:border-neutral-500 
              hover:text-white 
              transition-all duration-300
            `}
                    >
                      {/* Subtle Inner Highlight/Glow on hover */}
                      <span className="absolute inset-0 rounded-lg bg-transparent transition-colors duration-300 group-hover:bg-white/5" />

                      <span className="relative z-10">{tech}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Canvas Footer */}
              <div className="rounded-2xl overflow-hidden border border-white/5 bg-neutral-900/20 p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white/90 mb-2">
                    Connect
                  </h4>
                  <div
                    className="w-12 h-0.5 rounded-full"
                    style={{ backgroundColor: oliveAccent }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/70 transition-all duration-300 group"
                  >
                    <FaGithub className="text-2xl text-white group-hover:text-white/90" />
                    <div>
                      <p className="text-sm font-medium text-white">GitHub</p>
                      <p className="text-xs text-neutral-400">
                        Code & Projects
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://linkedin.com/in/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/70 transition-all duration-300 group"
                  >
                    <FaLinkedin className="text-2xl text-blue-400 group-hover:text-blue-300" />
                    <div>
                      <p className="text-sm font-medium text-white">LinkedIn</p>
                      <p className="text-xs text-neutral-400">Professional</p>
                    </div>
                  </a>

                  <a
                    href="https://twitter.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/70 transition-all duration-300 group"
                  >
                    <FaTwitter className="text-2xl text-sky-400 group-hover:text-sky-300" />
                    <div>
                      <p className="text-sm font-medium text-white">Twitter</p>
                      <p className="text-xs text-neutral-400">Thoughts</p>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/70 transition-all duration-300 group"
                  >
                    <FaInstagram className="text-2xl text-pink-400 group-hover:text-pink-300" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Instagram
                      </p>
                      <p className="text-xs text-neutral-400">Life & Work</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- BOTTOM NAVIGATION --- */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl shadow-black/80 p-1.5 flex items-center gap-2 max-w-sm w-full mx-auto">
          {/* Navigation Tabs */}
          <div className="flex flex-1 justify-around relative">
            {sections.map((section, index) => {
              const isActive = activeSection === index;
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(index)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 w-full ${
                    isActive
                      ? "text-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {/* Sliding Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {section}
                </button>
              );
            })}
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Music Control */}
          <button
            onClick={() => setMusicOn(!musicOn)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group ${
              musicOn
                ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                : "bg-transparent text-neutral-500 hover:text-white hover:bg-white/5"
            }`}
            aria-label={musicOn ? "Pause music" : "Play music"}
          >
            {musicOn ? (
              // Pause Icon
              <div className="flex gap-1 h-3">
                <motion.div
                  animate={{ height: [8, 12, 8] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-1 bg-current rounded-full"
                />
                <motion.div
                  animate={{ height: [12, 6, 12] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  className="w-1 bg-current rounded-full"
                />
                <motion.div
                  animate={{ height: [6, 12, 6] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                  className="w-1 bg-current rounded-full"
                />
              </div>
            ) : (
              // Play Icon (SVG)
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
