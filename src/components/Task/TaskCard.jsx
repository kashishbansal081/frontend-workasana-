const statusConfig = {
  "To Do":       { bg: "#E6F1FB", color: "#185FA5" },
  "In Progress": { bg: "#FAEEDA", color: "#854F0B" },
  "Completed":   { bg: "#EAF3DE", color: "#3B6D11" },
  "Blocked":     { bg: "#FCEBEB", color: "#A32D2D" },
};

export default function TaskCard({ task }) {
  const badge = statusConfig[task.status] ?? statusConfig["To Do"];

  return (
    <div className="card mb-3 bg-light border-0 shadow-sm py-2 ps-1">
      <div className="card-body">
        <h5 className="card-title fw-bold">{task.name}</h5>
        <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
            {task.timetoComplete} {task.timetocomplete === 1 ? 'hour' : 'hours'} to complete
        </p>
        <p className="card-text">
          <small
            style={{
              background: badge.bg,
              color: badge.color,
              padding: "5px 10px",
              borderRadius: "999px",
              fontWeight: 500,
              fontSize: "0.78rem",
            }}
          >
            {task.owners.length > 0 ? task.owners[0].name : "Unassigned"}
          </small>
        </p>
      </div>
    </div>
  );
}