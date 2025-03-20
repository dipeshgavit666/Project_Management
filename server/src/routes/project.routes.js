import { Router } from "express"
import { 
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    getProject
} from "../controllers/project.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

router.route("/").post(verifyJWT, createProject)
router.route("/:projectId").patch(verifyJWT, updateProject)
router.route("/:id").delete(verifyJWT, deleteProject)
router.route("/").get(verifyJWT, getAllProjects)
router.route("/:projectId").get(verifyJWT, getProject)

export default router