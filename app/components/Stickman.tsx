import { useEffect, useRef } from "react";

export default function InteractiveStickman() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Physics Constants ---
    const GRAVITY = 0.5;
    const FRICTION = 0.99;
    const GROUND_Y = 580; // Lowered ground slightly
    const BOUNCE = 0.5;
    const ITERATIONS = 5;

    // --- State ---
    let animationId: number;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let time = 0;

    let isDragging = false;
    let dragPoint: Point | null = null;
    let lastMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    // --- Classes ---

    class Point {
      x: number;
      y: number;
      px: number;
      py: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.px = x;
        this.py = y;
      }

      update() {
        if (isDragging && this === dragPoint) {
          this.x = lastMousePos.x;
          this.y = lastMousePos.y;
          this.px = this.x - dragVelocity.x;
          this.py = this.y - dragVelocity.y;
          return;
        }

        const vx = (this.x - this.px) * FRICTION;
        const vy = (this.y - this.py) * FRICTION;

        this.px = this.x;
        this.py = this.y;

        this.x += vx;
        this.y += vy + GRAVITY;
      }

      constrain(canvasWidth: number) {
        if (this.y > GROUND_Y) {
          this.y = GROUND_Y;
          const vx = this.x - this.px;
          this.px = this.x - vx * 0.8;
        }
        if (this.x < 0) {
          this.x = 0;
          this.px = this.x + (this.x - this.px) * BOUNCE;
        }
        if (this.x > canvasWidth) {
          this.x = canvasWidth;
          this.px = this.x + (this.x - this.px) * BOUNCE;
        }
      }
    }

    class Stick {
      p1: Point;
      p2: Point;
      length: number;
      visible: boolean;

      constructor(p1: Point, p2: Point, visible = true) {
        this.p1 = p1;
        this.p2 = p2;
        this.visible = visible;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        this.length = Math.sqrt(dx * dx + dy * dy);
      }

      update() {
        const dx = this.p2.x - this.p1.x;
        const dy = this.p2.y - this.p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist === 0) return;

        const diff = this.length - dist;
        const percent = diff / dist / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        this.p1.x -= offsetX;
        this.p1.y -= offsetY;
        this.p2.x += offsetX;
        this.p2.y += offsetY;
      }
    }

    // --- Setup Ragdoll ---
    // Moved startY higher to fit the bigger body
    const startX = 400;
    const startY = 250;

    // Scale factor applied to offsets (approx 1.5x larger)
    const HEAD_OFF = 75;
    const WAIST_OFF = 90;
    const HIPS_OFF = 135;
    const SHOULDER_X = 30;
    const SHOULDER_Y = 15;
    const ARM_LEN = 60; // elbow offset
    const HAND_LEN = 105; // hand y offset relative to start
    const HAND_X = 75;
    const LEG_X = 25;
    const KNEE_Y = 225;
    const FOOT_Y = 315;

    const head = new Point(startX, startY - HEAD_OFF);
    const neck = new Point(startX, startY);
    const waist = new Point(startX, startY + WAIST_OFF);
    const hips = new Point(startX, startY + HIPS_OFF);

    const lShoulder = new Point(startX - SHOULDER_X, startY + SHOULDER_Y);
    const rShoulder = new Point(startX + SHOULDER_X, startY + SHOULDER_Y);

    const lElbow = new Point(startX - 60, startY + 60);
    const rElbow = new Point(startX + 60, startY + 60);
    const lHand = new Point(startX - HAND_X, startY + HAND_LEN);
    const rHand = new Point(startX + HAND_X, startY + HAND_LEN);

    const lHip = new Point(startX - LEG_X, startY + HIPS_OFF);
    const rHip = new Point(startX + LEG_X, startY + HIPS_OFF);

    const lKnee = new Point(startX - 30, startY + KNEE_Y);
    const rKnee = new Point(startX + 30, startY + KNEE_Y);
    const lFoot = new Point(startX - 30, startY + FOOT_Y);
    const rFoot = new Point(startX + 30, startY + FOOT_Y);

    const points = [
      head,
      neck,
      waist,
      hips,
      lShoulder,
      rShoulder,
      lElbow,
      rElbow,
      lHand,
      rHand,
      lHip,
      rHip,
      lKnee,
      rKnee,
      lFoot,
      rFoot,
    ];

    const sticks = [
      // Visible Skeleton
      new Stick(head, neck),
      new Stick(neck, waist),
      new Stick(waist, hips),
      new Stick(neck, lShoulder),
      new Stick(neck, rShoulder),
      new Stick(lShoulder, lElbow),
      new Stick(lElbow, lHand),
      new Stick(rShoulder, rElbow),
      new Stick(rElbow, rHand),
      new Stick(hips, lHip),
      new Stick(hips, rHip),
      new Stick(lHip, lKnee),
      new Stick(lKnee, lFoot),
      new Stick(rHip, rKnee),
      new Stick(rKnee, rFoot),

      // INVISIBLE Structural Supports (Prevents bending/jitter)
      new Stick(lShoulder, waist, false),
      new Stick(rShoulder, waist, false),
      new Stick(lHip, rHip, false),
      new Stick(lShoulder, rShoulder, false),
      new Stick(head, waist, false),
    ];

    let messageIndex = 0;
    let lastMessageTime = 0;
    const MESSAGE_INTERVAL = 4000;
    let bubbleOpacity = 0; // <--- ADD THIS (Fixes the reference error)

    // Helper: Pulls a point smoothly towards a target
    const pullTowards = (
      p: Point,
      targetX: number,
      targetY: number,
      strength: number
    ) => {
      p.x += (targetX - p.x) * strength;
      p.y += (targetY - p.y) * strength;
    };

    // --- Animation Logic (Posture Only) ---
    const applyPosture = () => {
      // If we are being dragged or moving fast, disable posture
      const speed = Math.abs(hips.x - hips.px) + Math.abs(hips.y - hips.py);
      if (isDragging || speed > 10 || hips.y < GROUND_Y - 150) return;

      // Anti-Jitter: Apply heavy damping when idle
      points.forEach((p) => {
        p.px = p.x + (p.px - p.x) * 0.6;
      });

      // Target height (slightly crouched is more stable than fully extended)
      // Adjusted for larger scale
      const standHeight = GROUND_Y - 160;

      //0. move hands upward slightly

      pullTowards(lHand, hips.x - 50, hips.y + 20, 0.05);
      pullTowards(rHand, hips.x + 50, hips.y + 20, 0.05);

      // 1. Core Stability
      pullTowards(hips, hips.x, standHeight, 0.1);

      // Align Head directly above hips
      pullTowards(head, hips.x, standHeight - 110, 0.1);

      // Align Torso
      pullTowards(waist, hips.x, standHeight - 45, 0.1);

      // 2. Plant Feet
      pullTowards(lFoot, hips.x - 30, GROUND_Y, 0.2);
      pullTowards(rFoot, hips.x + 30, GROUND_Y, 0.2);

      // 3. Relax Arms
      pullTowards(lHand, hips.x - 50, hips.y + 30, 0.05);
      pullTowards(rHand, hips.x + 50, hips.y + 30, 0.05);
    };

    // --- Main Loop ---
    const loop = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Apply Posture Forces (Muscles)
      applyPosture();

      // 2. Physics Update
      points.forEach((p) => {
        p.update();
        p.constrain(canvas.width);
      });

      // 3. Stick Constraints (Run multiple times for stiffness)
      for (let i = 0; i < ITERATIONS; i++) {
        sticks.forEach((s) => s.update());
      }

      // 4. Render
      // Floor
      ctx.fillStyle = "#222"; // Gray-700
      ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

      // walls
      ctx.fillStyle = "#111"; // Darker walls
      ctx.fillRect(0, 0, 5, GROUND_Y);
      ctx.fillRect(canvas.width - 5, 0, 5, GROUND_Y);

      // Background buildings
      // ctx.fillStyle = "#333";
      // for (let i = 0; i < 5; i++) {
      //   const buildingWidth = 80 + (i % 3) * 40;
      //   const buildingHeight = 100 + ((i * 50) % 200);
      //   ctx.fillRect(i * 160 + 50, GROUND_Y - buildingHeight, buildingWidth, buildingHeight);
      // }

      // random message bubbles
      // infinit loop of random messages near the stickman , syau for 4 seconds
      const idleMessages = [
        // 🔥 Badass Pop-Culture Energy
        "I am the one who draws.",
        "If you think this has a happy ending, you haven’t been paying attention.",

        "Say my name… render it.",
        "You’re not watching the code… the code is watching you.",
        "I didn’t break the system. I became it.",
        "Every frame is earned.",

        "I am not a bug. I am the feature.",
        "The canvas remembers.",
        "Kings fall. I fall harder.",
        "I don’t wait for events. I trigger them.",
      ];

      const dragMessages = [
        "Hey—hands off the merchandise 😤",
        "Whoa whoa, personal space!",
        "Easy tiger, I’m not a resize handle!",
        "You drag, I dominate.",
        "Careful! I’m fragile… emotionally.",
        "Physics?! Really bro?!",
        "This is technically kidnapping.",
        "I consent to motion, not chaos!",
        "Weeeee—okay that’s enough.",
        "Sir, this is a professional canvas.",
        "I was born to run, not to be dragged.",
        "Your mouse has anger issues.",
        "At least buy me dinner first.",
        "This violates at least 3 UI laws.",
        "Dragged but never defeated.",
      ];

      function drawSpeechBubble(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        text: string
      ) {
        if (bubbleOpacity <= 0.01) return; // Don't draw if invisible

        ctx.save(); // Save context to handle opacity safely
        ctx.globalAlpha = bubbleOpacity; // Apply the fade effect

        const paddingX = 16;
        const paddingY = 8;
        const fontSize = 20;
        ctx.font = `600 ${fontSize}px sans-serif`; // Clean, bold font

        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const bubbleWidth = textWidth + paddingX * 2;
        const bubbleHeight = fontSize + paddingY * 2;

        // Position above head
        const bubbleX = x - bubbleWidth / 2;
        const bubbleY = y - 80;
        const radius = 8; // Rounded corners

        // --- Minimalist Bubble Background ---
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, radius);
        ctx.fillStyle = "rgba(20, 20, 20, 0.9)"; // Dark, slightly transparent
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; // Subtle white border
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // --- Simple Triangle Tail ---
        ctx.beginPath();
        ctx.moveTo(x - 6, bubbleY + bubbleHeight);
        ctx.lineTo(x, bubbleY + bubbleHeight + 6);
        ctx.lineTo(x + 6, bubbleY + bubbleHeight);
        ctx.fillStyle = "rgba(20, 20, 20, 0.9)";
        ctx.fill();

        // --- Text ---
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "top";
        ctx.fillText(text, bubbleX + paddingX, bubbleY + paddingY);

        ctx.restore(); // Restore context so stickman doesn't become transparent
      }

      const now = performance.now();
      const activeMessages = isDragging ? dragMessages : idleMessages;
      const currentMessage = activeMessages[messageIndex];

      // Smooth Fade In Animation
      if (bubbleOpacity < 1) {
        bubbleOpacity += 0.05; // Adjust speed of fade in
      }

      drawSpeechBubble(ctx, head.x, head.y, currentMessage);

      // Check time to switch message
      if (now - lastMessageTime > MESSAGE_INTERVAL) {
        messageIndex = (messageIndex + 1) % activeMessages.length;
        lastMessageTime = now;
        bubbleOpacity = 0; // Reset opacity to trigger fade in for next message
      }

      // Shadow
      if (hips.y > GROUND_Y - 200) {
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.ellipse(hips.x, GROUND_Y + 10, 60, 15, 0, 0, Math.PI * 2); // Bigger shadow
        ctx.fill();
      }

      // Sticks
      ctx.lineWidth = 9; // Thicker lines
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      sticks.forEach((s) => {
        if (!s.visible) return;
        ctx.strokeStyle = isDragging ? "#fb7185" : "white";
        ctx.beginPath();
        ctx.moveTo(s.p1.x, s.p1.y);
        ctx.lineTo(s.p2.x, s.p2.y);
        ctx.stroke();
      });

      // Head
      ctx.fillStyle = isDragging ? "#fb7185" : "white";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 24, 0, Math.PI * 2); // Bigger head
      ctx.fill();

      animationId = requestAnimationFrame(loop);
    };

    // --- Input Handling ---

    const getScaledPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const handleStart = (x: number, y: number) => {
      lastMousePos = { x, y };
      let minDist = 1000;
      let closest: Point | null = null;

      points.forEach((p) => {
        const d = (p.x - x) ** 2 + (p.y - y) ** 2;
        if (d < 8000 && d < minDist) {
          // Even bigger click radius
          minDist = d;
          closest = p;
        }
      });

      if (closest) {
        dragPoint = closest;
        isDragging = true;
      }
    };

    const handleMove = (x: number, y: number) => {
      dragVelocity = { x: x - lastMousePos.x, y: y - lastMousePos.y };
      lastMousePos = { x, y };
    };

    const handleEnd = () => {
      if (dragPoint && isDragging) {
        const forceMult = 1.5;
        points.forEach((p) => {
          p.px -= dragVelocity.x * forceMult;
          p.py -= dragVelocity.y * forceMult;
        });
      }
      isDragging = false;
      dragPoint = null;
    };

    canvas.onpointerdown = (e) => {
      const pos = getScaledPos(e);
      handleStart(pos.x, pos.y);
      canvas.setPointerCapture(e.pointerId);
    };
    canvas.onpointermove = (e) => {
      const pos = getScaledPos(e);
      handleMove(pos.x, pos.y);
    };
    canvas.onpointerup = (e) => {
      handleEnd();
      canvas.releasePointerCapture(e.pointerId);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.onpointerdown = null;
      canvas.onpointermove = null;
      canvas.onpointerup = null;
    };
  }, []);

  return (
    <div className="w-full h-[90%] mt-14 min-h-[600px] z-40 bg--900 flex flex-col items-center justify-center p-4">
      {/* Increased max-width to 6xl for a larger frame */}
      <div className="bg--800 p-4 rounded-xl shadow-2xl border-slate-700 w-full max-w-6xl  items-center self-center">
        <h1
          className=" text-center "
          onClick={() => {
            console.log("Clicked");
          }}
        >
          {/* Interact{" "} */}
        </h1>
        <div className="relative w-full" style={{ paddingBottom: "75%" }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="absolute top-0 left-0 w-full h-full bg--950 rounded-lg shadow-inner cursor-grab active:cursor-grabbing touch-none"
          />
        </div>
      </div>
    </div>
  );
}
