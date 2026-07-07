import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function CatModel3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 320;
    const height = 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));

    // 60 Orbiting Particles
    const particlesCount = 60;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const originalCoords: { radius: number; angle: number; speed: number; y: number }[] = [];

    for (let i = 0; i < particlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 1.5;
      const y = (Math.random() - 0.5) * 3.0;
      const speed = 0.005 + Math.random() * 0.008;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      originalCoords.push({ radius, angle, speed, y });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x8052ff,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let rafId = 0;
    const animate = () => {
      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const positionsArray = posAttr.array as Float32Array;

      // Update particle orbits around cat image center
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const data = originalCoords[i];
        data.angle += data.speed;

        positionsArray[i3] = Math.cos(data.angle) * data.radius;
        positionsArray[i3 + 1] = data.y + Math.sin(data.angle * 2) * 0.08;
        positionsArray[i3 + 2] = Math.sin(data.angle) * data.radius;
      }

      posAttr.needsUpdate = true;

      // Slow overall rotation
      points.rotation.y += 0.0015;
      points.rotation.x += 0.0004;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        width: 320,
        height: 360,
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: "#050505",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Black cat image */}
      <img
        src="https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=500"
        alt="Black Cat"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.9) contrast(1.1) saturate(0.9)",
          pointerEvents: "none",
          transform: "translateZ(-10px) scale(1.05)",
          zIndex: 0,
        }}
      />

      {/* Floating Three.js particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 320,
          height: 360,
          zIndex: 1,
          pointerEvents: "none",
          transform: "translateZ(15px)", // Parallax depth pop
        }}
      />
    </div>
  );
}
