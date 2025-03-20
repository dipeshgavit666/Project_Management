import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Router} from "express"
import { 
    createProject,
    updateproject,
    deleteProject,
    getAllProjects,
    getProject
 }  from "../controllers/project.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';



const router = Router()

router.route("/create-project").post(verifyJWT, createProject)
router.route("/update-project").patch(verifyJWT, updateproject)
router.route("/delete-project").delete(verifyJWT, deleteProject)
router.route("/all-projects").get(verifyJWT, getAllProjects)
router.route("get-project").get(verifyJWT, getProject)


export default router