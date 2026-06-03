import { useState, useEffect, useContext } from "react";
import useFetch from "../../useFetch/useFetch";
import { API } from "../../services/Api";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import "./TaskForm.css";

export default function TaskForm({ triggerRefresh }) {
  const { data: projects } = useFetch(API.projects);
  const { data: teams } = useFetch(API.teams);

  const { setAddTaskModalOpen } = useContext(AppContext);

  const [members, setMembers] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const predefinedTags = ["Urgent", "Bug", "Feature"];

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    taskName: "",
    projectName: "",
    team: "",
    owners: [],
    tags: [],
    timeToComplete: "",
    status: "To Do",
    priority: "Low",
  });

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
  }, [formData.team, token]);

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

  const handlePredefinedTagsChange = (e) => {
    const selectedTags = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    const customTags = formData.tags.filter(
      (tag) => !predefinedTags.includes(tag),
    );

    setFormData((prev) => ({
      ...prev,
      tags: [...customTags, ...selectedTags],
    }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag) return;

    const tagExists = formData.tags.some(
      (tag) => tag.toLowerCase() === trimmedTag.toLowerCase(),
    );

    if (tagExists) {
      toast.error("Tag already exists");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, trimmedTag],
    }));

    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
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
      {" "}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {" "}
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

          <select className="form-select" id="team" onChange={handleChange}>
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
            className="form-select mb-3"
            value={formData.tags.filter((tag) => predefinedTags.includes(tag))}
            onChange={handlePredefinedTagsChange}
          >
            {predefinedTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter custom tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddTag}
            >
              Add
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="tags-container mt-3">
              {formData.tags.map((tag) => (
                <span key={tag} className="custom-tag">
                  {tag}

                  <button
                    type="button"
                    className="tag-remove-btn"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Time to Complete (days)</label>

          <input
            type="number"
            className="form-control"
            id="timeToComplete"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Priority</label>

          <select className="form-select" id="priority" onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>

          <select className="form-select" id="status" onChange={handleChange}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Blocked</option>
          </select>
        </div>

        <button className="btn btn-primary w-100">Create Task</button>
      </form>
    </div>
  );
}
