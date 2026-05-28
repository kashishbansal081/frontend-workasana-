const statusConfig = {
  "To Do": { bg: "#E6F1FB", color: "#185FA5" },
  "In Progress": { bg: "#FAEEDA", color: "#854F0B" },
  "Completed": { bg: "#EAF3DE", color: "#3B6D11" },
  "Blocked": { bg: "#FCEBEB", color: "#A32D2D" },
};

export default function ProjectCard({ project }) {
  const badge = statusConfig[project.status] ?? statusConfig["To Do"];

  return (
    <div className="card mb-3 bg-light border-0 shadow-sm py-2 ps-1 project-card">
      <div className="card-body d-flex flex-column justify-content-between h-100">
        
        <h5 className="fw-bold">
          {project.name}
        </h5>

        <p className="text-muted project-description">
          {project.description}
        </p>

        <div>
          <small
            className="project-badge"
            style={{
              background: badge.bg,
              color: badge.color,
            }}
          >
            {project.status}
          </small>
        </div>

      </div>
    </div>
  );
}