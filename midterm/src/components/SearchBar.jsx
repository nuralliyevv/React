function SearchBar({ value, onChange }) {
  function handleChange(event) {
    onChange(event.target.value);
  }

  function handleClear() {
    onChange("");
  }

  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>

      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search workouts, muscles, categories..."
        aria-label="Search workouts"
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;