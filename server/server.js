const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

// Project Schema
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: { type: String, default: "active" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: { type: String, default: "pending" },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: Date,
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
const Project = mongoose.model("Project", projectSchema);
const Task = mongoose.model("Task", taskSchema);

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

// Routes
// User Registration
app.post("/api/users/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User Login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid login credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid login credentials");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Project Routes
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user._id,
      members: [req.user._id],
    });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
    }).populate("owner", "name email");
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Task Routes
app.post("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      project: req.body.projectId,
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api/projects/:projectId/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
    }).populate("assignedTo", "name email");
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
