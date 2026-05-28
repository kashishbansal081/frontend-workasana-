import SideBar from "../../components/Layout/SideBar";
import { useParams } from "react-router-dom";
import useFetch from "../../useFetch/useFetch";
import { useState } from "react";
import {API} from "../../services/Api";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { refersh, setAddTaskModalOpen } = useContext(AppContext);
  const { data: project } = useFetch(`${API.projects}/${id}`);
  const { data: tasks } = useFetch(API.tasks, refersh);
  const [statusFilter, setStatusFilter] = useState("all");
  const [btnFilter, setBtnFilter] = useState("priority-low-high");

  
  const sortTasks = (tasksArray) => {
    switch (btnFilter) {
      case "priority-low-high":
        return tasksArray.sort((a, b) => a.priority.localeCompare(b.priority));
      case "priority-high-low":
        return tasksArray.sort((a, b) => b.priority.localeCompare(a.priority));
      case "newest-first":
        return tasksArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      case "oldest-first":
        return tasksArray.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      default:
        return tasksArray;
    }
  };

  const filteredTasks = tasks
    ? sortTasks(
        tasks.filter((task) => {
          const matchesProject = task.project && task.project._id === id;
          const matchesStatus =
            statusFilter === "all" || task.status === statusFilter;
          return matchesProject && matchesStatus;
        }),
      )
    : [];

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <SideBar />
        </div>
        <div className="col-md-9 mt-4 ps-0">
          {project && (
            <>
              <div className="project-details-page">
                <h3 className="fw-bold">{project.name}</h3>
                <p className="form-text">{project.description}</p>
              </div>

              <div className="sorting mb-3">
                <h5 className="d-inline me-3">Sort by:</h5>
                <button
                  className="btn btn-outline-primary btn-sm me-3"
                  onClick={() => setBtnFilter("priority-low-high")}
                >
                  Priority Low-High
                </button>
                <button
                  className="btn btn-outline-primary btn-sm me-3"
                  onClick={() => setBtnFilter("priority-high-low")}
                >
                  Priority High-Low
                </button>
                <button
                  className="btn btn-outline-primary btn-sm me-3"
                  onClick={() => setBtnFilter("newest-first")}
                >
                  Newest First
                </button>
                <button
                  className="btn btn-outline-primary btn-sm me-3"
                  onClick={() => setBtnFilter("oldest-first")}
                >
                  Oldest First
                </button>

                <div className="float-end me-3">
                  <select
                    className="form-select form-select-sm d-inline w-auto me-4"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Filter by Status</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => setAddTaskModalOpen(true)}>
                    + New Task
                  </button>
                </div>
              </div>
            </>
          )}

          {filteredTasks.length === 0 ? (
            <p className="text-muted">No tasks found for this project.</p>
          ) : (
            <div className="table-responsive me-4">
              <table className="table table-hover table-bordered">
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
                       task.timeToComplete * 24 * 60 * 60 * 1000,
                    );

                    const isOverdue = dueDate < new Date();

                    return (
                      <tr key={task._id}>
                        <td>{task.name}</td>
                        <td>
                          {task.owners?.map((owner) => owner.name).join(", ") ||
                            "Unassigned"}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              task.priority === "High"
                                ? "bg-danger"
                                : task.priority === "Medium"
                                  ? "bg-warning"
                                  : "bg-success"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td style={{ color: isOverdue ? "red" : "black" }}>
                          {dueDate.toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              task.status === "Completed"
                                ? "bg-success"
                                : task.status === "In Progress"
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
          )}
        </div>
      </div>
    </>
  );
}
