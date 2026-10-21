import WorkoutCard from "./WorkoutCard";

function WorkoutList({ workouts, onSelect }) {
  if (workouts.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon" aria-hidden="true">
          🔎
        </span>

        <h3>No workouts found</h3>

        <p>
          Try changing your search or filters to find a workout.
        </p>
      </div>
    );
  }

  return (
    <div className="workout-grid">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default WorkoutList;