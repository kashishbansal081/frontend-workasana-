# Workasana

A full-stack task management and team collaboration application focused on organizing projects, tracking tasks, and improving team productivity.

The application enables teams to create projects, assign tasks to team members, manage task progress through different statuses, organize work using teams and tags, and monitor productivity through reports and analytics.

Built using a React frontend, Node.js/Express backend, MongoDB database, and JWT-based authentication.

---

## Demo Link

[Live Demo](https://frontend-workasana-3m46-m0f79z5gn.vercel.app/)

---

## Quick Start

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
npm install
npm run dev
```

---

## Technologies Used

### Frontend

* React JS
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Other Tools

* JWT Authentication
* Postman
* GitHub
* CORS

---

## Environment Setup

Create a `.env` file in the root of your backend directory and add the following variables:

```env
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the values with your own MongoDB connection string and JWT secret.

---

## Demo Video

Watch a walkthrough of all major features of this app:

[Demo Video](https://drive.google.com/file/d/1DOH-Urgw38UgZ9lH0NbDL5qSJ_zDl5M3/view?usp=sharing)

---

## Features

### Authentication

* User signup and login using JWT authentication.
* Protected routes accessible only to authenticated users.
* Session persistence using JWT tokens.
* Logout functionality.

### Dashboard

* Displays all projects and tasks in a centralized workspace.
* Filter projects and tasks based on status such as To Do, In Progress, Completed, and Blocked.
* Create new projects directly from the dashboard.
* Create and assign tasks directly from the dashboard.
* Provides a quick overview of ongoing work across teams and projects.

### Project Management

* Create and manage projects.
* View all projects in a dedicated Projects page.
* Track project progress through status updates.
* View project-specific tasks and details.

### Task Management

* Create tasks and assign them to projects.
* Assign one or multiple owners to tasks.
* Associate tasks with teams and tags.
* Set task priority and estimated completion time.
* Update task details and task status.
* View detailed task information.

### Team Management

* View all teams in a dedicated Teams page.
* Create new teams.
* Assign an owner to a team.
* Add and manage team members.
* Organize tasks and projects around team structures.

### Reports & Analytics

* View tasks completed during the last week.
* Track pending work across projects.
* Analyze closed tasks by team.
* Analyze closed tasks by owner.
* Analyze closed tasks by project.
* Visualize productivity metrics using charts and reports.

### Settings

* Manage application data from a dedicated settings page.
* Delete projects when no longer required.
* Delete tasks when no longer required.

---

## API Reference

### **POST /v1/auth/signup**

Registers a new user.

Sample Response:

```json
{
  "message": "User created successfully"
}
```

---

### **POST /v1/auth/login**

Authenticates a user and returns a JWT token.

Sample Response:

```json
{
  "token": "jwt_token"
}
```

---

### **GET /v1/projects**

Retrieves all projects.

Sample Response:

```json
[
  {
    "_id": "project_id",
    "name": "Website Redesign",
    "description": "Redesign company website",
    "status": "In Progress"
  }
]
```

---

### **GET /v1/projects/:id**

Retrieves details of a specific project.

Sample Response:

```json
{
  "_id": "project_id",
  "name": "Website Redesign",
  "description": "Redesign company website",
  "status": "In Progress"
}
```

---

### **GET /v1/tasks**

Retrieves all tasks with associated project, team, owner, and tag details.

Sample Response:

```json
[
  {
    "_id": "task_id",
    "name": "Create Wireframes",
    "status": "To Do",
    "priority": "High",
    "timeToComplete": 5
  }
]
```

---

### **GET /v1/tasks/:id**

Retrieves details of a specific task.

Sample Response:

```json
{
  "_id": "task_id",
  "name": "Create Wireframes",
  "status": "In Progress",
  "priority": "High",
  "project": "Website Redesign",
  "timeToComplete": 5
}
```

---

### **GET /v1/teams**

Retrieves all teams.

Sample Response:

```json
[
  {
    "_id": "team_id",
    "name": "Development",
    "description": "Frontend and Backend Team"
  }
]
```

---

### **GET /v1/report/closed-tasks**

Retrieves task completion statistics grouped by team, owner, and project.

Sample Response:

```json
{
  "byTeam": [],
  "byOwner": [],
  "byProject": []
}
```

---

## Contact

For bugs or feature requests, please reach out to:

[kashishbansal081@gmail.com](mailto:kashishbansal081@gmail.com)
