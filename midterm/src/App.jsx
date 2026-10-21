import { useMemo, useState } from "react";
import { addWorkout } from "./api/workoutApi";
import { useWorkouts } from "./hooks/useWorkouts";

import StatsCards from "./components/StatsCards";
import WorkoutList from "./components/WorkoutList";
import SearchBar from "./components/SearchBar";
import WorkoutFilters from "./components/WorkoutFilters";
import Pagination from "./components/Pagination";
import WorkoutForm from "./components/WorkoutForm";

import "./App.css";

const PAGE_SIZE = 9;

function App() {
  const {
    workouts,
    loading,
    error,
    addWorkoutToState
  } = useWorkouts();

  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const filteredWorkouts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = workouts.filter((workout) => {
      const matchesSearch =
        workout.title.toLowerCase().includes(normalizedSearch) ||
        workout.muscles.toLowerCase().includes(normalizedSearch) ||
        workout.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        category === "all" || workout.category === category;

      const matchesDifficulty =
        difficulty === "all" || workout.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "title-desc":
          return b.title.localeCompare(a.title);

        case "duration-asc":
          return a.duration - b.duration;

        case "duration-desc":
          return b.duration - a.duration;

        case "calories-desc":
          return b.calories - a.calories;

        case "calories-asc":
          return a.calories - b.calories;

        case "title-asc":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [workouts, search, category, difficulty, sortBy]);

  const totalPages = Math.ceil(filteredWorkouts.length / PAGE_SIZE);

  const visibleWorkouts = filteredWorkouts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setDifficulty("all");
    setSortBy("title-asc");
    setCurrentPage(1);
  }

  function handleSearchChange(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setCurrentPage(1);
  }

  function handleDifficultyChange(value) {
    setDifficulty(value);
    setCurrentPage(1);
  }

  function handleSortChange(value) {
    setSortBy(value);
    setCurrentPage(1);
  }

  async function handleAddWorkout(formData) {
    setFormSubmitting(true);
    setFormError("");

    try {
      const newWorkout = await addWorkout(formData);

      addWorkoutToState(newWorkout);

      setShowWorkoutForm(false);
      resetFilters();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to add workout."
      );
    } finally {
      setFormSubmitting(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <a href="#" className="brand">
            <span className="brand-icon">F</span>
            <span>FitTrack</span>
          </a>

          <span className="header-label">WORKOUT LIBRARY</span>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">YOUR FITNESS JOURNEY</p>

            <h1>
              Train smarter.
              <br />
              <span>Get stronger.</span>
            </h1>

            <p className="hero-description">
              Discover workouts, build your routine, and track your
              progress with your personal exercise library.
            </p>

            <a href="#workout-catalog" className="hero-button">
              Explore workouts <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="hero-decoration" aria-hidden="true">
            <div className="hero-circle hero-circle-one" />
            <div className="hero-circle hero-circle-two" />
            <div className="hero-badge">
              <span>MOVE</span>
              <strong>BETTER</strong>
            </div>
          </div>
        </section>

        <section className="stats-section" aria-label="Workout statistics">
          <StatsCards workouts={workouts} />
        </section>

        <section id="workout-catalog" className="catalog-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR NEXT CHALLENGE</p>
              <h2>Workout library</h2>
              <p className="section-description">
                Explore exercises and find the right workout for your goals.
              </p>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setFormError("");
                setShowWorkoutForm(true);
              }}
            >
              + Add workout
            </button>
          </div>

          <div className="catalog-controls">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
            />

            <WorkoutFilters
              category={category}
              difficulty={difficulty}
              sortBy={sortBy}
              onCategoryChange={handleCategoryChange}
              onDifficultyChange={handleDifficultyChange}
              onSortChange={handleSortChange}
              onReset={resetFilters}
            />
          </div>

          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}

          {loading ? (
            <div className="status-message" role="status">
              <div className="loading-spinner" />
              <p>Loading workouts...</p>
            </div>
          ) : error ? (
            <div className="status-message error-state" role="alert">
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="results-heading">
                <p>
                  <strong>{filteredWorkouts.length}</strong>{" "}
                  {filteredWorkouts.length === 1 ? "workout" : "workouts"} found
                </p>

                {filteredWorkouts.length > 0 && (
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>

              <WorkoutList
                workouts={visibleWorkouts}
                onSelect={setSelectedWorkout}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <a href="#" className="brand footer-brand">
            <span className="brand-icon">F</span>
            <span>FitTrack</span>
          </a>

          <p>Build healthy habits, one workout at a time.</p>
        </div>
      </footer>

      {showWorkoutForm && (
        <WorkoutForm
          onSubmit={handleAddWorkout}
          onCancel={() => {
            if (!formSubmitting) {
              setShowWorkoutForm(false);
            }
          }}
          submitting={formSubmitting}
        />
      )}

      {selectedWorkout && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedWorkout(null)}
        >
          <section
            className="workout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedWorkout(null)}
              aria-label="Close workout details"
            >
              ×
            </button>

            <p className="eyebrow">{selectedWorkout.category}</p>

            <h2 id="workout-modal-title">
              {selectedWorkout.title}
            </h2>

            <div className="workout-modal-meta">
              <span>{selectedWorkout.difficulty}</span>
              <span>{selectedWorkout.duration} min</span>
              <span>{selectedWorkout.calories} kcal</span>
            </div>

            <div className="modal-detail">
              <h3>Target muscles</h3>
              <p>{selectedWorkout.muscles}</p>
            </div>

            <div className="modal-detail">
              <h3>Equipment</h3>
              <p>{selectedWorkout.equipment}</p>
            </div>

            <div className="modal-detail">
              <h3>Description</h3>
              <p>
                {selectedWorkout.description ||
                  "No description provided for this workout."}
              </p>
            </div>

            <button
              type="button"
              className="primary-button modal-done"
              onClick={() => setSelectedWorkout(null)}
            >
              Got it
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;