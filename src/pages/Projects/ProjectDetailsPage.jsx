import SideBar from "../../components/Layout/SideBar";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../useFetch/useFetch";
import { useState } from "react";
import { API } from "../../services/Api";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./ProjectDetails.css";

export default function ProjectDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { refersh, setAddTaskModalOpen } = useContext(AppContext);

  const { data: project } = useFetch(`${API.projects}/${id}`);

  const { data: tasks } = useFetch(API.tasks, refersh);

  const [statusFilter, setStatusFilter] = useState("all");

  const [btnFilter, setBtnFilter] = useState("priority-low-high");

  const sortTasks = (tasksArray) => {
    switch (btnFilter) {
      case "priority-low-high":
        return tasksArray.sort((a, b) =>
          a.priority.localeCompare(b.priority),
        );

      case "priority-high-low":
        return tasksArray.sort((a, b) =>
          b.priority.localeCompare(a.priority),
        );

      case "newest-first":
        return tasksArray.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt),
        );

      case "oldest-first":
        return tasksArray.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt),
        );

      default:
        return tasksArray;
    }
  };

  const filteredTasks = tasks
    ? sortTasks(
        tasks.filter((task) => {
          const matchesProject =
            task.project && task.project._id === id;

          const matchesStatus =
            statusFilter === "all" ||
            task.status === statusFilter;

          return matchesProject && matchesStatus;
        }),
      )
    : [];

  return (
    <div className="container-fluid project-details-wrapper">
      <div className="row">
        <div className="col-12 col-md-3 p-0">
          <SideBar />
        </div>

        <div className="col-12 col-md-9 project-details-content">
          {project && (
            <>
              <div className="project-details-header">
                <h3>{project.name}</h3>

                <p>{project.description}</p>
              </div>

              <div className="project-toolbar">
                <div className="sorting-buttons">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      setBtnFilter("priority-low-high")
                    }
                  >
                    Priority Low-High
                  </button>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      setBtnFilter("priority-high-low")
                    }
                  >
                    Priority High-Low
                  </button>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      setBtnFilter("newest-first")
                    }
                  >
                    Newest First
                  </button>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      setBtnFilter("oldest-first")
                    }
                  >
                    Oldest First
                  </button>
                </div>

                <div className="project-toolbar-actions">
                  <select
                    className="form-select form-select-sm"
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                  >
                    <option value="all">
                      Filter by Status
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Blocked">
                      Blocked
                    </option>
                  </select>
                </div>
              </div>
            </>
          )}

          {filteredTasks.length === 0 ? (
            <p className="text-muted">
              No tasks found for this project.
            </p>
          ) : (
            <>
              <div className="table-responsive project-table-wrapper">
                <table className="table table-hover table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Tasks</th>
                      <th>Owner</th>
                      <th>Priority</th>
                      <th>Due on</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTasks.map((task) => {
                      const dueDate = new Date(
                        new Date(task.createdAt).getTime() +
                          task.timeToComplete *
                            24 *
                            60 *
                            60 *
                            1000,
                      );

                      const isOverdue =
                        dueDate < new Date();

                      return (
                        <tr
                          key={task._id}
                          onClick={() =>
                            navigate(`/task/${task._id}`)
                          }
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <td>{task.name}</td>

                          <td>
                            {task.owners
                              ?.map((owner) => owner.name)
                              .join(", ") ||
                              "Unassigned"}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                task.priority === "High"
                                  ? "bg-danger"
                                  : task.priority ===
                                      "Medium"
                                    ? "bg-warning"
                                    : "bg-success"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>

                          <td
                            style={{
                              color: isOverdue
                                ? "red"
                                : "black",
                            }}
                          >
                            {dueDate.toLocaleDateString()}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                task.status ===
                                "Completed"
                                  ? "bg-success"
                                  : task.status ===
                                      "In Progress"
                                    ? "bg-primary"
                                    : "bg-secondary"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="task-action-footer mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-primary add-task-footer-btn"
                  onClick={() =>
                    setAddTaskModalOpen(true)
                  }
                >
                  + New Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}