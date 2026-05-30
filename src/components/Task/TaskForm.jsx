import { useState, useEffect } from "react";
import useFetch from "../../useFetch/useFetch";
import { API } from "../../services/Api";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function TaskForm({ triggerRefresh }) {
  const { data: projects } = useFetch(API.projects);
  const { data: teams } = useFetch(API.teams);

  const { setAddTaskModalOpen } = useContext(AppContext);

  const [members, setMembers] = useState([]);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    taskName: "",
    projectName: "",
    team: "",
    owners: [],
    tags: [],
    timeToComplete: "",
    status: "To Do",
  });

  const tagOptions = ["Urgent", "Bug", "Feature"];

  useEffect(() => {
    if (formData.team) {
      fetch(`${API.teams}/${formData.team}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setMembers(data.members));
    }

        // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [formData.team]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleMultiSelect = (e, field) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.taskName ||
      !formData.projectName ||
      !formData.team ||
      !formData.timeToComplete
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const response = await fetch(API.tasks, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      toast.success("Task created successfully!");

      triggerRefresh();

      setAddTaskModalOpen(false);
    } catch (error) {
      toast.error("Error creating task!");
      console.log(error);
    }
  };

  return (
    <div className="modal-content-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Create New Task</h4>

        <button
          className="btn btn-danger btn-sm mt-0"
          onClick={() => setAddTaskModalOpen(false)}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Task Name</label>

          <input
            type="text"
            className="form-control"
            id="taskName"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Project</label>

          <select
            className="form-select"
            id="projectName"
            onChange={handleChange}
          >
            <option value="">Select a project</option>

            {projects &&
              projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Team</label>

          <select
            className="form-select"
            id="team"
            onChange={handleChange}
          >
            <option value="">Select team</option>

            {teams &&
              teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Owners</label>

          <select
            multiple
            className="form-select"
            onChange={(e) => handleMultiSelect(e, "owners")}
          >
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tags</label>

          <select
            multiple
            className="form-select"
            onChange={(e) => handleMultiSelect(e, "tags")}
          >
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Time to Complete (days)
          </label>

          <input
            type="number"
            className="form-control"
            id="timeToComplete"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>

          <select
            className="form-select"
            id="status"
            onChange={handleChange}
          >
            <option>To Do</option>

            <option>In Progress</option>

            <option>Completed</option>

            <option>Blocked</option>
          </select>
        </div>

        <button className="btn btn-primary w-100">
          Create Task
        </button>
      </form>
    </div>
  );
}