// SVG path silhouettes (viewBox 100x100). Multiple overlapping subpaths build
// up cohesive forms. Path2D + isPointInPath ORs them, so overlap is free.

const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;

/* ------------------------------ CAT (sitting, front) ------------------------------ */
// Strategy: head + body strongly overlap, ears merge into head, tail curls
// down the right side. Reads as a single sitting cat silhouette.
export const CAT_PATH = [
  // ears (triangular) — overlap top of head
  "M 30 26 L 22 4 L 46 24 Z",
  "M 70 26 L 78 4 L 54 24 Z",
  // head (large, slightly squashed)
  ellipse(50, 32, 22, 19),
  // cheeks pad
  ellipse(38, 38, 9, 7),
  ellipse(62, 38, 9, 7),
  // neck (overlapping head + body)
  ellipse(50, 50, 18, 10),
  // body (big sitting trunk)
  ellipse(50, 70, 28, 23),
  // chest highlight overlap
  ellipse(50, 60, 22, 15),
  // front paws at bottom
  ellipse(36, 92, 9, 5),
  ellipse(64, 92, 9, 5),
  // back leg hint
  ellipse(76, 84, 6, 9),
  ellipse(24, 84, 6, 9),
  // tail curling up the right side
  ellipse(82, 76, 5, 12),
  ellipse(86, 64, 4, 9),
  ellipse(84, 54, 4, 6),
].join(" ");

/* ------------------------------ DOG (standing, side) ------------------------------ */
// Strategy: long body, connected neck → head → snout, 4 legs, tail up.
export const DOG_PATH = [
  // tail (up, behind)
  ellipse(14, 38, 4, 12),
  ellipse(16, 28, 4, 7),
  // rear haunch
  ellipse(24, 50, 11, 13),
  // body (long horizontal)
  ellipse(48, 54, 28, 14),
  // chest
  ellipse(70, 56, 11, 13),
  // neck
  ellipse(76, 46, 8, 10),
  // head
  ellipse(82, 36, 11, 10),
  // muzzle / snout
  ellipse(93, 42, 6, 5),
  // floppy ear
  ellipse(78, 28, 5, 9),
  // legs (front pair)
  ellipse(64, 76, 4, 16),
  ellipse(74, 76, 4, 16),
  // legs (back pair)
  ellipse(22, 76, 4, 16),
  ellipse(32, 76, 4, 16),
  // paws (slightly wider at bottom)
  ellipse(64, 90, 5, 3),
  ellipse(74, 90, 5, 3),
  ellipse(22, 90, 5, 3),
  ellipse(32, 90, 5, 3),
].join(" ");

/* ----------------------- GIRL HOLDING A CAT (3/4 bust portrait) ----------------------- */
// Strategy: hair halo + face + neck + torso + two arms cradling, with a small
// cat sitting in the arms. Connected overlaps make it read as one figure.
export const GIRL_CAT_PATH = [
  // hair halo (large oval behind face)
  ellipse(40, 22, 17, 16),
  // face
  ellipse(40, 27, 11, 12),
  // hair flowing over shoulders
  ellipse(28, 40, 8, 12),
  ellipse(52, 40, 8, 12),
  // neck
  "M 35 38 L 45 38 L 46 48 L 34 48 Z",
  // shoulders / upper torso
  ellipse(40, 56, 24, 12),
  // torso (tapered trapezoid)
  "M 20 56 Q 22 50 30 50 L 50 50 Q 58 50 60 56 L 70 96 L 12 96 Z",
  // left arm cradling
  ellipse(20, 70, 8, 16),
  ellipse(22, 84, 7, 10),
  // right arm wrapping over the cat
  "M 55 62 Q 78 62 82 84 Q 82 94 72 96 L 55 96 Z",

  // ----- cat held in the arms (lower right) -----
  // cat body
  ellipse(70, 76, 11, 9),
  // cat head
  ellipse(84, 70, 8, 7),
  // cat ears
  "M 79 64 L 77 56 L 84 62 Z",
  "M 89 64 L 91 56 L 84 62 Z",
  // cat tail curling left over the arm
  ellipse(60, 76, 5, 3),
  ellipse(54, 74, 4, 3),
].join(" ");
