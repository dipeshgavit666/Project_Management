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

router.route("/create-project").post(createProject)
router.route("/update-project").patch(updateproject)
router.route("/delete-project").delete(deleteProject)
router.route("/all-projects").get(getAllProjects)
router.route("get-project").get(getProject)


export default router