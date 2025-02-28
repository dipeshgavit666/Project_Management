import { Project } from "../models/project.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
const createProject = asyncHandler( async (req, res) => {
    const {
        name, 
        description,
        startDate,
        endDate,
        priority,
        owner,
        team
    } = req.body



    try {
        const project = await Project.create({
            name, 
            description,
            startDate,
            endDate,
            priority,
            owner,
            team
        })

        const createdProject = await Project.findById(project._id)
    
        if(!createdProject){
            throw new ApiError(500, "Something went wrong")
        }

        return res
            .status(200)
            .json(new ApiResponse(201, createProject, "Project craeted"))
    } catch (error) {
        console.log("Project creation failed")
        throw new ApiError(500, "Something went wrong while creting a project")
    }
})

export { 
    createProject
}