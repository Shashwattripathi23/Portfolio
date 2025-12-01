"use client";

import React, { useState, useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

const FocusContextCursor = () => {
  // 1. Refs for performance
  const mouseRef = useRef<MousePosition>({ x: -100, y: -100 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // 2. State for UI
  const [hoverText, setHoverText] = useState<string>("");
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // NEW: State to track mobile device
  const [isMobile, setIsMobile] = useState(true); // Default to true to prevent flash on load

  // 3. MOBILE DETECTION
  useEffect(() => {
    const checkMobile = () => {
      // Check 1: Pointer accuracy (Touch screens are 'coarse', Mice are 'fine')
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
      // Check 2: Screen width fallback (standard mobile breakpoint)
      const isSmallScreen = window.innerWidth < 768;

      setIsMobile(isTouchDevice || isSmallScreen);
    };

    // Run on mount
    checkMobile();

    // Re-check on resize (in case user rotates phone or resizes browser)
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 4. CORE LOGIC: Smart Context Detection
  const checkElementUnderCursor = (x: number, y: number) => {
    // Safety check for server-side or unmounted
    if (typeof window === 'undefined') return;

    const element = document.elementFromPoint(x, y) as HTMLElement;
    if (!element) return;

    // Priority 1: Explicit 'data-cursor-text' override
    const explicitTarget = element.closest("[data-cursor-text]");
    if (explicitTarget) {
      const cursorText = explicitTarget.getAttribute("data-cursor-text") || "";
      setHoverText(cursorText);
      setIsHovering(true);
      return;
    }

    // Priority 2: Semantic Detection
    if (element.closest("a")) {
      setHoverText("LINK");
      setIsHovering(true);
      return;
    }
    if (element.closest("button")) {
      setHoverText("CLICK");
      setIsHovering(true);
      return;
    }
    if (element.closest("input, textarea")) {
      setHoverText("TYPE");
      setIsHovering(true);
      return;
    }
    if (element.tagName.toLowerCase() === "img") {
      setHoverText("VIEW");
      setIsHovering(true);
      return;
    }

    // Priority 3: Check for mailto links
    const linkElement = element.closest('a[href^="mailto:"]');
    if (linkElement) {
      setHoverText("EMAIL");
      setIsHovering(true);
      return;
    }

    // Priority 4: Grab Detection
    if (
      element.closest(".grab") ||
      window.getComputedStyle(element).cursor === "grab"
    ) {
      setHoverText("GRAB");
      setIsHovering(true);
      return;
    }

    // Priority 5: Generic Interactive
    if (element.closest(".interactive")) {
      setHoverText("");
      setIsHovering(true);
      return;
    }

    // Default
    setHoverText("");
    setIsHovering(false);
  };

  useEffect(() => {
    // If we are on mobile, do not attach listeners
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      if (!isScrolling) {
        checkElementUnderCursor(e.clientX, e.clientY);
      }
    };

    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
        if (mouseRef.current.x !== -100) {
          checkElementUnderCursor(mouseRef.current.x, mouseRef.current.y);
        }
      }, 150);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [isVisible, isScrolling, isMobile]); // Added isMobile to dependency array

  // Specific States
  const isDrag = hoverText.toLowerCase() === "drag";
  const isGrab = hoverText.toLowerCase() === "grab";

  // PERFORMANCE: If on mobile, render nothing. 
  // This removes the DOM nodes and prevents the styles below from injecting.
  if (isMobile || !isVisible) return null;

  return (
    <>
      <style jsx global>{`
        body,
        a,
        button,
        input,
        textarea,
        label,
        [role="button"],
        .interactive,
        .grab,
        [data-cursor-text] {
          cursor: auto !important;
        }
      `}</style>

      {/* LAYER 1: The "Torch" (Focus) */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen will-change-transform"
        style={{ transform: "translate(-100px, -100px)" }}
      >
        <div
          className={`
            w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full 
            transition-all duration-300 ease-out
            ${
              isScrolling
                ? "scale-75 opacity-50"
                : isHovering
                ? "scale-110 bg-cyan-400/15"
                : "scale-100 bg-white/10"
            }
          `}
          style={{
            background: `radial-gradient(circle, ${
              isHovering ? "rgba(34, 211, 238, 0.12)" : "rgba(255,255,255,0.06)"
            } 0%, rgba(0,0,0,0) 60%)`,
          }}
        />
      </div>

      {/* LAYER 2: The Context (Dot / Pill) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center will-change-transform"
        style={{ transform: "translate(-100px, -100px)" }}
      >
        <div
          className={`
            bg-white text-black flex items-center justify-center rounded-full overflow-hidden
            transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${
              isScrolling
                ? "scale-50 opacity-50"
                : isHovering
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0"
            } 
            ${
              isHovering && hoverText
                ? isDrag || isGrab
                  ? "h-10 px-5"
                  : "h-8 px-4 py-1"
                : "w-3 h-3"
            }
          `}
          style={{
            marginTop:
              isHovering && hoverText
                ? isDrag || isGrab
                  ? "-20px"
                  : "-16px"
                : "-6px",
            marginLeft: isHovering && hoverText ? "-50%" : "-6px",
          }}
        >
          {isHovering && hoverText && !isScrolling && (
            <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
              {isDrag ? (
                <>
                  <span className="animate-pulse">&larr;</span>
                  <span>DRAG</span>
                  <span className="animate-pulse">&rarr;</span>
                </>
              ) : isGrab ? (
                <>
                  {/* Hand Icon */}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                    />
                  </svg>
                  <span>GRAB</span>
                </>
              ) : (
                hoverText
              )}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default FocusContextCursor;