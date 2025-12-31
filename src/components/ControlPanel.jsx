import { useState, useCallback } from 'react';
import Slider from './Slider';
import PresetButton from './PresetButton';
import SeedDisplay from './SeedDisplay';
import { presets } from '../data/presets';
import { exportTerrainPNG } from '../utils/terrain';

function ControlPanel({
  params,
  canvasRef,
  onParamChange,
  onPresetSelect,
  onRandomizeSeed,
  onSeedChange,
}) {
  const [activePreset, setActivePreset] = useState(null);

  const handlePresetClick = useCallback((presetKey) => {
    setActivePreset(presetKey);
    onPresetSelect(presets[presetKey]);
  }, [onPresetSelect]);

  const handleParamChange = useCallback((key, value) => {
    setActivePreset(null); // Clear preset when user modifies
    onParamChange(key, value);
  }, [onParamChange]);

  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      exportTerrainPNG(canvasRef.current, params.seed);
    }
  }, [canvasRef, params.seed]);

  return (
    <aside className="control-panel">
      {/* Terrain Shape Section */}
      <section className="control-section">
        <h2 className="control-section-title">Terrain</h2>

        <Slider
          label="Scale"
          value={params.scale}
          min={0.1}
          max={5}
          step={0.1}
          onChange={(v) => handleParamChange('scale', v)}
        />

        <Slider
          label="Octaves"
          value={params.octaves}
          min={1}
          max={8}
          step={1}
          onChange={(v) => handleParamChange('octaves', v)}
        />

        <Slider
          label="Persistence"
          value={params.persistence}
          min={0.1}
          max={1}
          step={0.05}
          onChange={(v) => handleParamChange('persistence', v)}
        />

        <Slider
          label="Lacunarity"
          value={params.lacunarity}
          min={1}
          max={4}
          step={0.1}
          onChange={(v) => handleParamChange('lacunarity', v)}
        />
      </section>

      {/* World Settings Section */}
      <section className="control-section">
        <h2 className="control-section-title">World</h2>

        <Slider
          label="Sea Level"
          value={params.seaLevel}
          min={0}
          max={100}
          step={1}
          formatValue={(v) => `${Math.round(v)}%`}
          onChange={(v) => handleParamChange('seaLevel', v)}
        />

        <Slider
          label="Mountain Height"
          value={params.mountainHeight}
          min={0}
          max={100}
          step={1}
          formatValue={(v) => `${Math.round(v)}%`}
          onChange={(v) => handleParamChange('mountainHeight', v)}
        />

        <Slider
          label="Erosion"
          value={params.erosion}
          min={0}
          max={100}
          step={1}
          formatValue={(v) => `${Math.round(v)}%`}
          onChange={(v) => handleParamChange('erosion', v)}
        />
      </section>

      {/* Biome Section */}
      <section className="control-section">
        <h2 className="control-section-title">Biome</h2>

        <Slider
          label="Temperature"
          value={params.temperature}
          min={0}
          max={100}
          step={1}
          formatValue={(v) => {
            if (v < 30) return 'Cold';
            if (v < 50) return 'Cool';
            if (v < 70) return 'Warm';
            return 'Hot';
          }}
          onChange={(v) => handleParamChange('temperature', v)}
        />

        <Slider
          label="Moisture"
          value={params.moisture}
          min={0}
          max={100}
          step={1}
          formatValue={(v) => {
            if (v < 30) return 'Arid';
            if (v < 50) return 'Dry';
            if (v < 70) return 'Moist';
            return 'Lush';
          }}
          onChange={(v) => handleParamChange('moisture', v)}
        />
      </section>

      {/* Presets Section */}
      <section className="control-section">
        <h2 className="control-section-title">Presets</h2>
        <div className="presets-row">
          {Object.entries(presets).map(([key, preset]) => (
            <PresetButton
              key={key}
              name={preset.name}
              isActive={activePreset === key}
              onClick={() => handlePresetClick(key)}
            />
          ))}
        </div>
      </section>

      {/* Seed Display */}
      <SeedDisplay
        seed={params.seed}
        onRandomize={onRandomizeSeed}
        onSeedChange={onSeedChange}
      />

      {/* Download Button */}
      <button className="download-btn" onClick={handleDownload}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PNG
      </button>
    </aside>
  );
}

export default ControlPanel;
