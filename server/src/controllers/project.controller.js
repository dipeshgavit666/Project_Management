import { Project } from "../models/project.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

//create project
const createProject = asyncHandler( async (req, res) => {
    try {

    const {
        name, 
        description,
        createdBy,
        team = []
    } = req.body



    
        const newProject = await Project.create({
            name,
            description,
            createdBy: req.user.id,
            team: team || [],
            status: 'active'
        })
    
        await newProject.save();


        return res
            .status(200)
            .json(new ApiResponse(201, newProject, "Project craeted successfully"))
    } catch (error) {
        console.log("Project creation failed")
        throw new ApiError(500, "Something went wrong while creting a project")
    }
})


//updateproject
const updateproject = asyncHandler( async (req, res) => {
    try {
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
        )
    
        return res.status(200).json( new ApiResponse(200, project, "Project updated successfully"))
    } catch (error) {
        throw new ApiError(401, "Something went wrong while updating project")
    }
})



//delete project
const deleteProject = asyncHandler ( async(req, res) => {
    try {
        const projectId = req.params.id;

        const project = await Project.findById(projectId)
        if(!project) {
            throw new ApiError(402, "Project note found")
        }

        if(project.createdBy.toString() !== req.user.id){
            throw new ApiError(401, "Not authorized to delete this project")
        }

        await Project.findByIdAndDelete(projectId)

        return res.status(200).json( new ApiResponse(200, {}, "project deleted successfully"))

    } catch (error) {
        throw new ApiError(401, "Couldn't delete the project" )
    }
})


//get all projects
const getAllProjects = asyncHandler( async(req, res) => {
    try {
        
    } catch (error) {
        throw new ApiError(500, "couldn't get projects please try again")
    }
})

//get single project
const getProject = asyncHandler( async(req, res) => {
    try {
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding project, please try again")
    }
})

//add new team members in project


export { 
    createProject,
    updateproject,
    deleteProject,
    getAllProjects,
    getProject
}