"use client";

import { useState, useEffect } from "react";
import ProjectDetail from "./components/ProjectDetail";
import Combined from "./components/comnined_page";
import MobileLayout from "./components/MobileLayout";
import Navbar from "./components/Navbar";
import FocusContextCursor from "./components/Cursor";
import HooligangVisualizer from "./components/songplayer";
import Disclaimer from "./components/disclaimer";

interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  images: string[];
  thumbnail: string;
  tags: string[];
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [disclaimerOn, setDisclaimerOn] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects);
        console.log("Loaded projects:", data.projects);
      })
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const handleProjectsClick = () => {
    // Handle project navigation
  };

  return (
    <div className="h-screen bg- overflow-hidden cursor-none">
      <HooligangVisualizer musicOn={musicOn} setMusicOn={setMusicOn} />

      <FocusContextCursor />

      {/* 2. DISCLAIMER OVERLAY */}
      {disclaimerOn && (
        <Disclaimer setDisclaimerOn={setDisclaimerOn} setMusicOn={setMusicOn} />
      )}

      {/* 3. MAIN CONTENT (Hidden until disclaimer is done) */}
      {!disclaimerOn && (
        <>
          {isMobile ? (
            <>
              {/* Removed HooligangVisualizer from here to prevent delayed mounting */}
              <MobileLayout
                projects={projects}
                onProjectClick={handleProjectClick}
                musicOn={musicOn}
                setMusicOn={setMusicOn}
              />
            </>
          ) : (
            <>
              <Navbar
                scrollProgres={scrollProgress}
                setScrollIndex={setScrollProgress}
                musicOn={musicOn}
                setMusicOn={setMusicOn}
              />
              <Combined
                projects={projects}
                onProjectClick={handleProjectClick}
                onProjectsClick={handleProjectsClick}
                scrollProgres={scrollProgress}
                onScrollToSection={setScrollProgress}
              />
            </>
          )}

          <ProjectDetail
            project={selectedProject}
            onClose={handleCloseProject}
          />
        </>
      )}
    </div>
  );
}
