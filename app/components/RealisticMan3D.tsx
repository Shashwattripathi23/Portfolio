"use client";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/**
 * Props:
 *  - modelUrl: string -> path to your .glb or .gltf model (realistic man sitting with separate head & eyes)
 *  - scale, position tweaks available
 *
 * Usage:
 * <RealisticMan3D modelUrl="/models/real_man.glb" />
 *
 * Notes:
 *  - Model should have named nodes: Head, LeftEye, RightEye (adjust names in code if different)
 *  - The component places the canvas bottom-right and uses pointer tracking to control head/eyes.
 */

function useMouseTracker() {
  // global mouse normalized [-1, 1]
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1); // invert y for threejs
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return mouse;
}

function HeadAndEyesController({ model, headName = "Head", leftEyeName = "LeftEye", rightEyeName = "RightEye" }: {
  model: THREE.Group | null;
  headName?: string;
  leftEyeName?: string;
  rightEyeName?: string;
}) {
  const mouse = useMouseTracker();
  const headRef = useRef<THREE.Object3D | null>(null);
  const leftEyeRef = useRef<THREE.Object3D | null>(null);
  const rightEyeRef = useRef<THREE.Object3D | null>(null);
  const lookTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!model) return;
    headRef.current = model.getObjectByName(headName) ?? null;
    leftEyeRef.current = model.getObjectByName(leftEyeName) ?? null;
    rightEyeRef.current = model.getObjectByName(rightEyeName) ?? null;
  }, [model, headName, leftEyeName, rightEyeName]);

  // idle breathing (slight up/down)
  const breathOffset = useRef(0);

  useFrame((state, delta) => {
    breathOffset.current += delta * 0.5;
    const breathY = Math.sin(breathOffset.current) * 0.02; // small vertical movement

    if (headRef.current) {
      // map mouse normalized to small world coordinates depending on camera
      const mx = mouse.current.x * 0.35; // horizontal sensitivity
      const my = mouse.current.y * 0.15; // vertical sensitivity

      // target is slightly in front of character's head
      lookTarget.current.set(mx, my + 0.05 + breathY, 1);

      // compute vector from head to target in head local space
      const headWorldPos = new THREE.Vector3();
      headRef.current.getWorldPosition(headWorldPos);

      // Convert normalized mouse (screen space) to world space ray cast in front of camera:
      // For simplicity, treat lookTarget as relative offset in head space (works fine for subtle turns)
      // Compute desired quaternion for head to look toward the lookTarget
      const targetWorld = new THREE.Vector3(
        headWorldPos.x + lookTarget.current.x,
        headWorldPos.y + lookTarget.current.y,
        headWorldPos.z + lookTarget.current.z
      );

      // head lookAt with smoothing
      const q = new THREE.Quaternion();
      headRef.current.parent!.updateWorldMatrix(true, false);
      headRef.current.lookAt(targetWorld);
      q.copy(headRef.current.quaternion);

      // smooth interpolate quaternion
      headRef.current.quaternion.slerp(q, 0.08);
      // small breathing translation
      headRef.current.position.y += breathY * 0.02;
    }

    // Eyes: smaller, faster movement
    const eyeLerp = 0.18;
    const eyeMax = 0.06; // max eye offset

    const eyeOffsetX = THREE.MathUtils.clamp(mouse.current.x * 0.02, -eyeMax, eyeMax);
    const eyeOffsetY = THREE.MathUtils.clamp(mouse.current.y * 0.015, -eyeMax, eyeMax);

    if (leftEyeRef.current) {
      // move the eye pupil/mesh locally by small offsets
      leftEyeRef.current.position.x += (eyeOffsetX - leftEyeRef.current.position.x) * eyeLerp;
      leftEyeRef.current.position.y += (eyeOffsetY - leftEyeRef.current.position.y) * eyeLerp;
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.position.x += (eyeOffsetX - rightEyeRef.current.position.x) * eyeLerp;
      rightEyeRef.current.position.y += (eyeOffsetY - rightEyeRef.current.position.y) * eyeLerp;
    }
  });

  return null;
}

function RealisticCharacter({
  modelUrl,
  scale = 1,
  modelPosition = [0, 0, 0],
}: {
  modelUrl: string;
  scale?: number;
  modelPosition?: [number, number, number];
}) {
  // load GLB model
  const { scene, nodes, animations } = useGLTF(modelUrl) as any;
  // if your model has animations you can use useAnimations to play idle etc.
  const { actions } = useAnimations(animations, scene);

  // play default idle if exists
  useEffect(() => {
    if (actions?.Idle) {
      actions.Idle.play();
    } else if (actions?.idle) {
      actions.idle.play();
    }
  }, [actions]);

  return (
    <group scale={[scale, scale, scale]} position={modelPosition}>
      <primitive object={scene} />
      <HeadAndEyesController model={scene} headName="Head" leftEyeName="LeftEye" rightEyeName="RightEye" />
    </group>
  );
}

/**
 * Main exported component that renders the Canvas pinned to bottom-right.
 */
export default function RealisticMan3D({ modelUrl }: { modelUrl: string }) {
  // camera & lighting tuned for a medium-shot that sits nicely bottom-right
  return (
    // wrapper that pins the canvas bottom-right on the page
    <div
      aria-hidden
      style={{
        position: "fixed",
        right: 24,
        bottom: 12,
        width: 420,
        height: 420,
        pointerEvents: "none", // so it doesn't block clicks on page
        zIndex: 40,
      }}
    >
      <Canvas
        dpr={Math.min(2, window.devicePixelRatio || 1)}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 1.4, 2.8], fov: 35 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.8} position={[5, 10, 5]} />
        <directionalLight intensity={0.35} position={[-5, -2, -5]} />

        <Suspense fallback={null}>
          {/* Ground / bean bag shadow */}
          <group position={[0, -0.55, 0]}>
            <mesh rotation-x={-Math.PI / 2} position={[0, -0.2, 0]}>
              <planeGeometry args={[3.6, 3.6]} />
              <meshStandardMaterial color="#000" transparent opacity={0} />
            </mesh>
          </group>

          {/* The realistic character model */}
          <RealisticCharacter modelUrl={modelUrl} scale={0.95} modelPosition={[0, -0.9, 0]} />
        </Suspense>

        {/* subtle orbit controls for dev (disabled by default), set pointerEvents to 'auto' to interact */}
        {/* <OrbitControls enablePan={false} enableRotate={false} enableZoom={false} /> */}
      </Canvas>
    </div>
  );
}
// Preload the model    