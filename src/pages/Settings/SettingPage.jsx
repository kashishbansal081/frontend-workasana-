import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Layout/SideBar";
import { API } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import "./Setting.css";

export default function SettingsPage() {
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // REUSABLE MODAL
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    action: null,
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchProjects();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDeleteProject = async (projectId) => {
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

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API.tasks}/${taskId}`, config);

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log(error);
    }
  };

  // OPEN MODAL
  const openConfirmModal = ({ title, message, action }) => {
    setModalData({
      title,
      message,
      action,
    });

    setShowConfirmModal(true);
  };

  // CLOSE MODAL
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

// LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="settings-page">
      <Sidebar />

      <div className="settings-content">
        {/* HEADER */}
        <div className="settings-header mb-4">
          <h1>Settings</h1>

          <p>Manage projects and tasks from your workspace.</p>
        </div>

        {/* CARD */}
        <div className="card border-0 settings-card">
          {/* TOP */}
          <div className="settings-top-header">
            <div>
              <h3>Project Management</h3>

              <p>Delete projects or individual tasks.</p>
            </div>

            <div className="project-count-badge">
              {projects.length} Projects
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="settings-loading">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="settings-projects">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="settings-project-item"
                  >
                    {/* PROJECT HEADER */}
                    <div className="settings-project-header">
                      <div className="settings-project-info">
                        <h5>{project.name}</h5>

                        <p>{project.description}</p>
                      </div>

                      {/* ACTIONS */}
                      <div className="settings-actions">
                        <button
                          className="btn view-task-btn"
                          onClick={() => {
                            if (expandedProject === project._id) {
                              setExpandedProject(null);
                              setTasks([]);
                            } else {
                              fetchTasks(project._id);
                            }
                          }}
                        >
                          {expandedProject === project._id
                            ? "Hide Tasks"
                            : "View Tasks"}
                        </button>

                        <button
                          className="btn btn-danger delete-project-btn"
                          onClick={() =>
                            openConfirmModal({
                              title: "Delete Project",
                              message:
                                "Deleting this project will also delete all related tasks.",
                              action: () =>
                                handleDeleteProject(project._id),
                            })
                          }
                        >
                          Delete Project
                        </button>
                      </div>
                    </div>

                    {/* TASKS */}
                    {expandedProject === project._id && (
                      <div className="tasks-section">
                        <h6>Project Tasks</h6>

                        {tasks.length > 0 ? (
                          <div className="tasks-list">
                            {tasks.map((task) => (
                              <div
                                key={task._id}
                                className="task-item"
                              >
                                <div className="task-info">
                                  <h6>{task.name}</h6>

                                  <p>Status: {task.status}</p>
                                </div>

                                <button
                                  className="btn btn-outline-danger delete-task-btn"
                                  onClick={() =>
                                    openConfirmModal({
                                      title: "Delete Task",
                                      message:
                                        "Are you sure you want to delete this task?",
                                      action: () =>
                                        handleDeleteTask(task._id),
                                    })
                                  }
                                >
                                  Delete Task
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="empty-task-text">
                            No tasks available for this project.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="empty-task-text">
                  No projects found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div className="logout-section">
          <button
            className="btn btn-danger logout-btn"
            onClick={() =>
              openConfirmModal({
                title: "Logout",
                message: "Are you sure you want to logout?",
                action: handleLogout,
              })
            }
          >
            Logout
          </button>
        </div>
      </div>

      {/* REUSABLE MODAL */}
      {showConfirmModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h4>{modalData.title}</h4>

            <p>{modalData.message}</p>

            <div className="custom-modal-actions">
              <button
                className="btn btn-light"
                onClick={closeConfirmModal}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  modalData.action();

                  closeConfirmModal();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}