import { useState } from "react";

const initialForm = {
  title: "",
  category: "Chest",
  difficulty: "Beginner",
  equipment: "None",
  muscles: "",
  duration: 30,
  calories: 200,
  description: ""
};

function WorkoutForm({ onSubmit, onCancel, submitting }) {
  const [formData, setFormData] = useState(initialForm);
  const [validationError, setValidationError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (!formData.title.trim() || !formData.muscles.trim()) {
      setValidationError(
        "Please fill in all required fields."
      );
      return;
    }

    const duration = Number(formData.duration);
    const calories = Number(formData.calories);

    if (
      !Number.isFinite(duration) ||
      duration < 1 ||
      duration > 600 ||
      !Number.isFinite(calories) ||
      calories < 0 ||
      calories > 10000
    ) {
      setValidationError(
        "Enter a valid duration and calorie count."
      );
      return;
    }

    const workout = {
      ...formData,
      title: formData.title.trim(),
      equipment: formData.equipment.trim() || "None",
      muscles: formData.muscles.trim(),
      duration,
      calories,
      description: formData.description.trim()
    };

    try {
      await onSubmit(workout);
    } catch {
      setValidationError(
        "Failed to add workout. Please try again."
      );
    }
  }

  return (
    <div className="form-overlay" onClick={onCancel}>
      <section
        className="workout-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workout-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="form-heading">
          <div>
            <p className="eyebrow">CUSTOM WORKOUT</p>
            <h2 id="workout-form-title">
              Add a workout
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Close form"
            disabled={submitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Workout name *
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Dumbbell bench press"
              required
              maxLength={100}
            />
          </label>

          <div className="form-row">
            <label>
              Category
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Legs">Legs</option>
                <option value="Arms">Arms</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Core">Core</option>
                <option value="Cardio">Cardio</option>
              </select>
            </label>

            <label>
              Difficulty
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </label>
          </div>

          <label>
            Equipment
            <input
              type="text"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="e.g. Dumbbells"
              maxLength={100}
            />
          </label>

          <label>
            Target muscles *
            <input
              type="text"
              name="muscles"
              value={formData.muscles}
              onChange={handleChange}
              placeholder="e.g. Chest, triceps"
              required
              maxLength={150}
            />
          </label>

          <div className="form-row">
            <label>
              Duration (minutes)
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="600"
                required
              />
            </label>

            <label>
              Calories
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                min="0"
                max="10000"
                required
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe how to perform this workout..."
              rows={3}
              maxLength={500}
            />
          </label>

          {validationError && (
            <p className="form-error" role="alert">
              {validationError}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add workout"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default WorkoutForm;