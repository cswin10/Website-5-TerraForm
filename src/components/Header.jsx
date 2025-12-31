function Header({ viewMode, onViewModeChange }) {
  return (
    <header className="header">
      <h1 className="logo">Terraform</h1>
      <div className="view-toggle">
        <button
          className={`view-btn ${viewMode === 'topographic' ? 'active' : ''}`}
          onClick={() => onViewModeChange('topographic')}
        >
          Topo
        </button>
        <button
          className={`view-btn ${viewMode === 'relief' ? 'active' : ''}`}
          onClick={() => onViewModeChange('relief')}
        >
          Relief
        </button>
      </div>
    </header>
  );
}

export default Header;
