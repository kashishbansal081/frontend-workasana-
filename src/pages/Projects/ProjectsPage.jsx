import SideBar from "../../components/Layout/SideBar";
import useFetch from "../../useFetch/useFetch";
import { Link } from "react-router-dom";
import { API } from "../../services/Api";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./Project.css";

export default function ProjectsPage() {
  const { setAddProjectModalOpen, refersh } = useContext(AppContext);

  const { data: projects, loading: projectsLoading } = useFetch(API.projects, refersh);

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
            {projectsLoading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : !projects || projects.length === 0 ? (
              <p className="text-muted">No projects found.</p>
            ) : (
              projects.map((project) => (
                <div className="col-12" key={project._id}>
                  <Link
                    to={`/project/${project._id}`}
                    className="text-decoration-none"
                  >
                    <div className="card border-0 shadow-sm project-list-card">
                      <div className="project-card-content">
                        <div className="project-info">
                          <h4 className="project-name">{project.name}</h4>

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
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
