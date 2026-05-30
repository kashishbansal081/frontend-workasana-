import Navbar from "../../components/Layout/Navbar";
import useFetch from "../../useFetch/useFetch";
import ProjectCard from "../../components/Project/ProjectCard";
import { useState } from "react";
import TaskCard from "../../components/Task/TaskCard";
import { Link } from "react-router-dom";
import { API } from "../../services/Api";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function Dashboard() {
  const {
    refersh,
    setAddTaskModalOpen,
    setAddProjectModalOpen,
  } = useContext(AppContext);

  console.log('github testing')

  const { data } = useFetch(API.projects, refersh);

  const { data: taskData } = useFetch(API.tasks, refersh);

  const [projectFilter, setProjectFilter] = useState("all");

  const [searchFilter, setSearchFilter] = useState("");

  const [taskFilter, setTaskFilter] = useState("all");

  const searchFilteredData = data
    ? data.filter((project) =>
        project.name.toLowerCase().includes(searchFilter.toLowerCase()),
      )
    : [];

  const selectFilteredTasks = taskData
    ? taskData.filter((task) => {
        if (taskFilter === "all") return true;

        return task.status === taskFilter;
      })
    : [];

  const filteredData =
    projectFilter === "all"
      ? searchFilteredData
      : searchFilteredData.filter(
          (project) => project.status === projectFilter,
        );

  return (
    <div className="container-fluid dashboard-page">
      <div className="row">
        <div className="col-12 col-md-3 p-0 dashboard-sidebar">
          <Navbar />
        </div>

        <div className="col-12 col-md-9 dashboard-content">
          <div className="dashboard-header">
            <div>
              <h2 className="dashboard-title">Dashboard</h2>

              <p className="dashboard-subtitle">
                Manage projects and tasks easily
              </p>
            </div>
          </div>

          <div className="search-bar mt-4">
            <input
              type="text"
              placeholder="Search projects..."
              className="form-control dashboard-search"
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <div className="feature-card dashboard-section mt-4">
            <div className="dashboard-section-header">
              <div className="dashboard-section-left">
                <h4 className="section-title mb-0">Projects</h4>

                <select
                  className="project-status form-control-sm dashboard-select"
                  onChange={(e) => setProjectFilter(e.target.value)}
                >
                  <option value="all">All Projects</option>

                  <option value="To Do">To Do</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Completed">Completed</option>

                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <button
                className="btn btn-primary dashboard-btn"
                onClick={() => setAddProjectModalOpen(true)}
              >
                + Add Project
              </button>
            </div>

            <div className="row mt-4">
              {!data ? (
                <p className="mt-3">Loading projects...</p>
              ) : filteredData.length > 0 ? (
                filteredData.map((project) => (
                  <div
                    className="col-12 col-sm-6 col-xl-4 mb-4"
                    key={project._id}
                  >
                    <Link to={`/project/${project._id}`} className="link">
                      <div className="dashboard-card-wrapper">
                        <ProjectCard project={project} />
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="mt-3">No projects found.</p>
              )}
            </div>
          </div>

          <div className="feature-card dashboard-section mt-4">
            <div className="dashboard-section-header">
              <div className="dashboard-section-left">
                <h4 className="section-title mb-0">My Tasks</h4>

                <select
                  className="task-status form-control-sm dashboard-select"
                  onChange={(e) => setTaskFilter(e.target.value)}
                >
                  <option value="all">All Tasks</option>

                  <option value="To Do">To Do</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Completed">Completed</option>

                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <button
                className="btn btn-primary dashboard-btn"
                onClick={() => setAddTaskModalOpen(true)}
              >
                + New Task
              </button>
            </div>

            <div className="row mt-4">
              {!taskData ? (
                <p className="mt-3">Loading tasks...</p>
              ) : selectFilteredTasks.length > 0 ? (
                selectFilteredTasks.map((task) => (
                  <div
                    className="col-12 col-sm-6 col-xl-4 mb-4"
                    key={task._id}
                  >
                    <Link to={`/task/${task._id}`} className="link">
                      <div className="dashboard-card-wrapper">
                        <TaskCard task={task} />
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="mt-3">No tasks found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}