import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CAT_PATH, DOG_PATH, GIRL_CAT_PATH } from "@/lib/silhouettes";

const PARTICLE_COUNT = 4000;

/**
 * Sample points from an SVG path using a hidden canvas.
 */
function samplePointsFromPath(pathD: string, count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d")!;
  const path2d = new Path2D(pathD);

  let placed = 0;
  let guard = 0;
  while (placed < count && guard < count * 50) {
    guard++;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    if (!ctx.isPointInPath(path2d, x, y)) continue;

    positions[placed * 3] = (x / 100 - 0.5) * 2.2;
    positions[placed * 3 + 1] = -(y / 100 - 0.5) * 2.2;
    positions[placed * 3 + 2] = (Math.random() - 0.5) * 0.6;
    placed++;
  }
  while (placed < count) {
    positions[placed * 3] = (Math.random() - 0.5) * 0.5;
    positions[placed * 3 + 1] = (Math.random() - 0.5) * 0.5;
    positions[placed * 3 + 2] = (Math.random() - 0.5) * 0.6;
    placed++;
  }
  return positions;
}

function generateScatteredPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }
  return positions;
}

const vertexShader = `
  attribute vec3 posA;
  attribute vec3 posB;
  attribute vec3 posC;
  attribute vec3 posScatter;
  attribute float aPhase;
  attribute float aScale;
  attribute vec3 aColor;

  uniform float uProgress;
  uniform float uExplode;
  uniform float uTime;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Morph between 3 shapes
    vec3 targetPos;
    if (uProgress <= 0.5) {
      float t = uProgress * 2.0;
      t = t * t * (3.0 - 2.0 * t);
      targetPos = mix(posA, posB, t);
    } else {
      float t = (uProgress - 0.5) * 2.0;
      t = t * t * (3.0 - 2.0 * t);
      targetPos = mix(posB, posC, t);
    }

    // Explosion scatter
    vec3 finalPos = mix(targetPos, posScatter, uExplode);

    // Floating noise
    float nx = sin(uTime * 0.5 + aPhase) * 0.015;
    float ny = cos(uTime * 0.4 + aPhase * 1.3) * 0.015;
    float nz = sin(uTime * 0.3 + aPhase * 0.7) * 0.008;
    finalPos += vec3(nx, ny, nz);

    // Scale each triangle instance
    vec3 pos = position * aScale * 0.012;

    // Rotation per instance based on time + phase
    float angle = uTime * 0.3 + aPhase * 6.28;
    float ca = cos(angle);
    float sa = sin(angle);
    mat2 rot = mat2(ca, -sa, sa, ca);
    pos.xy = rot * pos.xy;

    pos += finalPos;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vColor = aColor;
    vAlpha = 0.7 + 0.3 * sin(uTime * 0.8 + aPhase * 3.14);
    vAlpha *= (1.0 - uExplode * 0.4);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

/**
 * Three.js WebGL 3D particle morph using instanced tiny triangles.
 * Each particle is a small triangle mesh that morphs between shapes on scroll.
 * Like the Dala brain reference.
 */
export function ParticleMorph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Generate point clouds
    const positionsA = samplePointsFromPath(CAT_PATH, PARTICLE_COUNT);
    const positionsB = samplePointsFromPath(DOG_PATH, PARTICLE_COUNT);
    const positionsC = samplePointsFromPath(GIRL_CAT_PATH, PARTICLE_COUNT);
    const positionsScatter = generateScatteredPositions(PARTICLE_COUNT);

    // Per-instance attributes
    const phases = new Float32Array(PARTICLE_COUNT);
    const scales = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const colorPalette = [
      [0.502, 0.322, 1.0],   // plum voltage
      [1.0, 0.722, 0.161],   // amber spark
      [1.0, 1.0, 1.0],       // white
      [0.082, 0.522, 0.431], // lichen
      [0.6, 0.4, 1.0],       // light plum
      [1.0, 0.85, 0.3],      // warm amber
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      phases[i] = Math.random() * Math.PI * 2;
      scales[i] = 0.6 + Math.random() * 1.4;
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    // Base triangle geometry (tiny equilateral triangle)
    const triGeo = new THREE.BufferGeometry();
    const s = 1.0;
    const triVerts = new Float32Array([
      0, s * 0.866, 0,
      -s * 0.5, -s * 0.433, 0,
      s * 0.5, -s * 0.433, 0,
    ]);
    triGeo.setAttribute("position", new THREE.BufferAttribute(triVerts, 3));

    // Instanced mesh
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uExplode: { value: 0 },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.InstancedMesh(triGeo, material, PARTICLE_COUNT);

    // Set instanced attributes
    const iGeo = mesh.geometry;
    iGeo.setAttribute("posA", new THREE.InstancedBufferAttribute(positionsA, 3));
    iGeo.setAttribute("posB", new THREE.InstancedBufferAttribute(positionsB, 3));
    iGeo.setAttribute("posC", new THREE.InstancedBufferAttribute(positionsC, 3));
    iGeo.setAttribute("posScatter", new THREE.InstancedBufferAttribute(positionsScatter, 3));
    iGeo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    iGeo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));
    iGeo.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));

    // Set identity matrices for all instances
    const dummy = new THREE.Object3D();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.position.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    scene.add(mesh);

    // Mouse
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouseRef.current.ty = -(e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    if (!reduced) window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation
    const clock = new THREE.Clock();
    const NUM_PANELS = 4;
    const EXPLODE_START = 0.74;
    const panelPositions = [0.5, -0.5, 0.5, 0];

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;

      // Scroll
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollMax > 0 ? Math.min(Math.max(window.scrollY / scrollMax, 0), 1) : 0;

      // Morph
      const morphProgress = Math.min(scrollProgress * (NUM_PANELS - 1) / 2, 1);
      material.uniforms.uProgress.value = morphProgress;

      // Explode
      const explode = scrollProgress > EXPLODE_START
        ? Math.min((scrollProgress - EXPLODE_START) / (1 - EXPLODE_START), 1)
        : 0;
      material.uniforms.uExplode.value = explode * explode * (3 - 2 * explode);

      // Mouse parallax
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.04;
      m.y += (m.ty - m.y) * 0.04;
      camera.position.x = m.x;
      camera.position.y = m.y;
      camera.lookAt(0, 0, 0);

      // X offset per panel
      const panelIndex = scrollProgress * (NUM_PANELS - 1);
      const pIdx = Math.min(Math.floor(panelIndex), NUM_PANELS - 2);
      const pLocal = panelIndex - pIdx;
      const pT = pLocal * pLocal * (3 - 2 * pLocal);
      const xOffset = panelPositions[pIdx] + (panelPositions[pIdx + 1] - panelPositions[pIdx]) * pT;
      mesh.position.x = xOffset;

      // Gentle rotation
      if (!reduced) {
        mesh.rotation.y = elapsed * 0.04;
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      triGeo.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
