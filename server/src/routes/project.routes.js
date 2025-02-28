import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Route, Router } from "express";
import { createProject }  from "../controllers/project.controller.js";


const router = Router()

router.route("/").get(createProject)

export default router