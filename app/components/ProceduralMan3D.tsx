"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useFBX } from "./../components/useFBX";

function OrbitingCamera({ target }) {
  useFrame(({ camera, clock }) => {
    if (!target.current) return;

    // Get bot world position from Object3D
    const botPos = target.current.getWorldPosition(new THREE.Vector3());

    const radius = camera.position.distanceTo(botPos);
    const t = clock.getElapsedTime() * 0.4;

    const x = botPos.x + Math.sin(t) * radius;
    const z = botPos.z + Math.cos(t) * radius;

    camera.position.set(x, botPos.y + 0.3, z);
    camera.lookAt(botPos);
  });

  return null;
}

function ManModel({ target }) {
  const model = useFBX("/models/KVRC_Bot.fbx");
  const modelRef = useRef<THREE.Object3D>(null);

  const clock = new THREE.Clock();
  const albedoTexture = useLoader(THREE.TextureLoader, "/models/textures/t1.png");
  const normalTexture = useLoader(THREE.TextureLoader, "/models/textures/t3.png");
  const metalnessTexture = useLoader(THREE.TextureLoader, "/models/textures/t2.png");
  const roughnessTexture = useLoader(THREE.TextureLoader, "/models/textures/t4.png");
  const emissionTexture = useLoader(THREE.TextureLoader, "/models/textures/t5.png");

  // ===== APPLY MATERIALS =====
  model.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;

      obj.material = new THREE.MeshStandardMaterial({
        map: albedoTexture,
        normalMap: normalTexture,
        metalnessMap: metalnessTexture,
        roughnessMap: roughnessTexture,
        emissiveMap: emissionTexture,
        emissive: new THREE.Color(0x222222),
        metalness: 0.8,
        roughness: 0.4,
      });
    }
  });

  const isDragging = useRef(false);
  const lastX = useRef(0);
  const manualRotation = useRef(0);

  const onPointerDown = (e) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastX.current;
    manualRotation.current += deltaX * 0.005;

    lastX.current = e.clientX;
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  useFrame(() => {
    const t = clock.getElapsedTime();

    model.position.y = Math.sin(t * 1.5) * 0.12;

    if (!isDragging.current) {
      manualRotation.current += 0.01;
    }

    model.rotation.y = manualRotation.current;
  });

  model.scale.setScalar(0.01);
  modelRef.current = model;

  return (
    <primitive
      ref={modelRef}
      object={model}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  );
}
    

export default function ProceduralMan3D() {
  const botRef = useRef(null); // <-- now stores the model Object3D

  return (
    <div
      className=" border-e-red-400"
      style={{
        position: "fixed",
        right: 10,

        width: 500,
        height: 800,
        zIndex: 50,
        pointerEvents: "none",
        borderRadius: "12px",
      }}
    >
      <Canvas shadows camera={{ position: [5, 0, 5], fov: 70 }}>
        <OrbitingCamera target={botRef} />

        <ambientLight intensity={0.8} />
        <spotLight
          position={[0, 3, 0]} // directly above the bot
          angle={0.7}
          penumbra={0.8}
          intensity={3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          target-position={[0, -1.5, 0]} // light aims downward
        />

      

        <ManModel target={botRef} />
      </Canvas>
    </div>
  );
}
