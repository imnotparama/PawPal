import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CAT_PATH, DOG_PATH, GIRL_CAT_PATH } from "@/lib/silhouettes";

const PARTICLE_COUNT = 3500;
const MORPH_SHAPES = 3; // cat, dog, girl+cat

/**
 * Sample points from an SVG path using a hidden canvas + isPointInPath.
 * Returns normalized (0-1) positions.
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

    // Convert to centered coordinates (-1 to 1 range)
    positions[placed * 3] = (x / 100 - 0.5) * 2;
    positions[placed * 3 + 1] = -(y / 100 - 0.5) * 2; // flip Y
    positions[placed * 3 + 2] = (Math.random() - 0.5) * 0.8; // spread in Z for depth
    placed++;
  }

  // Fill remaining
  while (placed < count) {
    positions[placed * 3] = (Math.random() - 0.5) * 0.5;
    positions[placed * 3 + 1] = (Math.random() - 0.5) * 0.5;
    positions[placed * 3 + 2] = (Math.random() - 0.5) * 0.3;
    placed++;
  }

  return positions;
}

/**
 * Generate scattered explosion positions across the full viewport.
 */
function generateScatteredPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  return positions;
}

// Vertex shader: morphs between positions based on uniform progress
const vertexShader = `
  attribute vec3 posA;
  attribute vec3 posB;
  attribute vec3 posC;
  attribute vec3 posScatter;
  attribute float aPhase;
  attribute float aSize;

  uniform float uProgress; // 0-1 across all shapes
  uniform float uExplode;  // 0-1 explosion factor
  uniform float uTime;

  varying float vAlpha;
  varying vec3 vColor;

  // Simplex noise approximation for floating
  float noise(float x) {
    return sin(x * 1.0) * 0.5 + sin(x * 2.3) * 0.3 + sin(x * 4.1) * 0.2;
  }

  void main() {
    // Determine which two shapes to lerp between
    vec3 targetPos;
    if (uProgress <= 0.5) {
      float t = uProgress * 2.0; // 0-1 for A→B
      t = t * t * (3.0 - 2.0 * t); // smoothstep
      targetPos = mix(posA, posB, t);
    } else {
      float t = (uProgress - 0.5) * 2.0; // 0-1 for B→C
      t = t * t * (3.0 - 2.0 * t); // smoothstep
      targetPos = mix(posB, posC, t);
    }

    // Apply explosion
    vec3 finalPos = mix(targetPos, posScatter, uExplode);

    // Floating noise when stationary
    float noiseX = noise(uTime * 0.4 + aPhase) * 0.02;
    float noiseY = noise(uTime * 0.3 + aPhase * 1.3) * 0.02;
    float noiseZ = noise(uTime * 0.5 + aPhase * 0.7) * 0.01;
    finalPos += vec3(noiseX, noiseY, noiseZ);

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_PointSize = aSize * (100.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Color based on phase (creates multi-color gradient)
    float colorMix = fract(aPhase * 3.0);
    if (colorMix < 0.35) {
      vColor = vec3(0.502, 0.322, 1.0); // plum voltage
    } else if (colorMix < 0.6) {
      vColor = vec3(1.0, 0.722, 0.161); // amber spark
    } else if (colorMix < 0.85) {
      vColor = vec3(1.0, 1.0, 1.0); // white
    } else {
      vColor = vec3(0.082, 0.522, 0.431); // lichen
    }

    vAlpha = 0.4 + 0.2 * sin(uTime + aPhase * 6.28);
    // Fade during explosion
    vAlpha *= (1.0 - uExplode * 0.5);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    // Soft circle shape
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = vAlpha * smoothstep(0.5, 0.1, dist);
    gl_FragColor = vec4(vColor, alpha * 0.7);
  }
`;

/**
 * Three.js WebGL 3D Particle Morph System.
 * Thousands of particles smoothly interpolate between 3D point clouds
 * (cat → dog → girl+cat) based on scroll progress.
 * On the 4th panel, particles explode outward.
 */
export function ParticleMorph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // === Setup Three.js ===
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3.2;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // === Generate point clouds for each shape ===
    const positionsA = samplePointsFromPath(CAT_PATH, PARTICLE_COUNT);
    const positionsB = samplePointsFromPath(DOG_PATH, PARTICLE_COUNT);
    const positionsC = samplePointsFromPath(GIRL_CAT_PATH, PARTICLE_COUNT);
    const positionsScatter = generateScatteredPositions(PARTICLE_COUNT);

    // Per-particle attributes
    const phases = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.5 + Math.random() * 1.0;
    }

    // === Create geometry ===
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positionsA, 3));
    geometry.setAttribute("posA", new THREE.BufferAttribute(positionsA, 3));
    geometry.setAttribute("posB", new THREE.BufferAttribute(positionsB, 3));
    geometry.setAttribute("posC", new THREE.BufferAttribute(positionsC, 3));
    geometry.setAttribute("posScatter", new THREE.BufferAttribute(positionsScatter, 3));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    // === Shader material ===
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
      blending: THREE.NormalBlending,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // === Mouse parallax ===
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.3;
      mouseRef.current.ty = -(e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    if (!reduced) window.addEventListener("mousemove", onMouseMove);

    // === Resize ===
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // === Animation loop ===
    const clock = new THREE.Clock();
    const NUM_PANELS = 4;
    const EXPLODE_START = 0.74;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;

      // Read scroll progress
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollMax > 0 ? Math.min(Math.max(window.scrollY / scrollMax, 0), 1) : 0;

      // Morph progress (0→1 across 3 shapes, maps first 3 panels)
      const morphProgress = Math.min(scrollProgress * (NUM_PANELS - 1) / (MORPH_SHAPES - 1), 1);
      material.uniforms.uProgress.value = morphProgress;

      // Explosion on 4th panel
      const explode = scrollProgress > EXPLODE_START
        ? Math.min((scrollProgress - EXPLODE_START) / (1 - EXPLODE_START), 1)
        : 0;
      // Smoothstep the explosion
      const smoothExplode = explode * explode * (3 - 2 * explode);
      material.uniforms.uExplode.value = smoothExplode;

      // Mouse parallax on camera
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;
      camera.position.x = m.x;
      camera.position.y = m.y;
      camera.lookAt(0, 0, 0);

      // Gentle rotation
      if (!reduced) {
        points.rotation.y = elapsed * 0.05;
        points.rotation.x = Math.sin(elapsed * 0.1) * 0.02;
      }

      // X offset based on which panel is active (alternate left/right)
      const panelPositions = [0.4, -0.4, 0.4, 0]; // right, left, right, center
      const panelIndex = scrollProgress * (NUM_PANELS - 1);
      const pIdx = Math.min(Math.floor(panelIndex), NUM_PANELS - 2);
      const pLocal = panelIndex - pIdx;
      const pT = pLocal * pLocal * (3 - 2 * pLocal); // smoothstep
      const xOffset = panelPositions[pIdx] + (panelPositions[pIdx + 1] - panelPositions[pIdx]) * pT;
      points.position.x = xOffset;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
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
