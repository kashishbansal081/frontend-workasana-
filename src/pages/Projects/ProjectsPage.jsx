import SideBar from "../../components/Layout/SideBar";
import useFetch from "../../useFetch/useFetch";
import { Link } from "react-router-dom";
import {API} from "../../services/Api";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function ProjectsPage() {
  const { setAddProjectModalOpen, addProjectModalOpen } = useContext(AppContext);
  const { data: projects } = useFetch(
    API.projects
  );

  return (
    <div className="container-fluid">
      <div className="row">
        
        <div className="col-md-3 p-0">
         <SideBar/>
        </div>

        <div className="col-md-9 p-4 ps-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 >Projects</h2>
              <p className="text-muted mb-0">
                Manage and track all your projects
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setAddProjectModalOpen(true)}
            >
              + New Project
            </button>
          </div>

          {/* Projects List */}
          <div className="row g-4">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div className="col-12" key={project._id}>
                  <Link
                    to={`/project/${project._id}`}
                    className="text-decoration-none"
                  >
                    <div className="card shadow-sm border-0 project-card p-3">
                      
                      <div className="d-flex justify-content-between align-items-start">
                        
                        <div>
                          <h4 className="fw-bold text-dark">
                            {project.name}
                          </h4>

                          <p className="text-muted mb-3">
                            {project.description}
                          </p>

                          <div className="d-flex gap-3 flex-wrap">
                            
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

                            <span className="text-muted small">
                              Created:{" "}
                              {new Date(
                                project.createdAt
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