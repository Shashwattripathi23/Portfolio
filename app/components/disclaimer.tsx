import React, { useState, useEffect, useCallback } from "react";

const ANIMATION_DURATION_MS = 800;

export default function IntroGate({
  setDisclaimerOn,
  setMusicOn,
}: {
  setDisclaimerOn: React.Dispatch<React.SetStateAction<boolean>>;
  setMusicOn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const checkScreenSize = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [checkScreenSize]);

  const handleSelection = (wantMusic: boolean) => {
    // 1. Start music immediately (Visualizer in page.tsx will pick this up)
    if (wantMusic) setMusicOn(true);

    // 2. Hide the text/buttons immediately so user sees the background/shutters
    setShowOverlay(false);

    // 3. If music is ON, wait 4 seconds. If OFF, minimal delay.
    const startDelay = wantMusic ? 4000 : 100;

    setTimeout(() => {
      // 4. Start the shutter opening animation
      setIsExiting(true);

      // 5. Unmount the disclaimer component after animation
      setTimeout(() => {
        setDisclaimerOn(false);
      }, ANIMATION_DURATION_MS);
    }, startDelay);
  };

  const baseClasses =
    "fixed inset-0 w-full h-full bg-slate-900/10 flex flex-col items-center justify-center transition-transform duration-[800ms] ease-in-out z-[100]";

  const mobileExitClass = isExiting ? "-translate-y-full" : "translate-y-0";

  if (isMobile) {
    return (
      <div
        className={`${baseClasses} lg:hidden ${mobileExitClass}`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div
          className={`text-center p-8 max-w-sm transition-opacity duration-300 ${
            showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* <h1 className="text-3xl font-extrabold text-white mb-4">Welcome</h1> */}
          <p className="text-lg text-slate-300 mb-8">
            This portfolio is best enjoyed with some ambient background music.
            Would you like to turn it on?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSelection(true)}
              className="px-6 py-2 bg-[#184f2e9e] text-white font-semibold rounded-lg shadow-xl hover:bg-indigo-700 transition duration-300"
            >
              Yes
            </button>
            <button
              onClick={() => handleSelection(false)}
              className="px-6 py-2 bg-[rgb(75,85,99,0.6)] text-slate-300 font-semibold rounded-lg shadow-xl hover:bg-slate-600 transition duration-300"
            >
              No, I hate music
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop (Shutter Gate)
  return (
    <>
      {/* Left Shutter */}
      {/* Increased opacity slightly (bg-slate-950) so the visualizer isn't too distracting before shutters open */}
      <div
        className={`fixed left-0 top-0 w-1/2 h-full bg-black/50 hidden lg:block transition-transform duration-[800ms] ease-in-out z-[100] ${
          isExiting ? "-translate-x-full" : "translate-x-0"
        }`}
      ></div>

      {/* Right Shutter */}
      <div
        className={`fixed right-0 top-0 w-1/2 h-full bg-black/50  hidden lg:block transition-transform duration-[800ms] ease-in-out z-[100] ${
          isExiting ? "translate-x-full" : "translate-x-0"
        }`}
      ></div>

      {/* Content Overlay */}
      <div
        className={`fixed inset-0  items-center justify-center p-4 lg:p-0 z-[101] hidden lg:flex transition-opacity duration-500 ${
          showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="text-center px-12 py-16 bg-transparent rounded-2xl  border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.6)] max-w-xl select-none">
          <h1 className="text-5xl font-black text-white tracking-tight mb-5">
            {/* Welcome. */}
          </h1>

          <p className="text-lg text-neutral-300 leading-relaxed max-w-md mx-auto mb-12">
   This portfolio is best enjoyed with some ambient background music.
            Would you like to turn it on?
          </p>

         <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSelection(true)}
              className="px-6 py-2 bg-[#184f2e9e] text-white font-semibold rounded-lg shadow-xl hover:bg-green-700/40 transition duration-300"
            >
              Yes
            </button>
            <button
              onClick={() => handleSelection(false)}
              className="px-6 py-2 bg-[rgb(75,85,99,0.6)] text-slate-300 font-semibold rounded-lg shadow-xl hover:bg-slate-600 transition duration-300"
            >
              No, I hate music
            </button>
          </div>
        </div>
      </div>
    </>
  );
}