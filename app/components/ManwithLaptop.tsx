"use client";
import { useEffect, useState } from "react";

export default function ManWithLaptop() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Calculate eye movement
  const calc = (axis: "x" | "y", offset: number) =>
    axis === "x"
      ? (pos.x - offset) / 150
      : (pos.y - offset) / 150;

  return (
    <div className="fixed bottom-0 left-0 w-[280px] h-[280px] pointer-events-none select-none">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bean Bag */}
        <ellipse
          cx="200"
          cy="330"
          rx="160"
          ry="70"
          fill="#5f3dc4"
        />

        {/* Body */}
        <path
          d="M150 240 Q200 180 250 240 L260 310 Q200 340 140 310 Z"
          fill="#222"
        />

        {/* Laptop */}
        <rect x="150" y="250" width="120" height="70" rx="10" fill="#ddd" />
        <rect x="160" y="260" width="100" height="50" fill="#fff" />

        {/* Head */}
        <g
          style={{
            transform: `translate(${calc("x", 200)}px, ${calc("y", 100)}px)`
          }}
        >
          <circle cx="200" cy="120" r="45" fill="#ffddb0" />

          {/* Eyes */}
          <circle cx={185 + calc("x", 200) * 2} cy={115 + calc("y", 100) * 2} r="7" fill="#000" />
          <circle cx={215 + calc("x", 200) * 2} cy={115 + calc("y", 100) * 2} r="7" fill="#000" />

          {/* Mouth */}
          <path
            d="M185 140 Q200 150 215 140"
            stroke="#000"
            strokeWidth="3"
            fill="transparent"
          />
        </g>
      </svg>
    </div>
  );
}
