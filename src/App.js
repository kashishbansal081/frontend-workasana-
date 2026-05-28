import "./App.css";
import { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AppContext } from "./context/AppContext";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddProject from "./components/Project/AddProject";
import TaskForm from "./components/Task/TaskForm";
import ProjectDetailsPage from "./pages/Projects/ProjectDetailsPage";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import TeamsPage from "./pages/Teams/TeamsPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import SettingPage from "./pages/Settings/SettingPage";
import TaskDetailsPage from "./pages/Tasks/TaskDetailsPage";

function App() {
  const {
    addTaskModalOpen,
    setAddTaskModalOpen,

    addProjectModalOpen,
    setAddProjectModalOpen,

    refersh,
    setRefresh,

    isLoggedIn,
  } = useContext(AppContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Dashboard /> : <LoginPage />,
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/signup",
      element: <SignupPage />,
    },

    {
      path: "/project/:id",
      element: <ProjectDetailsPage />,
    },

    {
      path: "/projects",
      element: <ProjectsPage />,
    },

    {
      path: "/teams",
      element: <TeamsPage />,
    },

    {
      path: "/reports",
      element: <ReportsPage />,
    },

    {
      path: "/task/:id",
      element: <TaskDetailsPage />,
    },

    {
      path: "/settings",
      element: <SettingPage />,
    },
  ]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <RouterProvider router={router} />

      {addTaskModalOpen && (
        <div className="modal-overlay">
          <TaskForm
            triggerRefresh={() => {
              setRefresh((prev) => !prev);
            }}
          />
        </div>
      )}

      {addProjectModalOpen && (
        <AddProject triggerRefresh={() => setRefresh((prev) => !prev)} />
      )}
    </>
  );
}

export default App;
