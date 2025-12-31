import Header from './components/Header';
import TerrainCanvas from './components/TerrainCanvas';
import ControlPanel from './components/ControlPanel';
import { useTerrain } from './hooks/useTerrain';
import './styles/global.css';

function App() {
  const {
    params,
    viewMode,
    isGenerating,
    canvasRef,
    setViewMode,
    updateParam,
    updateParams,
    randomizeSeed,
    setSeed,
  } = useTerrain();

  return (
    <div className="app">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <TerrainCanvas
        canvasRef={canvasRef}
        isGenerating={isGenerating}
      />

      <ControlPanel
        params={params}
        canvasRef={canvasRef}
        onParamChange={updateParam}
        onPresetSelect={updateParams}
        onRandomizeSeed={randomizeSeed}
        onSeedChange={setSeed}
      />
    </div>
  );
}

export default App;
