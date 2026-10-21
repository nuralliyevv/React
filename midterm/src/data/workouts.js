const exercises = [
  {
    title: "Bench Press",
    category: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell",
    muscles: "Chest, Triceps",
    duration: 20,
    calories: 120,
    description: "A compound exercise for developing chest strength."
  },
  {
    title: "Push-Ups",
    category: "Chest",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    muscles: "Chest, Shoulders, Triceps",
    duration: 15,
    calories: 80,
    description: "A bodyweight exercise for upper body strength."
  },
  {
    title: "Incline Dumbbell Press",
    category: "Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    muscles: "Upper Chest, Shoulders",
    duration: 20,
    calories: 110,
    description: "Targets the upper chest using an inclined bench."
  },
  {
    title: "Pull-Ups",
    category: "Back",
    difficulty: "Advanced",
    equipment: "Pull-Up Bar",
    muscles: "Back, Biceps",
    duration: 15,
    calories: 100,
    description: "A bodyweight exercise for back and arm strength."
  },
  {
    title: "Lat Pulldown",
    category: "Back",
    difficulty: "Beginner",
    equipment: "Machine",
    muscles: "Lats, Biceps",
    duration: 20,
    calories: 90,
    description: "A machine exercise for developing back muscles."
  },
  {
    title: "Barbell Squat",
    category: "Legs",
    difficulty: "Advanced",
    equipment: "Barbell",
    muscles: "Quadriceps, Glutes",
    duration: 25,
    calories: 160,
    description: "A compound lower body exercise for strength."
  },
  {
    title: "Lunges",
    category: "Legs",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    muscles: "Quadriceps, Glutes",
    duration: 15,
    calories: 90,
    description: "A unilateral exercise for leg strength and balance."
  },
  {
    title: "Romanian Deadlift",
    category: "Legs",
    difficulty: "Intermediate",
    equipment: "Barbell",
    muscles: "Hamstrings, Glutes",
    duration: 20,
    calories: 130,
    description: "A hip-hinge exercise targeting the posterior chain."
  },
  {
    title: "Bicep Curls",
    category: "Arms",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    muscles: "Biceps",
    duration: 12,
    calories: 55,
    description: "An isolation exercise for building biceps."
  },
  {
    title: "Triceps Pushdown",
    category: "Arms",
    difficulty: "Intermediate",
    equipment: "Cable Machine",
    muscles: "Triceps",
    duration: 12,
    calories: 60,
    description: "An isolation exercise targeting the triceps."
  },
  {
    title: "Shoulder Press",
    category: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Dumbbells",
    muscles: "Shoulders, Triceps",
    duration: 18,
    calories: 95,
    description: "A pressing movement for shoulder strength."
  },
  {
    title: "Lateral Raises",
    category: "Shoulders",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    muscles: "Side Deltoids",
    duration: 12,
    calories: 50,
    description: "An isolation exercise for the side deltoids."
  },
  {
    title: "Plank",
    category: "Core",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    muscles: "Abdominals, Core",
    duration: 5,
    calories: 25,
    description: "An isometric exercise for core stability."
  },
  {
    title: "Hanging Leg Raises",
    category: "Core",
    difficulty: "Advanced",
    equipment: "Pull-Up Bar",
    muscles: "Abdominals, Hip Flexors",
    duration: 12,
    calories: 70,
    description: "A core exercise performed while hanging from a bar."
  },
  {
    title: "Jump Rope",
    category: "Cardio",
    difficulty: "Intermediate",
    equipment: "Jump Rope",
    muscles: "Full Body",
    duration: 15,
    calories: 150,
    description: "A cardio exercise that improves endurance and coordination."
  },
  {
    title: "Burpees",
    category: "Cardio",
    difficulty: "Advanced",
    equipment: "Bodyweight",
    muscles: "Full Body",
    duration: 10,
    calories: 130,
    description: "A full-body exercise combining strength and cardio."
  },
  {
    title: "Walking",
    category: "Cardio",
    difficulty: "Beginner",
    equipment: "None",
    muscles: "Legs, Cardiovascular System",
    duration: 30,
    calories: 120,
    description: "A low-impact activity for general cardiovascular health."
  },
  {
    title: "Mountain Climbers",
    category: "Cardio",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    muscles: "Core, Shoulders, Legs",
    duration: 10,
    calories: 100,
    description: "A dynamic exercise combining core work and cardio."
  }
];

export function generateWorkouts() {
  const workouts = [];

  for (let i = 0; i < 120; i++) {
    const exercise = exercises[i % exercises.length];

    const variation = Math.floor(i / exercises.length);

    workouts.push({
      ...exercise,
      id: `workout-${i + 1}`,
      title:
        variation === 0
          ? exercise.title
          : `${exercise.title} Variation ${variation + 1}`,
      duration: exercise.duration + (variation % 3) * 5,
      calories: exercise.calories + (variation % 4) * 10
    });
  }

  return workouts;
}