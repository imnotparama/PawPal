// SVG path silhouettes (viewBox 100x100). Multiple overlapping subpaths build
// up cohesive forms. Path2D + isPointInPath ORs them, so overlap is free.

/* ------------------------------ CAT (sitting, front/side) ------------------------------ */
export const CAT_PATH = [
  "M 48 10",
  "C 45 10, 42 12, 40 15",  // left ear base
  "L 35 2",                // left ear tip
  "L 32 18",               // left ear down
  "C 26 21, 23 26, 23 32",  // head left
  "C 23 38, 27 44, 33 46",  // chin left
  "C 30 52, 24 60, 20 68",  // back left
  "C 15 76, 12 84, 12 90",  // lower back / tail start
  "C 12 96, 18 98, 24 98",  // tail bottom
  "C 32 98, 38 92, 42 84",  // tail curl up
  "C 44 80, 44 76, 42 72",  // tail curl inner
  "C 40 68, 36 68, 34 72",  // tail end
  "C 34 74, 36 76, 38 76",
  "C 40 76, 40 80, 38 84",  // tail thickness
  "C 35 90, 30 92, 24 92",
  "C 20 92, 18 90, 18 86",
  "C 18 80, 24 70, 28 62",  // leg back left
  "C 32 54, 35 48, 36 46",  // shoulder left
  "C 37 54, 38 64, 38 74",  // front leg left
  "C 38 82, 36 90, 36 94",
  "C 36 96, 38 97, 40 97",  // paw left
  "C 42 97, 43 95, 43 92",
  "L 45 70",               // leg inner
  "L 47 70",
  "L 49 92",               // paw right
  "C 49 95, 50 97, 52 97",
  "C 54 97, 56 96, 56 94",
  "C 56 90, 54 82, 54 74",  // front leg right
  "C 54 64, 55 54, 56 46",  // shoulder right
  "C 58 48, 61 54, 65 62",  // leg back right
  "C 69 70, 75 80, 75 86",
  "C 75 90, 73 92, 69 92",
  "C 63 92, 58 90, 53 84",
  "C 55 80, 55 76, 57 72",
  "C 59 68, 63 68, 65 72",
  "C 65 74, 63 76, 61 76",
  "C 59 76, 59 80, 61 84",
  "C 65 92, 71 98, 79 98",
  "C 85 98, 91 96, 91 90",  // right side tail curl outer
  "C 91 84, 88 76, 83 68",
  "C 79 60, 73 52, 70 46",  // back right
  "C 76 44, 80 38, 80 32",  // head right
  "C 80 26, 77 21, 71 18",
  "L 68 2",                // right ear tip
  "L 63 15",               // right ear down
  "C 61 12, 58 10, 55 10",  // top of head
  "Z"
].join(" ");

/* ------------------------------ DOG (standing, side profile) ------------------------------ */
export const DOG_PATH = [
  "M 15 50",                 // start at back tail base
  "C 12 40, 8 28, 8 20",     // tail arch up
  "C 8 16, 12 16, 13 22",    // tail tip and curve down
  "C 15 32, 17 42, 22 47",   // tail thickness to rump
  "C 22 44, 23 40, 25 38",   // thigh top
  "C 32 35, 45 35, 55 38",   // back curve (horizontal)
  "C 60 38, 65 32, 68 26",   // neck curve up
  "C 70 20, 72 14, 75 14",   // head top
  "C 77 14, 78 15, 79 17",   // forehead
  "L 82 22",                 // muzzle bridge
  "C 85 22, 88 23, 91 25",   // nose
  "C 93 27, 93 30, 91 32",   // mouth/chin
  "C 87 34, 84 34, 82 34",   // jaw line
  "C 79 38, 77 42, 77 46",   // throat
  "C 77 52, 75 58, 73 62",   // neck front
  "C 73 66, 73 70, 74 74",   // front leg right top
  "L 76 86",                 // front leg right shin
  "C 77 90, 78 92, 80 92",   // front paw right
  "C 81 92, 81 94, 79 94",
  "C 76 94, 74 92, 73 88",   // front leg right back
  "L 70 70",                 // leg back top
  "L 68 74",                 // front leg left front
  "L 70 88",                 // front leg left shin
  "C 71 91, 72 92, 74 92",   // front paw left
  "C 75 92, 75 94, 73 94",
  "C 70 94, 68 92, 67 88",   // front leg left back
  "L 64 64",                 // shoulder joint
  "C 58 65, 48 65, 42 63",   // belly line
  "C 36 63, 33 60, 31 58",   // groin
  "L 29 74",                 // hind leg left front
  "L 30 86",                 // hind leg left shin
  "C 31 90, 32 92, 34 92",   // hind paw left
  "C 35 92, 35 94, 33 94",
  "C 30 94, 28 92, 27 88",   // hind leg left back
  "L 25 72",                 // hock
  "L 23 76",                 // hind leg right front
  "L 24 88",                 // hind leg right shin
  "C 25 91, 26 92, 28 92",   // hind paw right
  "C 29 92, 29 94, 27 94",
  "C 24 94, 22 92, 21 86",   // hind leg right back
  "C 20 78, 19 66, 18 56",   // rump down
  "Z",
  "M 74 18",
  "C 71 18, 69 22, 69 26",   // ear flap front
  "C 69 32, 72 35, 73 35",   // ear tip
  "C 74 35, 75 32, 75 25",   // ear flap back
  "Z"
].join(" ");

/* ----------------------- GIRL HOLDING A CAT (3/4 bust portrait) ----------------------- */
export const GIRL_CAT_PATH = [
  "M 15 95",                 // start bottom left
  "C 15 88, 16 80, 19 75",   // back neck/shoulder
  "C 17 65, 14 55, 14 45",   // hair back
  "C 14 30, 20 20, 30 18",   // head top
  "C 35 17, 40 18, 43 21",   // forehead
  "C 45 23, 46 25, 47 27",   // nose bridge
  "C 50 28, 50 30, 48 31",   // nose tip
  "C 45 32, 44 33, 46 35",   // lips
  "C 48 37, 46 39, 44 41",   // chin
  "C 40 45, 40 49, 41 53",   // throat
  "C 42 58, 44 63, 46 67",   // chest upper
  "C 48 70, 52 74, 56 77",   // arm right shoulder
  "C 62 80, 68 83, 74 85",   // arm right wrapping
  "L 75 95",                 // bottom right edge
  "L 15 95",                 // bottom connect
  "Z",
  "M 25 20",
  "C 22 15, 16 12, 10 15",   // ponytail curve up
  "C 6 17, 4 23, 4 30",      // ponytail down
  "C 4 38, 8 45, 12 48",     // ponytail curve in
  "C 15 42, 17 35, 18 28",   // ponytail base
  "Z",
  "M 44 65",                 // cat back
  "C 46 58, 52 54, 58 54",   // cat back arch
  "C 62 54, 65 57, 67 61",   // cat neck
  "C 69 57, 72 54, 75 54",   // head top
  "L 78 47",                 // left ear tip
  "L 80 55",
  "C 83 55, 85 57, 86 60",   // face
  "L 89 53",                 // right ear tip
  "L 90 62",
  "C 90 67, 87 72, 83 75",   // chin
  "C 81 78, 77 82, 73 85",   // chest
  "C 68 87, 60 88, 54 88",   // front paws
  "C 48 88, 44 84, 42 78",   // lower body
  "C 40 73, 42 67, 44 65",   // back curl
  "Z",
  "M 50 82",
  "C 46 82, 42 85, 40 88",   // tail loop
  "C 38 91, 40 94, 43 94",   // tail tip
  "C 46 94, 48 90, 50 85",   // tail thickness
  "Z"
].join(" ");

