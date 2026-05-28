import { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [addTaskModalOpen, setAddTaskModalOpen] =
    useState(false);

  const [
    addProjectModalOpen,
    setAddProjectModalOpen,
  ] = useState(false);

  const [refersh, setRefresh] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token"),
  );

  return (
    <AppContext.Provider
      value={{
        addTaskModalOpen,
        setAddTaskModalOpen,

        addProjectModalOpen,
        setAddProjectModalOpen,

        refersh,
        setRefresh,

        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}