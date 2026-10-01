import { useState } from "react";
import "../App.css";
import QuestList from "./QuestList";
import AddQuest from "./AddQuest";

function Dashboard() {
  const [quests, setQuests] = useState([
    {
      id: 1,
      title: "Defeat the Shadow Dragon",
      category: "Combat",
      difficulty: "Hard",
      status: "In Progress",
      xp: 500,
    },
    {
      id: 2,
      title: "Find the Lost Artifact",
      category: "Adventure",
      difficulty: "Medium",
      status: "Not Started",
      xp: 300,
    },
    {
      id: 3,
      title: "Collect 50 Herbs",
      category: "Collection",
      difficulty: "Easy",
      status: "Completed",
      xp: 150,
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [reversed, setReversed] = useState(false);
  const [resetKeys, setResetKeys] = useState({});

  // ADD QUEST
  const addQuest = (newQuest) => {
  setQuests((currentQuests) => [
    ...currentQuests,
    newQuest,
  ]);
};

  // DELETE QUEST
  const deleteQuest = (id) => {
    setQuests((currentQuests) =>
      currentQuests.filter((quest) => quest.id !== id)
    );
  };

  // CHANGE STATUS
  const changeStatus = (id) => {
    setQuests((currentQuests) =>
      currentQuests.map((quest) => {
        if (quest.id !== id) {
          return quest;
        }

        const nextStatus = {
          "Not Started": "In Progress",
          "In Progress": "Completed",
          Completed: "Not Started",
        };

        return {
          ...quest,
          status: nextStatus[quest.status],
        };
      })
    );
  };

  // RESET STATE
  const resetQuestState = (id) => {
  setResetKeys((currentKeys) => ({
    ...currentKeys,
    [id]: (currentKeys[id] || 0) + 1,
  }));
};

  const displayedQuests = reversed
    ? [...quests].reverse()
    : quests;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">QUEST CONTROL CENTER</p>

          <h1>Game Quest Dashboard</h1>

          <p className="subtitle">
            Track your quests, progress and rewards.
          </p>
        </div>

        <div className="player-card">
          <span>PLAYER</span>
          <strong>Miras</strong>
        </div>
      </header>

      <main>
        <AddQuest onAdd={addQuest} />
        <div className="section-header">
          <div>
            <h2>Active Quests</h2>

            <p>
              {quests.filter(
                (quest) =>
                  filter === "All" ||
                  quest.category === filter
              ).length}{" "}
              quests displayed
            </p>
          </div>

          <div className="controls">
            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >
              <option value="All">All Categories</option>
              <option value="Combat">Combat</option>
              <option value="Adventure">Adventure</option>
              <option value="Collection">Collection</option>
            </select>

            <button
              onClick={() => setReversed(!reversed)}
            >
              {reversed
                ? "Normal Order"
                : "Reverse Order"}
            </button>
          </div>
        </div>

        <QuestList
            quests={displayedQuests}
            filter={filter}
            onDelete={deleteQuest}
            onStatusChange={changeStatus}
            resetKeys={resetKeys}
            onResetState={resetQuestState}
        />
      </main>
    </div>
  );
}

export default Dashboard;