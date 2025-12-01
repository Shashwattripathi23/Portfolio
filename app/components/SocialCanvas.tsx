import React, { useState, useEffect, useRef } from "react";
import { Github, Linkedin, Twitter, Mail, Instagram } from "lucide-react";

const SocialCanvas = ({ scrollProgress }: { scrollProgress: number }) => {
const socials = [
  { icon: Github, link: "#", label: "GitHub", color: "#495e33" },    // Very deep, muted olive-drab (Grey/Green)
  { icon: Linkedin, link: "#", label: "LinkedIn", color: "#6b7a5a" },  // Soft, subdued military green (Less saturation)
  { icon: Mail, link: "#", label: "Email", color: "#8b947f" },      // Lightest highlight, still dull (Earthy Gray-Green)
  { icon: Twitter, link: "#", label: "Twitter", color: "#3a472a" },    // Maximum dullness, very dark background tone
  { icon: Instagram, link: "#", label: "Instagram", color: "#a2a899" }, // Subtly lighter, foggy gray-green
];

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const animationRef = useRef(null);
  const [initialJerkApplied, setInitialJerkApplied] = useState(false);

  const [activeDrag, setActiveDrag] = useState(null);
  const [showGoal, setShowGoal] = useState(false);

  const centerX = 40;
  const spacing = 160;

  const [goalColor, setGoalColor] = useState(null);


  

  // initial vertical chain
  const [nodes, setNodes] = useState(
    socials.map((_, i) => ({
      x: centerX,
      y: 50 + i * spacing,
      vx: 0,
      vy: 0,
      targetX: centerX,
      targetY: 50 + i * spacing,
    }))
  );

  // rope simulation settings
  const ropeStrength = 0.14;
  const ropeDamping = 0.9;
  const segmentLength = 140;
  const gravity = 0.55; // 🌟 Gravity added here — tweak 0.1 to 0.25

  // Main physics simulation
  useEffect(() => {
    const simulate = () => {
      setNodes((prev) =>
        prev.map((node, i) => {
          if (dragging === i) return node;

          let { x, y, vx, vy } = node;

          if (i === 0 && dragging !== 0) {
            return {
              ...node,
              x: centerX, // fixed horizontal
              y: 100, // fixed vertical
              vx: 0,
              vy: 0,
            };
          }

          // 🌟 Apply gravity
          vy += gravity;

          // Connect to node above
          if (i > 0) {
            const prevNode = prev[i - 1];
            const dx = prevNode.x - x;
            const dy = prevNode.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const diff = dist - segmentLength;

            vx += (dx / dist) * diff * ropeStrength;
            vy += (dy / dist) * diff * ropeStrength;
          }

          // Connect to node below
          if (i < prev.length - 1) {
            const nextNode = prev[i + 1];
            const dx = nextNode.x - x;
            const dy = nextNode.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const diff = dist - segmentLength;

            vx += (dx / dist) * diff * ropeStrength;
            vy += (dy / dist) * diff * ropeStrength;
          }

          // Damping to prevent infinite bouncing
          vx *= ropeDamping;
          vy *= ropeDamping;

          return {
            ...node,
            x: x + vx,
            y: y + vy,
            vx,
            vy,
          };
        })
      );

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [dragging]);

  //intital jerk

  // Initial Jerk/Wave Effect
useEffect(() => {
  // Check if the component is being translated up (is visible)
  const isComponentVisible = scrollProgress > 1.8; // Use the same threshold as your display logic

  if (isComponentVisible && !initialJerkApplied) {
    setNodes((prevNodes) => {
      // Create a copy to update
      const newNodes = prevNodes.map((node, i) => {
        // Apply an initial, temporary velocity
        let initialVx = 0;
        let initialVy = 0;

        // Apply a wave effect: alternate the horizontal kick
        if (i % 2 === 0) {
          initialVx = 10; // Kick to the right
        } else {
          initialVx = -10; // Kick to the left
        }

        // Apply a vertical kick (optional, but can add to the "drop" feeling)
        initialVy = -5;

        return {
          ...node,
          // Add the impulse to the current velocity
          vx: node.vx + initialVx,
          vy: node.vy + initialVy,
        };
      });
      return newNodes;
    });

    setInitialJerkApplied(true); // Mark as done
  }
}, [scrollProgress, initialJerkApplied]); // Dependencies


useEffect(() => {
    // Reset the initial jerk flag when the component is not visible
    if (scrollProgress <= 1.8 && initialJerkApplied) {
      setInitialJerkApplied(false);
    }
  }
, [scrollProgress, initialJerkApplied]);


// randomly jerk periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) => {
        const newNodes = prevNodes.map((node, i) => {
          // Randomly decide whether to apply a jerk
          if (Math.random() < 0.3) {
            const randomVx = (Math.random() - 0.5) * 10; // Random horizontal velocity
            const randomVy = (Math.random() - 0.5) * 5; // Random vertical velocity
            return {
              ...node,
              vx: node.vx + randomVx,
              vy: node.vy + randomVy,
            };
          }
          return node;
        });
        return newNodes;
      }
      );
    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, []);



  // Draw connections + glow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw rope: each node connects ONLY to previous one
    ctx.lineWidth = 3;

    for (let i = 1; i < nodes.length; i++) {
      const n1 = nodes[i - 1];
      const n2 = nodes[i];

      const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
      gradient.addColorStop(0, socials[i - 1].color + "80");
      gradient.addColorStop(1, socials[i].color + "80");

      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const midX = (n1.x + n2.x) / 2;
      const midY = (n1.y + n2.y) / 2;

      // slight curve (if you want straight line, remove this)
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();

      ctx.stroke();
    }

    // // Glow around nodes
    // nodes.forEach((node, index) => {
    //   const glow = ctx.createRadialGradient(
    //     node.x,
    //     node.y,
    //     0,
    //     node.x,
    //     node.y,
    //     60
    //   );
    //   glow.addColorStop(0, socials[index].color + "40");
    //   glow.addColorStop(1, "transparent");

    //   ctx.fillStyle = glow;
    //   ctx.fillRect(node.x - 60, node.y - 60, 120, 120);
    // });
  }, [nodes]);

  // Dragging logic
  const handleMouseDown = (index) => {
    setDragging(index);
    setActiveDrag(index);
    setShowGoal(true);
  };

  const handleMouseMove = (e) => {
    if (dragging === null) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes((prev) => {
      const newNodes = [...prev];
      newNodes[dragging] = {
        ...newNodes[dragging],
        x,
        y,
        vx: 0,
        vy: 0,
      };
      return newNodes;
    });

    const goal = document.getElementById("goal-circle");
    if (goal) {
      const goalRect = goal.getBoundingClientRect();
      const dx = x - (goalRect.left + goalRect.width / 2);
      const dy = y - (goalRect.top + goalRect.height / 2);

      const dist = Math.sqrt(dx * dx + dy * dy);
      const clientposX = e.clientX;
      const clientposY = e.clientY;

      const distBetween = Math.sqrt(
        (clientposX - (goalRect.left + goalRect.width / 2)) ** 2 +
          (clientposY - (goalRect.top + goalRect.height / 2)) ** 2
      );

      console.log("dist", distBetween);

      // Highlight threshold (adjust as needed)
      if (distBetween < 120) {
        // console.log("dist",dist);
        setGoalColor(socials[dragging].color);
      } else {
        setGoalColor(null);
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setActiveDrag(null);
    setShowGoal(false);

    const rect = containerRef.current.getBoundingClientRect();
    const goal = document.getElementById("goal-circle");
    const goalRect = goal?.getBoundingClientRect();

    if (dragging !== null && goalRect) {
      const x = nodes[dragging].x + rect.left;
      const y = nodes[dragging].y + rect.top;

      if (
        x > goalRect.left &&
        x < goalRect.right &&
        y > goalRect.top &&
        y < goalRect.bottom
      ) {
        window.open(socials[dragging].link, "_blank");
      }
    }

    setDragging(null);
    setActiveDrag(null);
    setShowGoal(false);
  };

  const chainTransform = `translateY(${Math.max(0 ,150 - scrollProgress * 50)}%)`;

  return (
    <div
      style={{
        transform:
          scrollProgress > 1.5 ? chainTransform: "translateY(80%)",
          display: scrollProgress > 1.8 ? "block" : "none",

           
        transition: "transform 0.3s ease-out",
      }}
      className="min-h-screen flex items-center justify-center p-10"
    >
      <div className="max-w-3xl w-full">
        <h3 className="text-3xl opacity-0 font-bold text-white mb-2 text-center">
          Socials
        </h3>
        <p className="text-white/60 text-center mb-6 text-sm">
          {/* Drag the icons — gravity will pull the chain realistically. */}
        </p>

        <div
          ref={containerRef}
          className="relative w-full h-[800px] rounded-2xl bg -white/10"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {showGoal && (
            <div
              id="goal-circle"
              className="absolute left-5 select-none top-1/2 -translate-y-1/2 
             w-48 h-48 rounded-full 
             bg-white/10 backdrop-blur-sm 
             flex items-center justify-center transition z-[5]"
              style={{
                border: `4px solid ${goalColor || "rgba(255,255,255,0.3)"}`,
                boxShadow: goalColor ? `0 0 25px ${goalColor}` : "none",
              }}
            >
              <span className="text-white/60 text-sm select-none">
                Drop Here
              </span>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-screen h-screen pointer-events-none"
          />

          {nodes.map((node, index) => {
            const Icon = socials[index].icon;
            return (
              <div
                key={index}
                onMouseDown={() => handleMouseDown(index)}
                className="absolute w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 
                  flex items-center justify-center transition cursor-grab active:cursor-grabbing shadow-lg"
                style={{
                  left: node.x,
                  top: node.y,
                  transform: "translate(-50%, -50%)",
                  boxShadow: `0 0 30px ${socials[index].color}80`,
                  filter:
                    activeDrag !== null && activeDrag !== index
                      ? "blur(4px) brightness(0.5)"
                      : "none",
                  opacity:
                    activeDrag !== null && activeDrag !== index ? 0.5 : 1,
                  transition:
                    dragging === index ? "none" : "filter 0.3s, opacity 0.3s",
                }}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SocialCanvas;
