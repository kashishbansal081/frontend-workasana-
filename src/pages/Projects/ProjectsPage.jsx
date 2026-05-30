import SideBar from "../../components/Layout/SideBar";
import useFetch from "../../useFetch/useFetch";
import { Link } from "react-router-dom";
import { API } from "../../services/Api";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./Project.css";

export default function ProjectsPage() {
  const { setAddProjectModalOpen } = useContext(AppContext);

  const { data: projects } = useFetch(API.projects);

  return (
    <div className="container-fluid projects-page">
      <div className="row">
        <div className="col-12 col-md-3 p-0">
          <SideBar />
        </div>

        <div className="col-12 col-md-9 projects-content">
          <div className="projects-header">
            <div>
              <h2 className="projects-title">Projects</h2>

              <p className="projects-subtitle">
                Manage and track all your projects
              </p>
            </div>

            <button
              className="btn btn-primary projects-btn"
              onClick={() => setAddProjectModalOpen(true)}
            >
              + New Project
            </button>
          </div>

          <div className="row g-4 mt-1">
            {!projects ? (
              <p className="text-muted">
                Loading projects...
              </p>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <div className="col-12" key={project._id}>
                  <Link
                    to={`/project/${project._id}`}
                    className="text-decoration-none"
                  >
                    <div className="card border-0 shadow-sm project-list-card">
                      <div className="project-card-content">
                        <div className="project-info">
                          <h4 className="project-name">
                            {project.name}
                          </h4>

                          <p className="project-description">
                            {project.description}
                          </p>

                          <div className="project-meta">
                            <span
                              className={`badge ${
                                project.status === "Completed"
                                  ? "bg-success"
                                  : project.status === "In Progress"
                                  ? "bg-primary"
                                  : project.status === "Blocked"
                                  ? "bg-danger"
                                  : "bg-secondary"
                              }`}
                            >
                              {project.status}
                            </span>

                            <span className="project-date">
                              Created:{" "}
                              {new Date(
                                project.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-muted">
                No projects found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}