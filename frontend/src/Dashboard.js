import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState({});
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectName, setProjectName] = useState("");
  const [users, setUsers] = useState([]);
const [assignedTo, setAssignedTo] = useState("");

  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
    getTasks();
    getProjects();
    if (userRole === "admin") getUsers(); 
  }, []);

  const getUsers = async () => {
  const res = await fetch("https://task-manager-ibsf.onrender.com/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  setUsers(result);
};

  const fetchDashboard = async () => {
    const res = await fetch("https://task-manager-ibsf.onrender.com/api/tasks/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setData(result);
  };

  const getTasks = async () => {
    const res = await fetch("https://task-manager-ibsf.onrender.com/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setTasks(result);
  };


  
  const getProjects = async () => {
    const res = await fetch("https://task-manager-ibsf.onrender.com/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setProjects(result);
  };



  const addProject = async () => {
    if (!projectName) return alert("Enter project name");
    const res = await fetch("https://task-manager-ibsf.onrender.com/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: projectName }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    setProjectName("");
    getProjects();
  };

  const addTask = async () => {
    if (!title || !selectedProject) return alert("Enter title & select project");
    const res = await fetch("https://task-manager-ibsf.onrender.com/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        projectId: selectedProject,
        assignedTo: assignedTo,
        status: "pending",
      }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    setTitle("");
    getTasks();
      setAssignedTo("");
    fetchDashboard();
  };

  const updateStatus = async (id, status) => {
    await fetch(`https://task-manager-ibsf.onrender.com/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    getTasks();
    fetchDashboard();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const getBadge = (status) => {
    if (status === "completed") return <span className="badge badge-completed">Completed</span>;
    if (status === "in-progress") return <span className="badge badge-progress">In Progress</span>;
    return <span className="badge badge-pending">Pending</span>;
  };

  return (
    <div className="container">
  
      <div className="top-bar">
        <h2>
          Task Manager
          <span>Welcome, {userName} ({userRole})</span>
        </h2>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-box">
          <span className="stat-number">{data.total || 0}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{data.completed || 0}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{data.pending || 0}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{data.inProgress || 0}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{data.overdue || 0}</span>
          <span className="stat-label">Overdue</span>
        </div>
      </div>

      {/* only admin */}
      {userRole === "admin" && (
        <>
          <h3>Projects</h3>

          {/* Existing projects */}
          <div className="project-list">
            {projects.map((p) => (
              <span className="project-tag" key={p._id}>{p.name}</span>
            ))}
          </div>

          {/* project add*/}
          <div>
            <input
              placeholder="New project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <button className="btn-primary" onClick={addProject}>
              Add Project
            </button>
          </div>

          {/* add Task */}
          <h3>Create Task</h3>
          <div>
            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            
           <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assign To</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>

            <button className="btn-primary" onClick={addTask}>
              Add Task
            </button>
          </div>
        </>
      )}

      {/* tasks */}
      <h3>My Tasks</h3>

      {tasks.length === 0 ? (
        <div className="empty">No tasks found.</div>
      ) : (
        <div className="task-list">
          {tasks.map((t) => (
            <div className="task" key={t._id}>
              <div className="task-title">{t.title}</div>
              <div className="task-meta">
                <span>📁 {t.projectId?.name || "No Project"}</span>
                {t.dueDate && (
                  <span>📅 Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                )}
                <span>{getBadge(t.status)}</span>
              </div>
              <div className="task-actions">
                <button className="btn-success" onClick={() => updateStatus(t._id, "completed")}>
                  ✓ Completed
                </button>
                <button className="btn-warning" onClick={() => updateStatus(t._id, "in-progress")}>
                  ↻ In Progress
                </button>
                <button className="btn-secondary" onClick={() => updateStatus(t._id, "pending")}>
                  ⏳ Pending
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Dashboard;