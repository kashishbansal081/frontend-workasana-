const BASE_URL = "https://backend-work-asana.vercel.app";

export const API = {
  projects: `${BASE_URL}/v1/projects`,
  tasks: `${BASE_URL}/v1/tasks`,
  teams: `${BASE_URL}/v1/teams`,
  users: `${BASE_URL}/v1/users`,
  login: `${BASE_URL}/v1/auth/login`,
  signup: `${BASE_URL}/v1/auth/signup`,
  reports: {
    lastWeek: `${BASE_URL}/v1/report/last-week`,
    pending: `${BASE_URL}/v1/report/pending`,
    closedTasks: `${BASE_URL}/v1/report/closed-tasks`,
  },
};