import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/Layout/SideBar";
import "./TaskDetailsPage.css";
import { API } from "../../services/Api";
import { toast } from "react-toastify";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  const token = localStorage.getItem("token");

  const fetchTask = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API.tasks}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setTask(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async (statusToUpdate = selectedStatus) => {
    try {
      const response = await fetch(`${API.tasks}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: statusToUpdate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update task");
        return;
      }

      toast.success("Task status updated successfully");
      fetchTask();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  const handleStatusUpdate = () => {
    if (task.status === "Completed" && selectedStatus !== "Completed") {
      setPendingStatus(selectedStatus);
      setShowReopenModal(true);
      return;
    }

    updateStatus(selectedStatus);
  };

  const getDueDate = () => {
    if (!task?.createdAt || !task?.timeToComplete) {
      return null;
    }

    return new Date(
      new Date(task.createdAt).getTime() +
        task.timeToComplete * 24 * 60 * 60 * 1000,
    );
  };

  const calculateRemainingDays = () => {
    const dueDate = getDueDate();

    if (!dueDate) return "No Due Date";

    const today = new Date();

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const dueOnly = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
    );

    const diffDays = Math.round((dueOnly - todayOnly) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";

    if (diffDays === 0) return "Due Today";

    return `${diffDays} Days Left`;
  };

  return (
    <div className="task-details-page">
      <div className="task-sidebar">
        <SideBar />
      </div>

      <div className="task-details-content">
        {loading ? (
          <div className="task-loader">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

            <p className="mt-3">Loading Task Details...</p>
          </div>
        ) : (
          <>
            <div className="task-details-header">
              <div>
                <h1>{task.name}</h1>

                <p className="task-subtitle">Task Details & Progress</p>
              </div>

              <button className="task-back-btn" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>

            <div className="task-main-card">
              <div className="task-top-section">
                <div className="task-status-badge">{task.status}</div>

                <div className="task-time-remaining">
                  {calculateRemainingDays()}
                </div>
              </div>

              <div className="task-info-grid">
                <div className="task-info-card">
                  <p className="task-label">Project</p>

                  <h3>{task.project?.name || "No Project"}</h3>
                </div>

                <div className="task-info-card">
                  <p className="task-label">Priority</p>

                  <h3>{task.priority || "Low"}</h3>
                </div>

                <div className="task-info-card">
                  <p className="task-label">Team</p>

                  <h3>{task.team?.name || "No Team"}</h3>
                </div>

                <div className="task-info-card">
                  <p className="task-label">Owners</p>

                  <h3>
                    {task.owners?.length > 0
                      ? task.owners.map((owner) => owner.name).join(", ")
                      : "No Owners"}
                  </h3>
                </div>

                <div className="task-info-card">
                  <p className="task-label">Tags</p>

                  <div className="task-tags">
                    {task.tags?.length > 0 ? (
                      task.tags.map((tag, index) => (
                        <span key={index} className="task-tag">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span>No Tags</span>
                    )}
                  </div>
                </div>

                <div className="task-info-card">
                  <p className="task-label">Due Date</p>

                  <h3>
                    {getDueDate()
                      ? getDueDate().toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "No Due Date"}
                  </h3>
                </div>
              </div>

              <div className="task-status-update">
                <label className="task-label">Update Status</label>

                <select
                  className="task-status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="To Do">To Do</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Blocked">Blocked</option>

                  <option value="Completed">Completed</option>
                </select>

                <button
                  type="button"
                  className="task-complete-btn"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </button>
              </div>

              {getDueDate() &&
                getDueDate() < new Date() &&
                task.status !== "Completed" && (
                  <div className="task-overdue-note">
                    This task is overdue. If work is still ongoing, consider
                    updating its timeline from an Edit Task feature in the
                    future.
                  </div>
                )}

              {showReopenModal && (
                <>
                  <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Reopen Task</h5>

                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowReopenModal(false)}
                          />
                        </div>

                        <div className="modal-body">
                          <p>This task was previously marked as Completed.</p>

                          <p>The due date will remain unchanged.</p>

                          <p>Are you sure you want to reopen this task?</p>
                        </div>

                        <div className="modal-footer">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setShowReopenModal(false)}
                          >
                            Cancel
                          </button>

                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              updateStatus(pendingStatus);
                              setShowReopenModal(false);
                            }}
                          >
                            Reopen Task
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-backdrop fade show"></div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
