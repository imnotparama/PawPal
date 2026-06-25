import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CAT_PATH, DOG_PATH, GIRL_CAT_PATH } from "@/lib/silhouettes";

const PARTICLE_COUNT = 5000;

/**
 * Sample points from SVG path. Returns positions in range (-1.2 to 1.2).
 * Concentrates more particles at the edges for the glowing border effect.
 */
function samplePointsFromPath(pathD: string, count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext("2d")!;
  const path2d = new Path2D(pathD);

  // Scale path to fill more of the canvas
  ctx.translate(10, 10);
  ctx.scale(1, 1);

  let placed = 0;
  let guard = 0;
  while (placed < count && guard < count * 60) {
    guard++;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    if (!ctx.isPointInPath(path2d, x, y)) continue;

    // Map to 3D coords — large spread for big shape
    positions[placed * 3] = (x / 100 - 0.5) * 2.8;
    positions[placed * 3 + 1] = -(y / 100 - 0.5) * 2.8;
    positions[placed * 3 + 2] = (Math.random() - 0.5) * 0.5;
    placed++;
  }
  while (placed < count) {
    positions[placed * 3] = (Math.random() - 0.5) * 0.8;
    positions[placed * 3 + 1] = (Math.random() - 0.5) * 0.8;
    positions[placed * 3 + 2] = (Math.random() - 0.5) * 0.5;
    placed++;
  }
  return positions;
}

function generateScatteredPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 4;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }
  return positions;
}

// Vertex shader — positions instanced outlined triangles
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
  varying vec2 vUv;

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

    // Explosion
    vec3 finalPos = mix(targetPos, posScatter, uExplode);

    // Floating noise
    finalPos.x += sin(uTime * 0.4 + aPhase) * 0.012;
    finalPos.y += cos(uTime * 0.35 + aPhase * 1.3) * 0.012;
    finalPos.z += sin(uTime * 0.25 + aPhase * 0.7) * 0.006;

    // Scale + rotate each triangle
    float scale = aScale * 0.018;
    float angle = uTime * 0.2 + aPhase * 6.28;
    float ca = cos(angle);
    float sa = sin(angle);

    vec3 pos = position * scale;
    pos.xy = mat2(ca, -sa, sa, ca) * pos.xy;
    pos += finalPos;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vColor = aColor;
    vUv = uv;

    // Distance-based fade for depth
    float depth = -mvPosition.z;
    vAlpha = (0.6 + 0.4 * sin(uTime * 0.6 + aPhase * 3.14)) * smoothstep(8.0, 2.0, depth);
    vAlpha *= (1.0 - uExplode * 0.5);
  }
`;

// Fragment shader — renders outlined triangles (hollow)
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vUv;

  void main() {
    // Calculate distance to edges for outline effect
    // Using barycentric-like approach: dark center, bright edges
    vec3 bary = vec3(vUv.x, vUv.y, 1.0 - vUv.x - vUv.y);
    float edge = min(min(bary.x, bary.y), bary.z);
    float outline = 1.0 - smoothstep(0.0, 0.3, edge);

    // Mix: mostly outline with slight fill
    float alpha = vAlpha * (outline * 0.9 + 0.1);

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

/**
 * Three.js instanced triangle mesh morph — Dala style.
 * 5000 tiny outlined triangles forming large shapes.
 */
export function ParticleMorph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4.5;
    // Offset camera to the right so shape appears right-of-center
    camera.position.x = 0.3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Point clouds
    const posA = samplePointsFromPath(CAT_PATH, PARTICLE_COUNT);
    const posB = samplePointsFromPath(DOG_PATH, PARTICLE_COUNT);
    const posC = samplePointsFromPath(GIRL_CAT_PATH, PARTICLE_COUNT);
    const posScatter = generateScatteredPositions(PARTICLE_COUNT);

    // Per-instance data
    const phases = new Float32Array(PARTICLE_COUNT);
    const scales = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const palette = [
      [0.502, 0.322, 1.0],   // plum
      [0.6, 0.45, 1.0],      // light plum
      [1.0, 0.722, 0.161],   // amber
      [1.0, 0.85, 0.35],     // warm amber
      [1.0, 1.0, 1.0],       // white
      [0.8, 0.85, 0.9],      // cool white
      [0.082, 0.522, 0.431], // lichen
      [0.15, 0.7, 0.55],     // bright lichen
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      phases[i] = Math.random() * Math.PI * 2;
      scales[i] = 0.4 + Math.random() * 1.2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    // Triangle geometry with UVs for outline effect
    const triGeo = new THREE.BufferGeometry();
    const s = 1.0;
    const verts = new Float32Array([
      0, s * 0.866, 0,
      -s * 0.5, -s * 0.433, 0,
      s * 0.5, -s * 0.433, 0,
    ]);
    const uvs = new Float32Array([
      0.5, 1.0,
      0.0, 0.0,
      1.0, 0.0,
    ]);
    triGeo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    triGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

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
    const geo = mesh.geometry;
    geo.setAttribute("posA", new THREE.InstancedBufferAttribute(posA, 3));
    geo.setAttribute("posB", new THREE.InstancedBufferAttribute(posB, 3));
    geo.setAttribute("posC", new THREE.InstancedBufferAttribute(posC, 3));
    geo.setAttribute("posScatter", new THREE.InstancedBufferAttribute(posScatter, 3));
    geo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));

    const dummy = new THREE.Object3D();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.position.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    scene.add(mesh);

    // Mouse
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouseRef.current.ty = -(e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    if (!reduced) window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    const NUM_PANELS = 4;
    const EXPLODE_START = 0.74;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;

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
      m.x += (m.tx - m.x) * 0.03;
      m.y += (m.ty - m.y) * 0.03;
      camera.position.x = 0.3 + m.x;
      camera.position.y = m.y;
      camera.lookAt(0, 0, 0);

      // Slow rotation
      if (!reduced) {
        mesh.rotation.y = elapsed * 0.03;
        mesh.rotation.x = Math.sin(elapsed * 0.08) * 0.03;
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
