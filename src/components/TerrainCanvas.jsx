import { useEffect, useRef } from 'react';

function TerrainCanvas({ canvasRef, isGenerating }) {
  const containerRef = useRef(null);

  // Set canvas size based on container
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const canvas = canvasRef.current;

      // Calculate size maintaining aspect ratio
      const containerWidth = container.clientWidth * 0.9;
      const containerHeight = container.clientHeight * 0.9;

      const size = Math.min(containerWidth, containerHeight, 800);

      canvas.width = size;
      canvas.height = size;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasRef]);

  return (
    <div className="canvas-container" ref={containerRef}>
      <canvas ref={canvasRef} className="terrain-canvas" />
      {isGenerating && (
        <div className="canvas-loading">
          <div className="canvas-loading-spinner" />
          <span>Generating terrain...</span>
        </div>
      )}
    </div>
  );
}

export default TerrainCanvas;
