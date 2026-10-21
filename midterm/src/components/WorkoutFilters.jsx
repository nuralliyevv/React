function WorkoutFilters({
  category,
  difficulty,
  sortBy,
  onCategoryChange,
  onDifficultyChange,
  onSortChange,
  onReset
}) {
  return (
    <div className="filters-row">
      <select
        className="filter-select"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filter by category"
      >
        <option value="all">All categories</option>
        <option value="Chest">Chest</option>
        <option value="Back">Back</option>
        <option value="Legs">Legs</option>
        <option value="Arms">Arms</option>
        <option value="Shoulders">Shoulders</option>
        <option value="Core">Core</option>
        <option value="Cardio">Cardio</option>
      </select>

      <select
        className="filter-select"
        value={difficulty}
        onChange={(event) =>
          onDifficultyChange(event.target.value)
        }
        aria-label="Filter by difficulty"
      >
        <option value="all">All difficulties</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <select
        className="filter-select"
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value)}
        aria-label="Sort workouts"
      >
        <option value="title-asc">Name: A–Z</option>
        <option value="title-desc">Name: Z–A</option>
        <option value="duration-asc">Duration: shortest</option>
        <option value="duration-desc">Duration: longest</option>
        <option value="calories-asc">Calories: lowest</option>
        <option value="calories-desc">Calories: highest</option>
      </select>

      <button
        type="button"
        className="reset-filters"
        onClick={onReset}
      >
        Reset filters
      </button>
    </div>
  );
}

export default WorkoutFilters;