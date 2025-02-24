import { response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const Project = asyncHandler( async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, "OK", "Project"))
})

export default Project