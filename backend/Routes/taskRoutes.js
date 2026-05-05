import express from "express";
import Task from "../Models/Task.js";
import auth from "../Middleware/auth.js";
import isAdmin from "../Middleware/isAdmin.js";

const router = express.Router();

// ✅ Dashboard stats — pehle rakho /:id se conflict na ho
router.get("/dashboard", auth, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ assignedTo: req.user._id });
    }

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;

    // Overdue tasks
    const today = new Date();
    const overdue = tasks.filter(
      t => t.dueDate && new Date(t.dueDate) < today && t.status !== "completed"
    ).length;

    res.json({ total, completed, pending, inProgress, overdue });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create task — Admin only
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ message: "Title and assignedTo required" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
      status: "pending"
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate("projectId", "name");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate("assignedTo", "name email")
        .populate("projectId", "name");
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// for task status update
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;