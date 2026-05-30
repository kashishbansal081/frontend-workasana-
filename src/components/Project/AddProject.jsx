import React, { useState } from "react";
import { toast } from "react-toastify";
import { API } from "../../services/Api";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function AddProject({ triggerRefresh }) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { setAddProjectModalOpen } = useContext(AppContext);
  const token = localStorage.getItem("token");


  const createProjectHandler = (e) => {
    e.preventDefault();

    fetch(API.projects, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: projectName,
        description: projectDescription
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("Project created:", data);
        toast.success("Project created successfully!");
        setAddProjectModalOpen(false);
        triggerRefresh();
      })
      .catch((error) => {
        console.error("Error creating project:", error);
        toast.error("Failed to create project. Please try again.");
      });
  }
  return (
    <div
      onClick={() => setAddProjectModalOpen(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          height: "22rem",
          width: "30rem",
          borderRadius: "8px",
          backgroundColor: "#fff",
          padding: "1rem",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5>Create New Project</h5>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => setAddProjectModalOpen(false)}
          >
            Cancel
          </button>
        </div>

        <hr />

        <form onSubmit={createProjectHandler}>
          <div className="mb-3">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter project name"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Project Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter project description"
              onChange={(e) => setProjectDescription(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>

          <button className="btn btn-primary w-100">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
