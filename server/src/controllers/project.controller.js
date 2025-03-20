import { Project } from "../models/project.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

//create project
const createProject = asyncHandler(async (req, res) => {
    try {
        const {
            name, 
            description,
            team = []
        } = req.body

        if(!name) {
            throw new ApiError(400, "Project name is required")
        }
        
        const newProject = await Project.create({
            name,
            description,
            createdBy: req.user.id,
            team: team || [],
            status: 'active'
        })
    
        return res
            .status(201)
            .json(new ApiResponse(201, newProject, "Project created successfully"))
    } catch (error) {
        console.log("Project creation failed:", error)
        throw new ApiError(500, "Something went wrong while creating a project")
    }
})

//updateproject
const updateProject = asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description } = req.body
        
        if(!projectId) {
            throw new ApiError(400, "Project ID is required")
        }
        
        const project = await Project.findById(projectId);
        
        if(!project) {
            throw new ApiError(404, "Project not found")
        }
        
        if(project.createdBy.toString() !== req.user.id) {
            throw new ApiError(403, "Not authorized to update this project")
        }
        
        if(!name && !description){
            throw new ApiError(400, "Project name or description is required")
        }
    
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                $set: {
                    name: name || project.name,
                    description: description || project.description
                }
            },
            { new: true }
        )
    
        return res.status(200).json(new ApiResponse(200, updatedProject, "Project updated successfully"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating project: " + error.message)
    }
})



//delete project
const deleteProject = asyncHandler(async(req, res) => {
    try {
        const projectId = req.params.id;

        const project = await Project.findById(projectId)
        if(!project) {
            throw new ApiError(404, "Project not found")
        }

        if(project.createdBy.toString() !== req.user.id){
            throw new ApiError(403, "Not authorized to delete this project")
        }

        await Project.findByIdAndDelete(projectId)

        return res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"))

    } catch (error) {
        throw new ApiError(500, "Couldn't delete the project: " + error.message)
    }
})


//get all projects
const getAllProjects = asyncHandler(async(req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { createdBy: req.user.id },
                { team: req.user.id }
            ]
        }).populate('createdBy', 'firstName lastName');
        
        return res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully"))
    } catch (error) {
        throw new ApiError(500, "Couldn't get projects please try again: " + error.message)
    }
})

//get single project
const getProject = asyncHandler(async(req, res) => {
    try {
        const { projectId } = req.params;
        
        const project = await Project.findById(projectId)
            .populate('createdBy', 'firstName lastName')
            .populate('team', 'firstName lastName avatar');
        
        if(!project) {
            throw new ApiError(404, "Project not found")
        }

        const isAuthorized = project.createdBy.toString() === req.user.id || project.team.some(
            (teamId) => teamId.toString() === req.user.id
        );
                            
        if(!isAuthorized) {
            throw new ApiError(403, "Not authorized to view this project")
        }
        
        return res.status(200).json(new ApiResponse(200, project, "Project retrieved successfully"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while finding project, please try again: " + error.message)
    }
})

//add new team members in project


export { 
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    getProject
}