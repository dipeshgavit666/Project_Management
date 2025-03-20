import { Task } from "../models/task.model.js"
import { Project } from "../models/project.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// create task
const createTask = asyncHandler( async(req,res) => {
    try {
        const project = await Project.findById(req.body.project);
            if(!project){
                throw new ApiError(404, "Project not found")
            }

            const isMember = project.createdBy.toString() === req.user.id || project.team.some(
                (teamId) => teamId.toString() === req.user.id
            );

            if(!isMember){
                throw new ApiError(403, "must be a member of the project to create a task")
            }

            const task = await Task.create({
                ... req.body,
                author: req.user.id
            })

            return res
            .status(201)
            .json(new ApiResponse(201, task, "Task created successfully"))
        
    } catch (error) {
        throw new ApiError(401, "something went wrong while creating task")
    }
})



// delete task
const deleteTask = asyncHandler( async(req,res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId)

        if(!task){
            throw new ApiError(404, "Task not found")
        }

        const project = await Project.findById(task.project)
        if(!project) {
            throw new ApiError(404, "Proect not found")
        }

        const tisAuthorized = project.createdBy.toString() === req.user.id ||  project.team.some(
            (teamId)  => teamId.toString()  === reeqq.user.id
        )

        if(!isAuthorized) {
            throw new ApiError(403, "Not authorized to delete this task")
        }


        await Task.findByIdAndDelete(taskId)

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Task deleted successfully"))
        

    } catch (error) {
        throw new ApiError(500, "something went wrong while deleting task" + error.message)
    }
})

// update task
const updateTask = asyncHandler( async(req,res) => {
    try {
            const taskId = req.params.id;
            const updateData = req.body;
            
            const task = await Task.findById(taskId);
            if(!task) {
                throw new ApiError(404, "Task not found")
            }

            const project = await Project.findById(task.project);
            if(!project) {
                throw new ApiError(404, "Project not found")
            }

            const isAuthorized = project.createdBy.toString() === req.user.id || project.team.some(
                (teamId) => teamId.toString() === req.user.id
            );
    
            if(!isAuthorized) {
                throw new ApiError(403, "Not authorized to update this task")
            }
    
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                {
                    $set: updateData
                },
                { new: true }
            );
    
            return res
                .status(200)
                .json(new ApiResponse(200, updatedTask, "Task updated successfully"))
            
        } catch (error) {
            throw new ApiError(500, "Something went wrong while updating task: " + error.message)
        }
})

// get all tasks for a project
const getAllTasks = asyncHandler(async(req, res) => {
    try {
        const { projectId } = req.params;
        
        const project = await Project.findById(projectId);
        if(!project) {
            throw new ApiError(404, "Project not found")
        }

        const isAuthorized = project.createdBy.toString() === req.user.id || 
                            project.team.some(
                                (teamId) => teamId.toString() === req.user.id
                            );

        if(!isAuthorized) {
            throw new ApiError(403, "Not authorized to view tasks for this project")
        }

        const tasks = await Task.find({ project: projectId })
            .populate('assignedTo', 'firstName lastName avatar')
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"))
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while getting tasks: " + error.message)
    }
})

// get a single task
const getTask = asyncHandler(async(req, res) => {
    try {
        const taskId = req.params.id;
        
        const task = await Task.findById(taskId)
            .populate('assignedTo', 'firstName lastName avatar');
        
        if(!task) {
            throw new ApiError(404, "Task not found")
        }

        const project = await Project.findById(task.project);
        if(!project) {
            throw new ApiError(404, "Project not found")
        }

        const isAuthorized = project.createdBy.toString() === req.user.id || project.team.some(
            (teamId) => teamId.toString() === req.user.id
        );

        if(!isAuthorized) {
            throw new ApiError(403, "Not authorized to view this task")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, task, "Task retrieved successfully"))
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while getting task: " + error.message)
    }
})


export {
    createTask,
    deleteTask,
    updateTask,
    getAllTasks,
    getTask
}