import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Route, Router } from "express";
import  Project  from "../controllers/project.controller.js";


const router = Router()

router.route("/").get(Project)

export default router