import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/Layout/SideBar";
import "./TaskDetailsPage.css";
import {API} from "../../services/Api";

export default function TaskDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  const fetchTask = async () => {
    try {
      const response = await fetch(
        `${API.tasks}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      setTask(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const markAsCompleted = async () => {
    try {
      const response = await fetch(
        `${API.tasks}/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Completed",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update task");
        return;
      }

      fetchTask();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateRemainingDays = (dueDate) => {
    if (!dueDate) return "No Due Date";

    const today = new Date();

    const due = new Date(dueDate);

    const diffTime = due - today;

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return "Overdue";

    if (diffDays === 0) return "Due Today";

    return `${diffDays} Days Left`;
  };

  if (!task) {
    return (
      <div className="task-details-page">
        <div className="task-sidebar">
          <SideBar />
        </div>

        <div className="task-details-content">
          <h2>Loading Task...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-page">
      <div className="task-sidebar">
        <SideBar />
      </div>

      <div className="task-details-content">
        <div className="task-details-header">
          <div>
            <h1>{task.title}</h1>

            <p className="task-subtitle">
              Task Details & Progress
            </p>
          </div>

          <button
            className="task-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        <div className="task-main-card">
          <div className="task-top-section">
            <div className="task-status-badge">
              {task.status}
            </div>

            <div className="task-time-remaining">
              {calculateRemainingDays(task.dueDate)}
            </div>
          </div>

          <div className="task-info-grid">
            <div className="task-info-card">
              <p className="task-label">
                Project
              </p>

              <h3>
                {task.project?.name || "No Project"}
              </h3>
            </div>

            <div className="task-info-card">
              <p className="task-label">
                Team
              </p>

              <h3>
                {task.team?.name || "No Team"}
              </h3>
            </div>

            <div className="task-info-card">
              <p className="task-label">
                Owners
              </p>

              <h3>
                {task.owners?.length > 0
                  ? task.owners
                      .map((owner) => owner.name)
                      .join(", ")
                  : "No Owners"}
              </h3>
            </div>

            <div className="task-info-card">
              <p className="task-label">
                Tags
              </p>

              <div className="task-tags">
                {task.tags?.length > 0 ? (
                  task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="task-tag"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span>No Tags</span>
                )}
              </div>
            </div>

            <div className="task-info-card">
              <p className="task-label">
                Due Date
              </p>

              <h3>
                {task.dueDate
                  ? new Date(
                      task.dueDate,
                    ).toLocaleDateString()
                  : "No Due Date"}
              </h3>
            </div>
          </div>

          <div className="task-description-box">
            <p className="task-label">
              Description
            </p>

            <p>
              {task.description ||
                "No Description Added"}
            </p>
          </div>

          {task.status !== "Completed" && (
            <button
              className="task-complete-btn"
              onClick={markAsCompleted}
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}