// Convert hex color to RGB object
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

// Convert RGB to hex
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Interpolate between two colors
export function lerpColor(color1, color2, t) {
  const c1 = typeof color1 === 'string' ? hexToRgb(color1) : color1;
  const c2 = typeof color2 === 'string' ? hexToRgb(color2) : color2;

  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  };
}

// Get color for a specific elevation based on biome colors
export function getColorForElevation(elevation, seaLevel, colors) {
  const sl = seaLevel / 100; // Convert percentage to 0-1

  // Deep water
  if (elevation < sl * 0.6) {
    return hexToRgb(colors.deepWater);
  }
  // Shallow water
  if (elevation < sl) {
    const t = (elevation - sl * 0.6) / (sl * 0.4);
    return lerpColor(colors.deepWater, colors.shallowWater, t);
  }
  // Shore
  if (elevation < sl + 0.05) {
    const t = (elevation - sl) / 0.05;
    return lerpColor(colors.shallowWater, colors.shore, t);
  }
  // Lowland
  if (elevation < 0.45) {
    const t = (elevation - (sl + 0.05)) / (0.45 - sl - 0.05);
    return lerpColor(colors.shore, colors.lowland, Math.max(0, t));
  }
  // Midland
  if (elevation < 0.6) {
    const t = (elevation - 0.45) / 0.15;
    return lerpColor(colors.lowland, colors.midland, t);
  }
  // Highland
  if (elevation < 0.75) {
    const t = (elevation - 0.6) / 0.15;
    return lerpColor(colors.midland, colors.highland, t);
  }
  // Mountain
  if (elevation < 0.88) {
    const t = (elevation - 0.75) / 0.13;
    return lerpColor(colors.highland, colors.mountain, t);
  }
  // Peak
  const t = (elevation - 0.88) / 0.12;
  return lerpColor(colors.mountain, colors.peak, Math.min(1, t));
}

// Darken a color
export function darkenColor(color, amount) {
  return {
    r: Math.max(0, Math.round(color.r * (1 - amount))),
    g: Math.max(0, Math.round(color.g * (1 - amount))),
    b: Math.max(0, Math.round(color.b * (1 - amount))),
  };
}

// Lighten a color
export function lightenColor(color, amount) {
  return {
    r: Math.min(255, Math.round(color.r + (255 - color.r) * amount)),
    g: Math.min(255, Math.round(color.g + (255 - color.g) * amount)),
    b: Math.min(255, Math.round(color.b + (255 - color.b) * amount)),
  };
}

export default {
  hexToRgb,
  rgbToHex,
  lerpColor,
  getColorForElevation,
  darkenColor,
  lightenColor,
};
