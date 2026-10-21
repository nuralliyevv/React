import { generateWorkouts } from "../data/workouts";

const STORAGE_KEY = "fittrack-workouts";

function delay(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readWorkouts() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData !== null) {
    return JSON.parse(savedData);
  }

  const initialWorkouts = generateWorkouts();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialWorkouts)
  );

  return initialWorkouts;
}

function saveWorkouts(workouts) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(workouts)
  );
}

export async function getWorkouts() {
  await delay();

  return readWorkouts();
}

export async function getWorkoutById(id) {
  await delay();

  const workouts = readWorkouts();

  return workouts.find((workout) => workout.id === id) ?? null;
}

export async function addWorkout(workoutData) {
  await delay();

  const workouts = readWorkouts();

  const newWorkout = {
    ...workoutData,
    id: crypto.randomUUID()
  };

  const updatedWorkouts = [newWorkout, ...workouts];

  saveWorkouts(updatedWorkouts);

  return newWorkout;
}