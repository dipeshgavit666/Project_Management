import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createTask, 
    deleteTask, 
    updateTask, 
    getAllTasks, 
    getTask 
  } from "../controllers/task.controller.js";

  const router = Router();

router.route("/create").post(verifyJWT, createTask);
router.route("/:id").delete(verifyJWT, deleteTask);
router.route("/:id").patch(verifyJWT, updateTask);
router.route("/project/:projectId").get(verifyJWT, getAllTasks);
router.route("/:id").get(verifyJWT, getTask);

export default router;