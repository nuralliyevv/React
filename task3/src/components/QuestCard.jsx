import { useState } from "react";

function QuestCard({
  quest,
  visible,
  onDelete,
  onStatusChange,
  resetKey,
  onResetState,
}) {
  const [progress, setProgress] = useState(0);

  console.log("QuestCard rendered:", quest.title);

  return (
    <div className={`quest-card ${visible ? "" : "hidden"}`}>
      <div className="quest-info">
        <span className="quest-category">{quest.category}</span>

        <h3>{quest.title}</h3>

        <p>
          Difficulty: <strong>{quest.difficulty}</strong>
        </p>

        <p>
          Status: <strong>{quest.status}</strong>
        </p>

        <p>
          XP: <strong>{quest.xp}</strong>
        </p>
      </div>

      <div className="quest-progress">
        <div className="progress-header">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="quest-actions">
          <button
            onClick={() => setProgress(Math.min(progress + 10, 100))}
          >
            +10%
          </button>

          <button onClick={() => setProgress(0)}>
            Reset
          </button>

          <button onClick={() => onStatusChange(quest.id)}>
            Change Status
          </button>

          <button onClick={() => onResetState(quest.id)}>
            Reset State
          </button>

          <button onClick={() => onDelete(quest.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestCard;