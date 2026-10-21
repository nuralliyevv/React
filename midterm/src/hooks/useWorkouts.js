import { useCallback, useEffect, useState } from "react";
import { getWorkouts } from "../api/workoutApi";

export function useWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkouts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load workouts."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getWorkouts();

        if (active) {
          setWorkouts(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load workouts."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const addWorkoutToState = (workout) => {
    setWorkouts((currentWorkouts) => [
      workout,
      ...currentWorkouts
    ]);
  };

  return {
    workouts,
    setWorkouts,
    loading,
    error,
    loadWorkouts,
    addWorkoutToState
  };
}