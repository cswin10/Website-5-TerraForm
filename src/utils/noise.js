import { createNoise2D } from 'simplex-noise';

// Seeded random number generator (mulberry32)
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Create a seeded noise function
export function createSeededNoise(seed) {
  const rng = mulberry32(seed);
  return createNoise2D(rng);
}

// Generate terrain heightmap using fractal brownian motion
export function generateHeightmap(params) {
  const {
    width = 512,
    height = 512,
    seed = 12345,
    scale = 1.5,
    octaves = 6,
    persistence = 0.5,
    lacunarity = 2.0,
    mountainHeight = 0.6,
    erosion = 0.2,
  } = params;

  const noise2D = createSeededNoise(seed);
  const heightmap = new Float32Array(width * height);

  // Calculate base frequency from scale
  const baseFrequency = scale / 100;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let amplitude = 1;
      let frequency = baseFrequency;
      let noiseValue = 0;
      let maxValue = 0;

      // Stack octaves for fractal noise
      for (let o = 0; o < octaves; o++) {
        const sampleX = x * frequency;
        const sampleY = y * frequency;

        noiseValue += noise2D(sampleX, sampleY) * amplitude;
        maxValue += amplitude;

        amplitude *= persistence;
        frequency *= lacunarity;
      }

      // Normalize to 0-1
      noiseValue = (noiseValue / maxValue + 1) / 2;

      // Apply mountain height modifier (power function for peaks)
      const mountainModifier = 1 + (1 - mountainHeight);
      noiseValue = Math.pow(noiseValue, mountainModifier);

      heightmap[y * width + x] = noiseValue;
    }
  }

  // Apply erosion (smoothing)
  if (erosion > 0) {
    applyErosion(heightmap, width, height, erosion);
  }

  return heightmap;
}

// Apply erosion effect using box blur
function applyErosion(heightmap, width, height, erosion) {
  const radius = Math.max(1, Math.round(erosion * 5));
  const temp = new Float32Array(heightmap.length);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;

      for (let dx = -radius; dx <= radius; dx++) {
        const nx = Math.min(Math.max(x + dx, 0), width - 1);
        sum += heightmap[y * width + nx];
        count++;
      }

      temp[y * width + x] = sum / count;
    }
  }

  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        const ny = Math.min(Math.max(y + dy, 0), height - 1);
        sum += temp[ny * width + x];
        count++;
      }

      heightmap[y * width + x] = sum / count;
    }
  }
}

export default generateHeightmap;
