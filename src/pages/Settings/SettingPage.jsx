import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Layout/SideBar";
import { API } from "../../services/Api";

export default function SettingsPage() {
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API.projects, config);

      setProjects(response.data);
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // FETCH TASKS
  const fetchTasks = async (projectId) => {
    try {
      const response = await axios.get(
        `${API.tasks}/project/${projectId}`,
        config,
      );

      setTasks(response.data.tasks);

      setExpandedProject(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE PROJECT
  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Deleting this project will also delete all related tasks.",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API.projects}/${projectId}`, config);

      setProjects((prev) =>
        prev.filter((project) => project._id !== projectId),
      );

      if (expandedProject === projectId) {
        setExpandedProject(null);
        setTasks([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE TASK
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API.tasks}/${taskId}`, config);

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading projects...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          paddingLeft: "320px",
          paddingTop: "30px",
          paddingRight: "40px",
          paddingBottom: "40px",
          marginLeft: "2rem",
        }}
      >
        <div className="mb-4">
          <h1
            style={{
              color: "#0f172a",
              fontSize: "32px",
            }}
          >
            Settings
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "8px",
              fontSize: "15px",
            }}
          >
            Manage projects and tasks from your workspace.
          </p>
        </div>

        {/* MAIN CARD */}
        <div
          className="card border-0"
          style={{
            borderRadius: "24px",
            background: "#ffffff",
            padding: "35px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            maxWidth: "1200px",
          }}
        >
          {/* TOP HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3
                style={{
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "6px",
                }}
              >
                Project Management
              </h3>

              <p
                style={{
                  color: "#64748b",
                  marginBottom: "0",
                }}
              >
                Delete projects or individual tasks.
              </p>
            </div>

            <div
              style={{
                background: "#eef2ff",
                color: "#4338ca",
                padding: "10px 18px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {projects.length} Projects
            </div>
          </div>

          {/* PROJECTS */}
          <div className="d-flex flex-column gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: "#fafafa",
                }}
              >
                {/* PROJECT HEADER */}
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    padding: "22px",
                  }}
                >
                  <div style={{ maxWidth: "70%" }}>
                    <h5
                      style={{
                        fontWeight: "700",
                        marginBottom: "8px",
                        color: "#111827",
                      }}
                    >
                      {project.name}
                    </h5>

                    <p
                      style={{
                        color: "#6b7280",
                        marginBottom: "0",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="d-flex gap-3">
                    <button
                      className="btn"
                      onClick={() => {
                        if (expandedProject === project._id) {
                          setExpandedProject(null);
                          setTasks([]);
                        } else {
                          fetchTasks(project._id);
                        }
                      }}
                      style={{
                        background: "#e0e7ff",
                        color: "#3730a3",
                        borderRadius: "10px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        border: "none",
                      }}
                    >
                      {expandedProject === project._id
                        ? "Hide Tasks"
                        : "View Tasks"}
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProject(project._id)}
                      style={{
                        borderRadius: "10px",
                        padding: "8px 16px",
                        fontSize: "14px",
                      }}
                    >
                      Delete Project
                    </button>
                  </div>
                </div>

                {/* TASKS */}
                {expandedProject === project._id && (
                  <div
                    style={{
                      padding: "20px",
                      background: "#ffffff",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <h6
                      style={{
                        fontWeight: "600",
                        marginBottom: "18px",
                        color: "#111827",
                      }}
                    >
                      Project Tasks
                    </h6>

                    {tasks.length > 0 ? (
                      <div className="d-flex flex-column gap-3">
                        {tasks.map((task) => (
                          <div
                            key={task._id}
                            className="d-flex justify-content-between align-items-center"
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: "14px",
                              padding: "18px",
                              background: "#f9fafb",
                            }}
                          >
                            <div>
                              <h6
                                style={{
                                  fontWeight: "600",
                                  marginBottom: "6px",
                                  color: "#111827",
                                }}
                              >
                                {task.name}
                              </h6>

                              <p
                                style={{
                                  marginBottom: "0",
                                  color: "#6b7280",
                                  fontSize: "14px",
                                }}
                              >
                                Status: {task.status}
                              </p>
                            </div>

                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteTask(task._id)}
                              style={{
                                borderRadius: "10px",
                                padding: "8px 14px",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              Delete Task
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        style={{
                          color: "#6b7280",
                          marginBottom: "0",
                        }}
                      >
                        No tasks available for this project.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
