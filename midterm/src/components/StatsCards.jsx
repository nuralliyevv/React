function StatsCards({ workouts }) {
  const totalWorkouts = workouts.length;

  const uniqueCategories = new Set(
    workouts.map((workout) => workout.category)
  ).size;

  const totalMinutes = workouts.reduce(
    (total, workout) => total + workout.duration,
    0
  );

  const stats = [
    {
      label: "Total Workouts",
      value: totalWorkouts,
      icon: "💪"
    },
    {
      label: "Categories",
      value: uniqueCategories,
      icon: "🎯"
    },
    {
      label: "Total Minutes",
      value: totalMinutes.toLocaleString(),
      icon: "⏱️"
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <span className="stat-card-icon" aria-hidden="true">
            {stat.icon}
          </span>

          <p className="stat-card-label">{stat.label}</p>

          <p className="stat-card-value">
            {stat.value}
          </p>
        </article>
      ))}
    </div>
  );
}

export default StatsCards;