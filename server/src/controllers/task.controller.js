import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { getMemberRoleInWorkspace } from "../services/member.service.js";
import { roleGuard } from "../utils/roleGuard.js";
import { Permissions } from "../enums/role.enum.js";
import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from "../services/task.service.js";

// Manual validation functions (replacing Zod)
const validateString = (value) => (typeof value === "string" && value.trim() !== "") ? value : null;

export const createTaskController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const body = req.body;
  const projectId = validateString(req.params.projectId);
  const workspaceId = validateString(req.params.workspaceId);

  if (!projectId || !workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid project or workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.CREATE_TASK]);

  const { task } = await createTaskService(workspaceId, projectId, userId, body);

  return res.status(HTTPSTATUS.OK).json({
    message: "Task created successfully",
    task,
  });
});

export const updateTaskController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const body = req.body;
  const taskId = validateString(req.params.id);
  const projectId = validateString(req.params.projectId);
  const workspaceId = validateString(req.params.workspaceId);

  if (!taskId || !projectId || !workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid task, project, or workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.EDIT_TASK]);

  const { updatedTask } = await updateTaskService(workspaceId, projectId, taskId, body);

  return res.status(HTTPSTATUS.OK).json({
    message: "Task updated successfully",
    task: updatedTask,
  });
});

export const getAllTasksController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const workspaceId = validateString(req.params.workspaceId);
  
  if (!workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid workspace ID" });
  }

  const filters = {
    projectId: req.query.projectId,
    status: req.query.status ? req.query.status.split(",") : undefined,
    priority: req.query.priority ? req.query.priority.split(",") : undefined,
    assignedTo: req.query.assignedTo ? req.query.assignedTo.split(",") : undefined,
    keyword: req.query.keyword,
    dueDate: req.query.dueDate,
  };

  const pagination = {
    pageSize: parseInt(req.query.pageSize) || 10,
    pageNumber: parseInt(req.query.pageNumber) || 1,
  };

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const result = await getAllTasksService(workspaceId, filters, pagination);

  return res.status(HTTPSTATUS.OK).json({
    message: "All tasks fetched successfully",
    ...result,
  });
});

export const getTaskByIdController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const taskId = validateString(req.params.id);
  const projectId = validateString(req.params.projectId);
  const workspaceId = validateString(req.params.workspaceId);

  if (!taskId || !projectId || !workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid task, project, or workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const task = await getTaskByIdService(workspaceId, projectId, taskId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Task fetched successfully",
    task,
  });
});

export const deleteTaskController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const taskId = validateString(req.params.id);
  const workspaceId = validateString(req.params.workspaceId);

  if (!taskId || !workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid task or workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.DELETE_TASK]);

  await deleteTaskService(workspaceId, taskId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Task deleted successfully",
  });
});
