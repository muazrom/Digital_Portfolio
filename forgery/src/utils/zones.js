// Zone anchor positions and camera choreography keyframes
// Room is 24w × 24d × 10h. Door on south wall (z = +12).
// All positions are [x, y, z], targets are [x, y, z]

export const ZONES = {
  entry: {
    camera: { pos: [0, 1.7, 10], target: [0, 1.2, 0] },
  },
  hero: {
    anchor: [0, 0, 2],
    camera: { pos: [0, 2.2, 7], target: [0, 1.5, 2] },
  },
  about: {
    anchor: [-10, 1.5, 0],
    camera: { pos: [-5, 1.7, 3], target: [-10, 1.5, 0] },
  },
  skills: {
    anchor: [10, 2, -1],
    camera: { pos: [5, 2, 2], target: [10, 2, -1] },
  },
  projects: {
    anchor: [7, 0, -9],
    camera: { pos: [3, 2.5, -4], target: [7, 0.8, -9] },
  },
  experience: {
    anchor: [-7, 0.5, -9],
    camera: { pos: [-3, 2, -4], target: [-7, 1, -9] },
  },
  badges: {
    anchor: [0, 7, -10],
    camera: { pos: [0, 2, -6], target: [0, 6, -10] },
  },
  contact: {
    anchor: [0, 1, -11],
    camera: { pos: [0, 1.8, -5], target: [0, 1, -11] },
  },
}

export const SCROLL_KEYFRAMES = [
  'entry',
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'badges',
  'contact',
]
