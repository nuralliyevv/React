import { useState } from "react";

function AddQuest({ onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Combat");
  const [difficulty, setDifficulty] = useState("Easy");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const newQuest = {
      id: Date.now(),
      title: title.trim(),
      category,
      difficulty,
      status: "Not Started",
      xp: difficulty === "Easy" ? 150 : difficulty === "Medium" ? 300 : 500,
    };

    onAdd(newQuest);

    setTitle("");
    setCategory("Combat");
    setDifficulty("Easy");
  };

  return (
    <form className="add-quest" onSubmit={handleSubmit}>
      <div className="form-title">
        <span>NEW QUEST</span>
        <h2>Create a Quest</h2>
      </div>

      <input
        type="text"
        placeholder="Quest title..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="Combat">Combat</option>
        <option value="Adventure">Adventure</option>
        <option value="Collection">Collection</option>
      </select>

      <select
        value={difficulty}
        onChange={(event) => setDifficulty(event.target.value)}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <button type="submit">
        + Add Quest
      </button>
    </form>
  );
}

export default AddQuest;