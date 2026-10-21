function getCategoryIcon(category) {
  const icons = {
    Chest: "🏋️",
    Back: "💪",
    Legs: "🦵",
    Arms: "💪",
    Shoulders: "🤸",
    Core: "🔥",
    Cardio: "🏃"
  };

  return icons[category] || "🏋️";
}

function WorkoutCard({ workout, onSelect }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(workout);
    }
  }

  return (
    <article
      className="workout-card"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${workout.title}`}
      onClick={() => onSelect(workout)}
      onKeyDown={handleKeyDown}
    >
      <div className="workout-card-header">
        <span className="workout-card-icon" aria-hidden="true">
          {getCategoryIcon(workout.category)}
        </span>

        <span className="workout-category">
          {workout.category}
        </span>
      </div>

      <div className="workout-card-body">
        <h3>{workout.title}</h3>

        <p className="workout-card-description">
          {workout.description ||
            "No description available for this workout."}
        </p>

        <div className="workout-card-meta">
          <span className="workout-meta-item">
            ⏱️ {workout.duration} min
          </span>

          <span className="workout-meta-item">
            🔥 {workout.calories} kcal
          </span>

          <span className="workout-meta-item">
            ⚡ {workout.difficulty}
          </span>
        </div>

        <div className="workout-card-footer">
          <span className="workout-muscles">
            {workout.muscles}
          </span>

          <span className="workout-view-link">
            View details →
          </span>
        </div>
      </div>
    </article>
  );
}

export default WorkoutCard;