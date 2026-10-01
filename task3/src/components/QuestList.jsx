import QuestCard from "./QuestCard";

function QuestList({
  quests,
  filter,
  onDelete,
  onStatusChange,
  resetKeys,
  onResetState,
}) {
  return (
    <div className="quest-list">
      {quests.map((quest) => (
        <QuestCard
          key={`${quest.id}-${resetKeys[quest.id] || 0}`}
          quest={quest}
          visible={filter === "All" || quest.category === filter}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          resetKey={resetKeys[quest.id] || 0}
          onResetState={onResetState}
        />
      ))}
    </div>
  );
}

export default QuestList;