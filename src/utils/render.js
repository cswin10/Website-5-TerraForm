import { getColorForElevation, darkenColor, lightenColor } from './colors';

// Render 2D topographic view
export function renderTopographic(canvas, heightmap, params, colors) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const { seaLevel } = params;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Render base colors
  for (let i = 0; i < heightmap.length; i++) {
    const elevation = heightmap[i];
    const color = getColorForElevation(elevation, seaLevel, colors);

    const idx = i * 4;
    data[idx] = color.r;
    data[idx + 1] = color.g;
    data[idx + 2] = color.b;
    data[idx + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  // Draw contour lines
  drawContours(ctx, heightmap, width, height, seaLevel, colors);
}

// Draw contour lines on the canvas
function drawContours(ctx, heightmap, width, height, seaLevel, colors) {
  const sl = seaLevel / 100;

  // Define contour levels
  const contourLevels = [];

  // Add contours above sea level
  for (let level = sl + 0.1; level < 1.0; level += 0.1) {
    contourLevels.push(level);
  }

  ctx.lineWidth = 0.5;

  for (const level of contourLevels) {
    // Use darker line for major contours
    if (Math.abs((level * 10) % 2) < 0.01) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1;
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 0.5;
    }

    // Marching squares algorithm
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const idx00 = y * width + x;
        const idx10 = y * width + (x + 1);
        const idx01 = (y + 1) * width + x;
        const idx11 = (y + 1) * width + (x + 1);

        const v00 = heightmap[idx00] >= level ? 1 : 0;
        const v10 = heightmap[idx10] >= level ? 1 : 0;
        const v01 = heightmap[idx01] >= level ? 1 : 0;
        const v11 = heightmap[idx11] >= level ? 1 : 0;

        const caseIndex = v00 | (v10 << 1) | (v01 << 2) | (v11 << 3);

        if (caseIndex === 0 || caseIndex === 15) continue;

        // Calculate interpolated edge positions
        const h00 = heightmap[idx00];
        const h10 = heightmap[idx10];
        const h01 = heightmap[idx01];
        const h11 = heightmap[idx11];

        const points = [];

        // Top edge
        if ((v00 !== v10)) {
          const t = (level - h00) / (h10 - h00);
          points.push({ x: x + t, y: y });
        }
        // Right edge
        if ((v10 !== v11)) {
          const t = (level - h10) / (h11 - h10);
          points.push({ x: x + 1, y: y + t });
        }
        // Bottom edge
        if ((v01 !== v11)) {
          const t = (level - h01) / (h11 - h01);
          points.push({ x: x + t, y: y + 1 });
        }
        // Left edge
        if ((v00 !== v01)) {
          const t = (level - h00) / (h01 - h00);
          points.push({ x: x, y: y + t });
        }

        // Draw line segments
        if (points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.stroke();

          // Handle saddle points (cases 5 and 10)
          if (points.length === 4) {
            ctx.beginPath();
            ctx.moveTo(points[2].x, points[2].y);
            ctx.lineTo(points[3].x, points[3].y);
            ctx.stroke();
          }
        }
      }
    }
  }

  // Draw coastline (thicker)
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 1.5;

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const idx00 = y * width + x;
      const idx10 = y * width + (x + 1);
      const idx01 = (y + 1) * width + x;
      const idx11 = (y + 1) * width + (x + 1);

      const v00 = heightmap[idx00] >= sl ? 1 : 0;
      const v10 = heightmap[idx10] >= sl ? 1 : 0;
      const v01 = heightmap[idx01] >= sl ? 1 : 0;
      const v11 = heightmap[idx11] >= sl ? 1 : 0;

      const caseIndex = v00 | (v10 << 1) | (v01 << 2) | (v11 << 3);

      if (caseIndex === 0 || caseIndex === 15) continue;

      const h00 = heightmap[idx00];
      const h10 = heightmap[idx10];
      const h01 = heightmap[idx01];
      const h11 = heightmap[idx11];

      const points = [];

      if ((v00 !== v10)) {
        const t = (sl - h00) / (h10 - h00);
        points.push({ x: x + t, y: y });
      }
      if ((v10 !== v11)) {
        const t = (sl - h10) / (h11 - h10);
        points.push({ x: x + 1, y: y + t });
      }
      if ((v01 !== v11)) {
        const t = (sl - h01) / (h11 - h01);
        points.push({ x: x + t, y: y + 1 });
      }
      if ((v00 !== v01)) {
        const t = (sl - h00) / (h01 - h00);
        points.push({ x: x, y: y + t });
      }

      if (points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.stroke();

        if (points.length === 4) {
          ctx.beginPath();
          ctx.moveTo(points[2].x, points[2].y);
          ctx.lineTo(points[3].x, points[3].y);
          ctx.stroke();
        }
      }
    }
  }
}

// Render 3D relief view
export function renderRelief(canvas, heightmap, params, colors) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const { seaLevel } = params;

  // Clear canvas with background
  ctx.fillStyle = '#0c0e12';
  ctx.fillRect(0, 0, width, height);

  // Calculate heightmap dimensions (assuming square)
  const mapSize = Math.sqrt(heightmap.length);
  const heightScale = 80; // Vertical exaggeration
  const sl = seaLevel / 100;

  // Scale and offset for centering
  const tileWidth = width / mapSize;
  const tileHeight = tileWidth * 0.5; // Isometric ratio

  const offsetX = width / 2;
  const offsetY = height * 0.3;

  // Sample at lower resolution for performance
  const step = Math.max(1, Math.floor(mapSize / 200));

  // Draw from back to front (y from 0 to mapSize)
  for (let y = 0; y < mapSize; y += step) {
    for (let x = 0; x < mapSize; x += step) {
      const idx = y * mapSize + x;
      let elevation = heightmap[idx];

      // Clamp water to sea level for flat water surface
      const isWater = elevation < sl;
      if (isWater) {
        elevation = sl * 0.95;
      }

      const color = getColorForElevation(heightmap[idx], seaLevel, colors);

      // Isometric projection
      const isoX = (x - y) * (tileWidth * 0.5) / step + offsetX;
      const isoY = (x + y) * (tileHeight * 0.5) / step - elevation * heightScale + offsetY;

      const columnHeight = elevation * heightScale;
      const columnWidth = tileWidth / step + 1;

      // Draw side face (darker)
      const sideColor = darkenColor(color, 0.3);
      ctx.fillStyle = `rgb(${sideColor.r}, ${sideColor.g}, ${sideColor.b})`;
      ctx.fillRect(isoX, isoY, columnWidth, columnHeight + 2);

      // Draw top face (lighter)
      const topColor = isWater ? color : lightenColor(color, 0.15);
      ctx.fillStyle = `rgb(${topColor.r}, ${topColor.g}, ${topColor.b})`;
      ctx.fillRect(isoX, isoY, columnWidth, step * 0.8);
    }
  }

  // Add subtle gradient overlay for atmosphere
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(12, 14, 18, 0.3)');
  gradient.addColorStop(0.5, 'rgba(12, 14, 18, 0)');
  gradient.addColorStop(1, 'rgba(12, 14, 18, 0.4)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export default {
  renderTopographic,
  renderRelief,
};
