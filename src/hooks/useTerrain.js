import { useState, useCallback, useRef, useEffect } from 'react';
import { generateAndRenderTerrain } from '../utils/terrain';
import { defaultParams } from '../data/presets';

export function useTerrain() {
  const [params, setParams] = useState(defaultParams);
  const [viewMode, setViewMode] = useState('topographic');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  // Generate terrain with debouncing
  const generateTerrain = useCallback(() => {
    if (!canvasRef.current) return;

    // Clear any pending generation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsGenerating(true);

    // Small delay to batch rapid changes
    timeoutRef.current = setTimeout(() => {
      rafRef.current = requestAnimationFrame(() => {
        generateAndRenderTerrain(canvasRef.current, params, viewMode);
        setIsGenerating(false);
      });
    }, 30);
  }, [params, viewMode]);

  // Update a single parameter
  const updateParam = useCallback((key, value) => {
    setParams(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update multiple parameters at once (for presets)
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
    }));
  }, []);

  // Generate new random seed
  const randomizeSeed = useCallback(() => {
    setParams(prev => ({
      ...prev,
      seed: Math.floor(Math.random() * 1000000000),
    }));
  }, []);

  // Set specific seed
  const setSeed = useCallback((seed) => {
    const numSeed = parseInt(seed, 10);
    if (!isNaN(numSeed)) {
      setParams(prev => ({
        ...prev,
        seed: numSeed,
      }));
    }
  }, []);

  // Regenerate when params or view mode change
  useEffect(() => {
    generateTerrain();
  }, [generateTerrain]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    params,
    viewMode,
    isGenerating,
    canvasRef,
    setViewMode,
    updateParam,
    updateParams,
    randomizeSeed,
    setSeed,
    generateTerrain,
  };
}

export default useTerrain;
