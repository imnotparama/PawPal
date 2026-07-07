import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface CatModel3DProps {
  pinRefs: React.RefObject<HTMLDivElement | null>[];
}

export function CatModel3D({ pinRefs }: CatModel3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 320;
    const height = 360;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 4.5);
    camera.lookAt(0, 0.2, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // transparent background
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // 4. Materials
    const CAT_GRAY = new THREE.MeshStandardMaterial({
      color: 0x9a8fa0, // soft gray-purple cat
      roughness: 0.8,
      metalness: 0.0,
    });
    const EYE_MATERIAL = new THREE.MeshStandardMaterial({
      color: 0x8052ff, // plum violet eyes
      emissive: 0x4020aa,
      roughness: 0.1,
      metalness: 0.3,
    });
    const NOSE_MATERIAL = new THREE.MeshStandardMaterial({
      color: 0xff8899, // pink nose
      roughness: 0.5,
    });

    const catGroup = new THREE.Group();

    // 5. Body Parts
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 12),
      CAT_GRAY
    );
    body.scale.set(1, 1.2, 0.9);
    body.position.set(0, 0, 0);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 16, 12),
      CAT_GRAY
    );
    head.position.set(0, 1.1, 0.1);

    const earGeo = new THREE.ConeGeometry(0.18, 0.35, 4);
    const earL = new THREE.Mesh(earGeo, CAT_GRAY);
    earL.position.set(-0.28, 1.55, 0.05);
    earL.rotation.z = 0.2;

    const earR = new THREE.Mesh(earGeo, CAT_GRAY);
    earR.position.set(0.28, 1.55, 0.05);
    earR.rotation.z = -0.2;

    const eyeGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, EYE_MATERIAL);
    eyeL.position.set(-0.2, 1.12, 0.5);

    const eyeR = new THREE.Mesh(eyeGeo, EYE_MATERIAL);
    eyeR.position.set(0.2, 1.12, 0.5);

    const noseGeo = new THREE.SphereGeometry(0.05, 6, 6);
    const nose = new THREE.Mesh(noseGeo, NOSE_MATERIAL);
    nose.position.set(0, 0.98, 0.54);

    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.7, 8);
    const legFL = new THREE.Mesh(legGeo, CAT_GRAY);
    legFL.position.set(-0.4, -0.85, 0.3);
    legFL.rotation.x = 0.1;

    const legFR = new THREE.Mesh(legGeo, CAT_GRAY);
    legFR.position.set(0.4, -0.85, 0.3);
    legFR.rotation.x = 0.1;

    const legBL = new THREE.Mesh(legGeo, CAT_GRAY);
    legBL.position.set(-0.5, -0.75, -0.3);
    legBL.rotation.x = -0.15;

    const legBR = new THREE.Mesh(legGeo, CAT_GRAY);
    legBR.position.set(0.5, -0.75, -0.3);
    legBR.rotation.x = -0.15;

    const pawGeo = new THREE.SphereGeometry(0.13, 8, 6);
    const pawL = new THREE.Mesh(pawGeo, CAT_GRAY);
    pawL.scale.set(1.2, 0.5, 1.4);
    pawL.position.set(-0.4, -1.22, 0.42);

    const pawR = new THREE.Mesh(pawGeo, CAT_GRAY);
    pawR.scale.set(1.2, 0.5, 1.4);
    pawR.position.set(0.4, -1.22, 0.42);

    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, -0.3, -0.5),
      new THREE.Vector3(-1.2, 0.2, -0.4),
      new THREE.Vector3(-1.4, 0.7, -0.1),
      new THREE.Vector3(-1.2, 1.1, 0.2),
    ]);
    const tail = new THREE.Mesh(
      new THREE.TubeGeometry(tailCurve, 12, 0.07, 8, false),
      CAT_GRAY
    );

    const whiskerGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.5, 4);
    const WHISKER_MAT = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, roughness: 1 
    });

    const whiskerPositions = [
      [-0.15, 0.97, 0.52, 0, 0, -0.4],   // left top
      [-0.15, 0.93, 0.52, 0, 0, -0.35],  // left bottom
      [0.15, 0.97, 0.52, 0, 0, 0.4],     // right top
      [0.15, 0.93, 0.52, 0, 0, 0.35],    // right bottom
    ];

    whiskerPositions.forEach(([x, y, z, rx, ry, rz]) => {
      const w = new THREE.Mesh(whiskerGeo, WHISKER_MAT);
      w.position.set(x, y, z);
      w.rotation.set(Math.PI / 2, ry, rz);
      catGroup.add(w);
    });

    catGroup.add(
      body, head, earL, earR, eyeL, eyeR, 
      nose, legFL, legFR, legBL, legBR,
      pawL, pawR, tail
    );
    scene.add(catGroup);

    // Initial angles
    catGroup.rotation.y = 0.3;
    catGroup.rotation.x = 0;

    // 6. Lighting Setup
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2, 3, 4);
    const fillLight = new THREE.DirectionalLight(0x8052ff, 0.4);
    fillLight.position.set(-3, 1, 2);
    const rimLight = new THREE.DirectionalLight(0xffb829, 0.3);
    rimLight.position.set(0, -2, -3);

    scene.add(ambient, keyLight, fillLight, rimLight);

    // 7. Particle Field
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 1.5;
      const height = (Math.random() - 0.5) * 4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8052ff,
      size: 0.04,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Hotspot 3D Anchors
    const hotspotAnchors = [
      new THREE.Vector3(-0.28, 1.55, 0.3),  // Skin & Ears (ears)
      new THREE.Vector3(0, 0.1, 0.9),       // Digestion & Food (belly front)
      new THREE.Vector3(-0.4, -1.1, 0.5),   // Energy & Sleep (front paw)
      new THREE.Vector3(0.4, 0.5, 0.6),     // Vaccines & Checks (back/shoulder)
    ];

    // 9. Mouse interaction variables
    let baseRotationY = 0.3;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      targetRotationY = x * 0.6;
      targetRotationX = -y * 0.4;
    };

    const onMouseLeave = () => {
      targetRotationY = 0;
      targetRotationX = 0;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // 10. Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Gentle body breathing
      catGroup.position.y = Math.sin(time * 1.2) * 0.03;

      // Very slow idle rotation
      baseRotationY += 0.003;

      // Lerp rotation
      catGroup.rotation.y += ((baseRotationY + targetRotationY) - catGroup.rotation.y) * 0.05;
      catGroup.rotation.x += (targetRotationX - catGroup.rotation.x) * 0.05;

      // Tail sway
      tail.rotation.z = Math.sin(time * 0.8) * 0.15;

      // Ear twitch occasionally
      if (Math.sin(time * 0.3) > 0.95) {
        earL.rotation.z = 0.2 + Math.sin(time * 8) * 0.1;
      } else {
        earL.rotation.z = 0.2;
      }

      // Rotate particle field
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.0005;

      // Project world positions to screen coordinate pixels
      hotspotAnchors.forEach((anchor, i) => {
        const projected = anchor.clone();
        projected.applyMatrix4(catGroup.matrixWorld);
        projected.project(camera);

        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;

        const pinRef = pinRefs[i];
        if (pinRef && pinRef.current) {
          pinRef.current.style.left = `${x}px`;
          pinRef.current.style.top = `${y}px`;
        }
      });

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);

      // Clean meshes
      body.geometry.dispose();
      head.geometry.dispose();
      earGeo.dispose();
      eyeGeo.dispose();
      noseGeo.dispose();
      legGeo.dispose();
      pawGeo.dispose();
      tail.geometry.dispose();
      whiskerGeo.dispose();
      particleGeo.dispose();

      CAT_GRAY.dispose();
      EYE_MATERIAL.dispose();
      NOSE_MATERIAL.dispose();
      WHISKER_MAT.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [pinRefs]);

  return (
    <div
      ref={mountRef}
      style={{
        width: 320,
        height: 360,
        position: "relative",
        zIndex: 1,
        pointerEvents: "auto",
        background: "transparent",
      }}
    />
  );
}
