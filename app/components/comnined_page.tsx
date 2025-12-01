"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ProjectCarousel from "./ProjectCarousel";
import ProjectImageCarousel from "./ProjectImageCarousel";
import SocialCanvas from "./SocialCanvas";
import { Github, Linkedin, Twitter, Mail, Instagram } from "lucide-react";
import ManWithLaptop from "./ManwithLaptop";
import ProceduralMan3D from "./ProceduralMan3D";
import StickmanRagdoll from "./Stickman";
interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  images: string[];
  thumbnail: string;
  tags: string[];
}

interface combinedProps {
  onProjectsClick: () => void;
  projects: Project[];
  onProjectClick: (project: Project) => void;
  scrollProgres: number;
  onScrollToSection: (section: number) => void;
}

export default function Combined({
  onProjectsClick,
  projects,
  onProjectClick,
  onScrollToSection,
  scrollProgres,
}: combinedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetailOpen, setProjectDetailOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(scrollProgres || 0);

  // Sync internal state with prop
  useEffect(() => {
    if (scrollProgres !== undefined) {
      setScrollProgress(scrollProgres);
    }
  }, [scrollProgres]);

  const onClose = () => {
    setSelectedProject(null);
    setProjectDetailOpen(false);
  };

  const techStack = [
    "React",
    "TypeScript",
    "Node.js",
    "Next.js",
    "Tailwind CSS",
    "MongoDB",
    "Express",
    "Git",
    "JavaScript",
    "Python",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Figma",
    "Redux",
  ];

  const socialss = [
    { icon: Github, label: "GitHub", link: "#" },
    { icon: Linkedin, label: "LinkedIn", link: "#" },
    { icon: Twitter, label: "Twitter", link: "#" },
    { icon: Mail, label: "Email", link: "#" },
  ];

  const sectionCount = 4; // home, projects, about, contact
  const currentSection = Math.round(scrollProgress);

  // Navigation function for smooth scrolling
  const scrollToSection = (targetSection: number) => {
    setScrollProgress(targetSection);
    if (onScrollToSection) {
      onScrollToSection(targetSection);
    }
  };

  useEffect(() => {
    if (projectDetailOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [projectDetailOpen]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (projectDetailOpen) return;

      e.preventDefault();

      setScrollProgress((prev) => {
        const newProgress = Math.max(
          0,
          Math.min(sectionCount - 1, prev + e.deltaY * 0.002)
        );

        console.log("Scroll Progress:", newProgress);
        return newProgress;
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [projectDetailOpen]); // scrollProgress removed

  const blueBoxTransform = `translateY(-${scrollProgress * 120}%)`;
  const redBoxTransform = `translateX(${scrollProgress * 120}%)`;

  const yellowBoxBorderRadius = `${scrollProgress * 24}px`;

  // Yellow box stays in relative flow and scales up in place
  const yellowBoxScale = 1 + scrollProgress * 0.8;
  const yellowBoxOpacity = 1;
  const motions = Math.min(scrollProgress, 1);

  const yellowBoxTransform = `
  translateY(-${motions * 30}%)
  translateX(${motions * 30}%)
`;

  const yellowBoxTransformProjectOpen = ` translateX(-15%) translateY(-${
    scrollProgress * 65
  }%)`;

  const yellowboxMoreTransform = ` translateY(-${scrollProgress * 30}%)
   translateX(${scrollProgress * 30}%) scaleX(${
    1 - scrollProgress / 2
  }) scaleY(${1 - scrollProgress / 2})`;

  const handleProjectClick = (project: Project) => {
    if (scrollProgress > 0.5) {
      setSelectedProject(project);
      setProjectDetailOpen(true);
    } else {
      // Hero state - just scroll to project section
      setScrollProgress(1.0);
      if (onScrollToSection) {
        onScrollToSection(1.0);
      }
    }
  };

  const aboutMeTransform = `translateX(${Math.min(
    0,
    scrollProgress * 50 - 150
  )}%)`;

  const techStackTransform = `translateX(${Math.min(
    0,
    scrollProgress * 50 - 150
  )}%)`;

  return (
    <div
      ref={containerRef}
      className=" bg-transparent flex items-center justify-center z-2 "
    >
      <div className="min-h-[95vh] py-10 w-11/12 flex flex-row px-8 text-center bg-transparent relative overflow-hidden">
        <div className="h-flex-1 bg-transparent w-2/3 border-gray-300 flex flex-col relative">
          <div
            style={{ transform: blueBoxTransform }}
            className="bg-transparent-500 h-1/2 p-12 flex flex-col mt-14 justify-center transition-transform duration-700 ease-out"
          >
            <h2 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-white/70 to-white/40 mb-2 text-left font-roboto">
              Hello,
            </h2>
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600 mb-8 text-left font-roboto">
              I am Shashwat
            </h1>
            <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-white/80 via-white/60 to-white/30 mb-6 text-left font-roboto">
              I build stuff for web and mobile.
            </p>
          </div>

          <div
            style={{
              transform: projectDetailOpen
                ? yellowBoxTransformProjectOpen
                : scrollProgress > 1.5
                ? yellowboxMoreTransform
                : yellowBoxTransform,
              borderRadius: yellowBoxBorderRadius,
              transformOrigin: "center center",
              zIndex: 20,
              display: scrollProgress > 2 ? "none" : "block",
              height:
                scrollProgress > 0.5
                  ? projectDetailOpen
                    ? "50%"
                    : `${1105 + (scrollProgress - 0.5) * 100}%`
                  : "50%",
            }}
            className="bg- -500 p-6  transition-all duration-700 ease-out"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white text-left">
                {projectDetailOpen ? "" : "Selected Works"}
              </h3>
            </div>
            <div className="h-full  w-full">
              <ProjectCarousel
                projects={projects}
                onProjectClick={handleProjectClick}
                state={
                  scrollProgress > 0.5
                    ? projectDetailOpen
                      ? "collapse"
                      : "expand"
                    : "hero"
                }
              />
            </div>
          </div>
        </div>

        {selectedProject && scrollProgress > 0.5 ? (
          <div
            className="w-1/2 h-[900px]  rounded-xl bg-black/40 flex justify-between transition-all duration-700 ease-out border-white/10 rounded-b-lg relative shadow-white"
            style={{ pointerEvents: "auto" }}
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div
              className="min-h-full border-amber-50 p-8 space-y-8"
              style={{ pointerEvents: "auto" }}
            >
              {/* Close button */}
               <button

                onClick={onClose}

                data-cursor-text="CLOSE"

                className="absolute top-8 right-8 w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all border border-white/10 hover:border-white/20 group z-50"

              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="group-hover:rotate-90 transition-transform duration-300"
                >
                  <path
                    d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Header section */}
              <div className="mt-14">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/20 font-bold uppercase text leading-tight">
                      {selectedProject.name}
                    </h1>
                  </div>
                </div>

                {/* Tech stack pills */}
                {/* {selectedProject.tech && selectedProject.tech.length > 0 && (
                    // <div className="flex flex-wrap gap-2">
                    //   {selectedProject.tech.map((tech, index) => (
                    //     <span
                    //       key={index}
                    //       className="px-3 py-1.5 bg-white/5 text-white/70 rounded-lg text-sm font-medium border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                    //     >
                    //       {tech}
                    //     </span>
                    //   ))}
                    // </div>
                  )} */}
              </div>

              {/* <div className="h-10 bg-transparent from-transparent via-white/10 to-transparent" /> */}

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-sm uppercase tracking-wider text-white/40 font-semibold">
                  Project Brief
                </h2>
                
                <p className="text-lg  md:text-xl text-white/80 font-light leading-relaxed max-w-prose">
                  {selectedProject.description}
                </p> 
              </div>
              {/* Tags */}
              <div className="flex items-center flex-row justify-center gap-2">
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 -4">
                    {selectedProject.tags.map((tag, index) => (
                    <span className="px-3 py-1 bg-white/[0.03] text-white/60 text-xs font-mono uppercase tracking-widest border border-white/10 rounded-md">

                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* <div className="h-10 bg-transparent from-transparent via-white/10 to-transparent" /> */}

              {/* Action buttons */}
              <div className="flex justify-center z-9999 gap-4">
                <button
                  style={{ pointerEvents: "auto" }}
                  onClick={() => window.open(selectedProject.url, "_blank")}
                  data-cursor-text="DEMO"
                  className="group z-50 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-white/50  text-black rounded-xl transition-all font-medium shadow-lg shadow-white/25 hover:shadow-green-500/40 hover:scale-105"
                >
                  <span>View Live Demo</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      d="M4 10H16M16 10L11 5M16 10L11 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  data-cursor-text="CODE"
                  className="inline-flex group z-50 hover:scale-105 cursor-pointer items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium border border-white/10 hover:border-white/20"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2C5.58 2 2 5.58 2 10C2 13.54 4.29 16.53 7.47 17.59C7.87 17.66 8.02 17.42 8.02 17.21C8.02 17.02 8.01 16.39 8.01 15.72C6 16.09 5.48 15.21 5.32 14.78C5.23 14.56 4.84 13.84 4.5 13.65C4.22 13.5 3.82 13.13 4.49 13.12C5.12 13.11 5.57 13.7 5.72 13.94C6.44 15.15 7.59 14.81 8.05 14.6C8.12 14.08 8.33 13.73 8.56 13.53C6.84 13.33 5.04 12.65 5.04 9.53C5.04 8.62 5.23 7.87 5.74 7.29C5.66 7.09 5.38 6.3 5.82 5.21C5.82 5.21 6.49 5 8.02 6.08C8.66 5.91 9.34 5.82 10.02 5.82C10.7 5.82 11.38 5.91 12.02 6.08C13.55 4.99 14.22 5.21 14.22 5.21C14.66 6.3 14.38 7.09 14.3 7.29C14.81 7.87 15 8.61 15 9.53C15 12.66 13.19 13.33 11.47 13.53C11.76 13.78 12.01 14.26 12.01 15.01C12.01 16.08 12 16.94 12 17.21C12 17.42 12.15 17.67 12.55 17.59C15.71 16.53 18 13.53 18 10C18 5.58 14.42 2 10 2Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>View Code</span>
                </button>
              </div>

              {/* Divider */}
              {/* <div className="h-14 bg-transparent from-transparent via-white/10 to-transparent" /> */}

              {/* Image Carousel Section */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="">
                  <h2 className="text-sm uppercase tracking-wider text-white/40 font-semibold">
                    Gallery
                  </h2>
                  <div className="h-[400px] rounded-2xl  mx-10 mt-10  border overflow-hidden bg-transparent  border-white/10">
                    <ProjectImageCarousel
                      images={selectedProject.images}
                      projectName={selectedProject.name}
                    />
                  </div>
                </div>
              )}

              {/* Bottom spacing */}
              <div className="h-32" />
            </div>
          </div>
        ) : (
          <div
            style={{ transform: redBoxTransform, zIndex: 30 }}
            className="flex-1 bg- linear-to-br from-red-950 via-red-900 to-red-950 w-1/3 transition-transform duration-700 ease-out relative"
          >
            {/* <ProceduralMan3D /> */}
            <StickmanRagdoll />

            {/* Subtle texture overlay */}
          </div>
        )}
      </div>

      {/* Purple box About me */}
      <div
        className="bg-transparent h-[95vh] w-[90vw] absolute px-14 my-auto rounded-3xl border-purple-400/20"
        style={{ zIndex: 2 }}
      >
        <div className="relative bg-transparent w-full h-full flex items-center justify-center ">
          <div className="w-full  flex gap-16 items-center">
            {/* Left Side - About Me Content */}
            <div className="flex-1 space-y-14">
              {/* Heading + About Section */}
              <div
                style={{
                  transform:
                    scrollProgress > 1.5
                      ? aboutMeTransform
                      : "translateX(-100%)",
                  transition: "transform 0.8s ease-out",
                  display: scrollProgress > 1.5 ? "block" : "none",
                }}
                className="space-y-6"
              >
                <div className="glow"></div>
                <div className="container">
                  <h1 className="name">Shashwat Tripathi</h1>
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
                    .
                  </p>
                </div>
              </div>

              {/* Tech Stack Section */}
              <div
                className="space-y-6"
                style={{
                  transform:
                    scrollProgress > 2.9
                      ? techStackTransform
                      : "translateX(-100%)",
                  transition: "transform 0.8s ease-out",

                  display: scrollProgress > 1.5 ? "block" : "none",
                }}
              >
                <h3 className="text-3xl font-bold text-white/95">
                  Tech Stack & Skills
                </h3>

                <div className="flex flex-wrap gap-5 max-w-4xl">
                  {techStack.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.06 }}
                      className="px-6 py-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10
                     shadow-md hover:shadow-xl transition-all duration-300 
                     hover:bg-white/20 hover:border-purple-300/50 hover:-translate-y-1 
                     cursor-default"
                    >
                      <span className="text-white text-base font-semibold">
                        {tech}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Social Links */}
            <SocialCanvas scrollProgress={scrollProgress} />
          </div>
        </div>
      </div>
    </div>
  );
}
