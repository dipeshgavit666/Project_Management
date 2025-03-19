import { Project } from "../models/project.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

//create project
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


//updateproject
const updateproject = asyncHandler( async (req, res) => {
    const { name, description } = req.body
    if(!name && !description){
        throw new ApiError(401, "Project namw and descrition is required")
    }

    const project = await Project.findByIdAndUpdate(
        req.project._id,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    ).select("-team")

    return res.status(200).json( new ApiResponse(200, project, "Project updated successfully"))
})



//delete project
const deleteProject = asyncHandler ( async(req, res) => {

})


//get all projects

//get single project

//add new team members in project


export { 
    createProject
}