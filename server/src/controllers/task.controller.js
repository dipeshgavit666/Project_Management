import { Task } from "../models/task.model.js"
import { Project } from "../models/project.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler"

// create task
const createTask = asyncHandler( async(req,res) => {
    try {
        const project = Project.findById(req.boody.project);
            if(!project){
                throw new ApiError(401, "somethinf went wrong while creating task")
            }

            //check if user is part of the project
            const isMember = project.team.some(
                (team) => team.user.toString() === req.user._id.toString()
            )

            if(!isMember){
                throw new ApiError(403, "must be a member of the project to create a task")
            }

            const task = await Task.create({
                ... req.boody,
                author: req.user._id
            })

            return res
            .status(201)
            .json(new ApiResponse(201, createTask, "Task created successfully"))
        
    } catch (error) {
        throw new ApiError(401, "something went wrong while creating task")
    }
})



// delete task
const deleteTask = asyncHandler( async(req,res) => {
    try {
        
    } catch (error) {
        throw new ApiError(401, "something went wrong while deleting task")
    }
})

// update task
const updateTask = asyncHandler( async(req,res) => {
    try {
        
    } catch (error) {
        throw new ApiError(401, "something went wrong while updating task")
    }
})

// get all tasks
const getAllTasks = asyncHandler( async(req,res) => {
    try {
        
    } catch (error) {
        throw new ApiError(401, "something went wrong while getting all tasks")
    }
})

// get a single task
const getTask = asyncHandler( async(req,res) => {
    try {
        
    } catch (error) {
        throw new ApiError(401, "something went wrong while getting task")
    }
})