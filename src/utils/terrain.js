import { generateHeightmap } from './noise';
import { renderTopographic, renderRelief } from './render';
import { getBiomeColors } from '../data/biomes';

// Main terrain generation and rendering function
export function generateAndRenderTerrain(canvas, params, viewMode) {
  const width = canvas.width;
  const height = canvas.height;

  // Generate the heightmap
  const heightmap = generateHeightmap({
    width,
    height,
    seed: params.seed,
    scale: params.scale,
    octaves: params.octaves,
    persistence: params.persistence,
    lacunarity: params.lacunarity,
    mountainHeight: params.mountainHeight / 100,
    erosion: params.erosion / 100,
  });

  // Get biome colors based on temperature and moisture
  const colors = getBiomeColors(
    params.temperature / 100,
    params.moisture / 100
  );

  // Render based on view mode
  if (viewMode === 'relief') {
    renderRelief(canvas, heightmap, params, colors);
  } else {
    renderTopographic(canvas, heightmap, params, colors);
  }

  return heightmap;
}

// Export terrain as PNG
export function exportTerrainPNG(canvas, seed) {
  const link = document.createElement('a');
  link.download = `terraform-${seed}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Copy terrain parameters to clipboard
export function copyTerrainParams(params) {
  const paramString = JSON.stringify({
    seed: params.seed,
    scale: params.scale,
    octaves: params.octaves,
    persistence: params.persistence,
    lacunarity: params.lacunarity,
    seaLevel: params.seaLevel,
    mountainHeight: params.mountainHeight,
    erosion: params.erosion,
    temperature: params.temperature,
    moisture: params.moisture,
  }, null, 2);

  navigator.clipboard.writeText(paramString);
}

export default {
  generateAndRenderTerrain,
  exportTerrainPNG,
  copyTerrainParams,
};
