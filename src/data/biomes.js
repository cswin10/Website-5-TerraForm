export const biomeColors = {
  temperate: {
    deepWater: '#1a365d',
    shallowWater: '#2b6cb0',
    shore: '#c4a35a',
    lowland: '#68a357',
    midland: '#4a7c43',
    highland: '#6b7280',
    mountain: '#9ca3af',
    peak: '#f4f4f5',
  },
  arctic: {
    deepWater: '#1e3a5f',
    shallowWater: '#3b82a0',
    shore: '#94a3b8',
    lowland: '#cbd5e1',
    midland: '#e2e8f0',
    highland: '#f1f5f9',
    mountain: '#f8fafc',
    peak: '#ffffff',
  },
  desert: {
    deepWater: '#1e3a5f',
    shallowWater: '#2563eb',
    shore: '#fbbf24',
    lowland: '#f59e0b',
    midland: '#d97706',
    highland: '#b45309',
    mountain: '#92400e',
    peak: '#fef3c7',
  },
  tropical: {
    deepWater: '#0e4a6f',
    shallowWater: '#0891b2',
    shore: '#fde68a',
    lowland: '#22c55e',
    midland: '#16a34a',
    highland: '#15803d',
    mountain: '#6b7280',
    peak: '#d1d5db',
  },
  volcanic: {
    deepWater: '#0f0f0f',
    shallowWater: '#1f1f1f',
    shore: '#292524',
    lowland: '#44403c',
    midland: '#57534e',
    highland: '#78716c',
    mountain: '#dc2626',
    peak: '#fbbf24',
  },
  alien: {
    deepWater: '#4c1d95',
    shallowWater: '#7c3aed',
    shore: '#a78bfa',
    lowland: '#2dd4bf',
    midland: '#14b8a6',
    highland: '#0d9488',
    mountain: '#f472b6',
    peak: '#fef08a',
  },
};

// Interpolate between biomes based on temperature and moisture
export function getBiomeColors(temperature, moisture) {
  // Temperature: 0 = arctic, 0.5 = temperate, 1 = desert
  // Moisture: 0 = arid, 0.5 = normal, 1 = lush/tropical

  if (temperature < 0.25) {
    return biomeColors.arctic;
  } else if (temperature > 0.75) {
    if (moisture < 0.3) {
      return biomeColors.desert;
    } else {
      return biomeColors.volcanic;
    }
  } else if (moisture > 0.7) {
    return biomeColors.tropical;
  } else {
    return biomeColors.temperate;
  }
}

// For more gradual transitions, interpolate colors
export function interpolateBiomeColors(temperature, moisture) {
  const colors = getBiomeColors(temperature, moisture);
  return colors;
}

export default biomeColors;
