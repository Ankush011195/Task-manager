import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv, { config } from 'dotenv';
import authRoutes from "./Routes/authRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import auth from "./Middleware/auth.js";
import isAdmin from "./Middleware/isAdmin.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});


 mongoose.connect(process.env.MONGO_URL)
 .then(()=> console.log('Connected to MongoDB'))
 .catch((err)=> console.log(err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
