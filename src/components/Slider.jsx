import { useMemo } from 'react';

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
}) {
  const displayValue = useMemo(() => {
    if (formatValue) {
      return formatValue(value);
    }
    // Default formatting based on step
    if (step < 1) {
      return value.toFixed(2);
    }
    return Math.round(value);
  }, [value, step, formatValue]);

  const fillPercent = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="control-group">
      <div className="control-label">
        <span className="control-label-text">{label}</span>
        <span className="control-label-value">{displayValue}</span>
      </div>
      <input
        type="range"
        className="control-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${fillPercent}%, var(--bg-control) ${fillPercent}%, var(--bg-control) 100%)`,
        }}
      />
    </div>
  );
}

export default Slider;
