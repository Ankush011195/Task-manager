import express from "express";
import Project from "../Models/Project.js";
import auth from "../Middleware/auth.js";
import isAdmin from "../Middleware/isAdmin.js";

const router = express.Router();

// only admin create project
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name required" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// all projects
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;