function PresetButton({ name, isActive, onClick }) {
  return (
    <button
      className={`preset-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
}

export default PresetButton;
