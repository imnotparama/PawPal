import { useEffect, useRef, memo } from "react";
import * as THREE from "three";
import { CAT_PATH, DOG_PATH, GIRL_CAT_PATH } from "@/lib/silhouettes";

const PARTICLE_COUNT = 11000;

/**
 * Sample points from SVG path and inflate them into a beautiful, rounded 3D volume.
 * Incorporates high-density edge concentration (~55% of particles) to keep silhouette contours razor-sharp.
 * Replaces commas with spaces to prevent Path2D parsing errors on some browsers.
 */
function samplePointsFromPath(pathD: string, count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d")!;
  const path2d = new Path2D(pathD.replace(/,/g, " "));

  let placed = 0;
  let guard = 0;
  // Increase edge concentration from 40% to 55% for razor-sharp contours
  const interiorCount = Math.floor(count * 0.45);

  // Pass 1: Sample interior points with volumetric 3D Z depth
  while (placed < interiorCount && guard < count * 80) {
    guard++;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    if (!ctx.isPointInPath(path2d, x, y)) continue;

    const px = (x / 100 - 0.5) * 4.3;
    const py = -(y / 100 - 0.5) * 4.3;

    // Volumetric 3D depth: highest at center (px=0) and tapers to the edges
    const normalizedX = Math.min(Math.abs(px) / 1.6, 1.0);
    const thickness = Math.sqrt(1.0 - normalizedX * normalizedX);

    positions[placed * 3] = px;
    positions[placed * 3 + 1] = py;
    positions[placed * 3 + 2] = (Math.random() - 0.5) * thickness * 0.95;
    placed++;
  }

  // Pass 2: Sample edge-concentrated points to define crisp borders
  guard = 0;
  while (placed < count && guard < count * 120) {
    guard++;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const inside = ctx.isPointInPath(path2d, x, y);
    if (!inside) continue;

    // Probes neighbors closely (step=1.8) to detect boundary proximity
    const step = 1.8;
    const nearEdge =
      !ctx.isPointInPath(path2d, x + step, y) ||
      !ctx.isPointInPath(path2d, x - step, y) ||
      !ctx.isPointInPath(path2d, x, y + step) ||
      !ctx.isPointInPath(path2d, x, y - step);

    if (!nearEdge && Math.random() > 0.1) continue; // skip interior points

    const px = (x / 100 - 0.5) * 4.3;
    const py = -(y / 100 - 0.5) * 4.3;

    positions[placed * 3] = px;
    positions[placed * 3 + 1] = py;
    // Edge points have tighter Z-depth to keep the boundary outline sharp and flat-facing
    positions[placed * 3 + 2] = (Math.random() - 0.5) * 0.15;
    placed++;
  }

  // Fallback for remaining particles if guard is hit
  while (placed < count) {
    const rx = (Math.random() - 0.5) * 1.5;
    const ry = (Math.random() - 0.5) * 1.5;
    const normalizedX = Math.min(Math.abs(rx) / 1.6, 1.0);
    const thickness = Math.sqrt(1.0 - normalizedX * normalizedX);
    positions[placed * 3] = rx;
    positions[placed * 3 + 1] = ry;
    positions[placed * 3 + 2] = (Math.random() - 0.5) * thickness * 0.95;
    placed++;
  }
  return positions;
}

/**
 * Generate a dramatic volumetric 3D supernova disk explosion (boom effect)
 * expanding outward in the XY plane, keeping particles visible and impactful.
 */
function generateScatteredPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 4.5;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3.0;
  }
  return positions;
}

/**
 * Vertex shader with:
 * - Position-based color gradient (yellow top → purple bottom)
 * - Perlin-like noise for organic floating
 * - Per-triangle 3D rotation (catches light)
 * - Smoothstep morph between shapes
 */
const vertexShader = `
  attribute vec3 posA;
  attribute vec3 posB;
  attribute vec3 posC;
  attribute vec3 posScatter;
  attribute float aPhase;
  attribute float aScale;

  uniform float uProgress;
  uniform float uExplode;
  uniform float uIntro;
  uniform float uTime;

  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vUv;
  varying vec3 vNormal;

  // Simplex-like noise for organic floating
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(
      mix(mix(hash(n), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
      mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
          mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
  }

  void main() {
    // Morph between 3 shapes with smoothstep
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

    // Explosion scatter OR intro scatter (intro takes priority on load)
    float scatterAmount = max(uExplode, uIntro);
    vec3 finalPos = mix(targetPos, posScatter, scatterAmount);

    // Perlin noise floating (organic, not mechanical)
    vec3 noiseInput = vec3(aPhase * 2.0, uTime * 0.3, aPhase * 1.5);
    float nx = noise(noiseInput) * 0.025 - 0.0125;
    float ny = noise(noiseInput + vec3(100.0, 0.0, 0.0)) * 0.025 - 0.0125;
    float nz = noise(noiseInput + vec3(0.0, 100.0, 0.0)) * 0.015 - 0.0075;
    finalPos += vec3(nx, ny, nz);

    // Triangle scale — reduced to 0.011 for extremely fine star details
    float scale = aScale * 0.011;

    // 3D rotation — each triangle rotates on all axes
    float angleX = uTime * 0.15 + aPhase * 3.14;
    float angleY = uTime * 0.2 + aPhase * 2.71;
    float angleZ = uTime * 0.1 + aPhase * 1.61;

    // Rotation matrices
    float cx = cos(angleX), sx = sin(angleX);
    float cy = cos(angleY), sy = sin(angleY);
    float cz = cos(angleZ), sz = sin(angleZ);

    vec3 pos = position * scale;

    // Rotate X
    pos = vec3(pos.x, pos.y * cx - pos.z * sx, pos.y * sx + pos.z * cx);
    // Rotate Y
    pos = vec3(pos.x * cy + pos.z * sy, pos.y, -pos.x * sy + pos.z * cy);
    // Rotate Z
    pos = vec3(pos.x * cz - pos.y * sz, pos.x * sz + pos.y * cz, pos.z);

    pos += finalPos;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;

    // 3D normal blending: combine individual triangle rotated normals (for dynamic shimmer)
    // with the volumetric surface normal of the rounded body (for solid 3D shading).
    vec3 localTriNormal = vec3(0.0, 0.0, 1.0);
    localTriNormal = vec3(localTriNormal.x, localTriNormal.y * cx - localTriNormal.z * sx, localTriNormal.y * sx + localTriNormal.z * cx);
    localTriNormal = vec3(localTriNormal.x * cy + localTriNormal.z * sy, localTriNormal.y, -localTriNormal.x * sy + localTriNormal.z * cy);
    localTriNormal = vec3(localTriNormal.x * cz - localTriNormal.y * sz, localTriNormal.x * sz + localTriNormal.y * cz, localTriNormal.z);

    // Dynamic surface normal of the inflated cylinder body: points outward in X and Z
    vec3 bodySurfaceNormal = normalize(vec3(finalPos.x * 1.3, finalPos.y * 0.1, finalPos.z * 1.8));

    // Blended normal: shimmer + volume shading
    vec3 blendedNormal = normalize(mix(localTriNormal, bodySurfaceNormal, 0.55));
    vNormal = normalize(normalMatrix * blendedNormal);

    // Position-based color gradient
    float yNorm = (finalPos.y + 2.2) / 4.4;

    vec3 colorTop = vec3(1.0, 0.82, 0.12);    // rich amber gold
    vec3 colorMid = vec3(1.0, 1.0, 1.0);      // pure white
    vec3 colorBot = vec3(0.55, 0.28, 1.0);    // deep plum violet

    if (yNorm > 0.5) {
      vColor = mix(colorMid, colorTop, (yNorm - 0.5) * 2.0);
    } else {
      vColor = mix(colorBot, colorMid, yNorm * 2.0);
    }

    // Lichen teal flecks — keep but limit to 8%
    if (fract(aPhase * 7.0) < 0.08) {
      vColor = vec3(0.1, 0.82, 0.62);
    }

    // Depth-based alpha with edge brightness boost
    float depth = -mvPosition.z;
    float edgeBoost = smoothstep(0.5, 1.8, aScale); // larger particles = near edge = brighter
    vAlpha = smoothstep(12.0, 1.5, depth) * (0.75 + 0.25 * sin(uTime * 0.5 + aPhase * 6.28));
    vAlpha *= (1.0 + edgeBoost * 0.4); // edge particles up to 40% brighter
    vAlpha *= (1.0 - uExplode * 0.55);
    vAlpha *= (1.0 - uIntro * 0.3); // slightly dimmer during entrance
    vAlpha = min(vAlpha, 1.0);
  }
`;

/**
 * Fragment shader:
 * - Outlined triangles (hollow with glowing edges)
 * - Basic lighting from normal
 */
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    // Edge detection for outlined triangle effect
    vec3 bary = vec3(vUv.x, vUv.y, 1.0 - vUv.x - vUv.y);
    float edge = min(min(bary.x, bary.y), bary.z);
    float outline = 1.0 - smoothstep(0.0, 0.25, edge);

    // Basic directional lighting for 3D feel
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0) * 0.4 + 0.6;

    // Boost edge/outline glow and make the centers hollow/clear
    float glow = outline * 3.6 + 0.15;
    float alpha = vAlpha * (outline * 0.85 + 0.15) * diffuse;

    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor * diffuse * glow, alpha);
  }
`;

/**
 * Three.js 3D Particle Morph — Dala-quality.
 * 6000 instanced outlined 3D triangles with position-based color gradient,
 * Perlin noise floating, per-triangle 3D rotation, and scroll-bound morphing.
 */
export const ParticleMorph3D = memo(function ParticleMorph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Generate point clouds for each shape
    const posA = samplePointsFromPath(CAT_PATH, PARTICLE_COUNT);
    const posB = samplePointsFromPath(DOG_PATH, PARTICLE_COUNT);
    const posC = samplePointsFromPath(GIRL_CAT_PATH, PARTICLE_COUNT);
    const posScatter = generateScatteredPositions(PARTICLE_COUNT);

    // Per-instance attributes
    const phases = new Float32Array(PARTICLE_COUNT);
    const scales = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      phases[i] = Math.random() * Math.PI * 2;
      scales[i] = 0.5 + Math.random() * 2.0;
    }

    // Triangle geometry
    const triGeo = new THREE.BufferGeometry();
    const verts = new Float32Array([
      0, 0.866, 0,
      -0.5, -0.433, 0,
      0.5, -0.433, 0,
    ]);
    const uvs = new Float32Array([
      0.5, 1.0,
      0.0, 0.0,
      1.0, 0.0,
    ]);
    triGeo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    triGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    triGeo.computeVertexNormals();

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uExplode: { value: 0 },
        uIntro: { value: 1.0 }, // starts scattered, goes to 0 as shape forms
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.InstancedMesh(triGeo, material, PARTICLE_COUNT);
    const geo = mesh.geometry;
    geo.setAttribute("posA", new THREE.InstancedBufferAttribute(posA, 3));
    geo.setAttribute("posB", new THREE.InstancedBufferAttribute(posB, 3));
    geo.setAttribute("posC", new THREE.InstancedBufferAttribute(posC, 3));
    geo.setAttribute("posScatter", new THREE.InstancedBufferAttribute(posScatter, 3));
    geo.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    geo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));

    const dummy = new THREE.Object3D();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dummy.position.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    scene.add(mesh);

    // Mouse parallax
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
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

      // Intro: scatter → shape over 2.5 seconds with ease-out cubic
      const introT = Math.min(elapsed / 2.5, 1);
      const introEased = 1 - Math.pow(introT, 2); // starts at 1, goes to 0
      material.uniforms.uIntro.value = introEased;

      // Scroll progress
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollMax > 0 ? Math.min(Math.max(window.scrollY / scrollMax, 0), 1) : 0;

      // Morph (maps to 3 shapes across first 3 panels)
      const morphProgress = Math.min(scrollProgress * (NUM_PANELS - 1) / 2, 1);
      material.uniforms.uProgress.value = morphProgress;

      // Explosion on last panel
      const explode = scrollProgress > EXPLODE_START
        ? Math.min((scrollProgress - EXPLODE_START) / (1 - EXPLODE_START), 1)
        : 0;
      material.uniforms.uExplode.value = explode * explode * (3 - 2 * explode);

      // Mouse parallax — smooth follow
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.025;
      m.y += (m.ty - m.y) * 0.025;

      // Per-panel X offset for the shape (mesh.position.x) to alternate sides:
      // Positive mesh X = shape appears on RIGHT, Negative mesh X = shape appears on LEFT
      const panelOffsets = [1.3, -1.3, 1.3, 0.0];
      const panelIndex = scrollProgress * (NUM_PANELS - 1);
      const pIdx = Math.min(Math.floor(panelIndex), NUM_PANELS - 2);
      const pLocal = panelIndex - pIdx;
      const pT = pLocal * pLocal * (3 - 2 * pLocal); // smoothstep
      const xOff = panelOffsets[pIdx] + (panelOffsets[pIdx + 1] - panelOffsets[pIdx]) * pT;

      // Set mesh position smoothly based on scroll translation, mouse parallax, and a gentle horizontal/vertical drift
      const horizontalDrift = Math.sin(elapsed * 0.35) * 0.12;
      const verticalDrift = Math.cos(elapsed * 0.25) * 0.04;
      mesh.position.x = xOff + m.x + horizontalDrift;
      mesh.position.y = m.y + verticalDrift;

      // Gentle oscillation capped at ±45 degrees (π/4 ≈ 0.785 rad)
      if (!reduced) {
        mesh.rotation.y = Math.sin(elapsed * 0.08) * 0.4; // oscillates ±23 degrees
        mesh.rotation.x = Math.sin(elapsed * 0.05) * 0.1; // subtle tilt ±6 degrees
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
});
