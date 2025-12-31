import { useState, useCallback } from 'react';

function SeedDisplay({ seed, onRandomize, onSeedChange }) {
  const [copied, setCopied] = useState(false);
  const [inputValue, setInputValue] = useState(String(seed));

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(String(seed));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [seed]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onSeedChange(numValue);
    } else {
      setInputValue(String(seed));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleRandomize = () => {
    onRandomize();
    setInputValue('');
  };

  // Update input when seed changes externally
  if (String(seed) !== inputValue && document.activeElement?.className !== 'seed-value') {
    setInputValue(String(seed));
  }

  return (
    <div className="seed-display">
      <span className="seed-label">Seed</span>
      <input
        type="text"
        className="seed-value"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder="Enter seed..."
      />
      <button
        className="seed-btn"
        onClick={handleRandomize}
        title="Random seed"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
      </button>
      <button
        className="seed-btn"
        onClick={handleCopy}
        title="Copy seed"
        style={{ position: 'relative' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span className={`copy-tooltip ${copied ? 'visible' : ''}`}>Copied!</span>
      </button>
    </div>
  );
}

export default SeedDisplay;
