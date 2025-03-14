import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { getMemberRoleInWorkspace } from "../services/member.service.js";
import { roleGuard } from "../utils/roleGuard.js";
import { Permissions } from "../enums/role.enum.js";
import {
  createProjectService,
  deleteProjectService,
  getProjectAnalyticsService,
  getProjectByIdAndWorkspaceIdService,
  getProjectsInWorkspaceService,
  updateProjectService,
} from "../services/project.service.js";

// Utility function for manual validation (alternative to Zod)
const validateString = (value) => (typeof value === "string" && value.trim() !== "") ? value : null;

export const createProjectController = asyncHandler(async (req, res) => {
  const body = req.body;
  const workspaceId = validateString(req.params.workspaceId);
  const userId = req.user?._id;

  if (!workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.CREATE_PROJECT]);

  const { project } = await createProjectService(userId, workspaceId, body);

  return res.status(HTTPSTATUS.CREATED).json({
    message: "Project created successfully",
    project,
  });
});

export const getAllProjectsInWorkspaceController = asyncHandler(async (req, res) => {
  const workspaceId = validateString(req.params.workspaceId);
  const userId = req.user?._id;

  if (!workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const pageSize = parseInt(req.query.pageSize) || 10;
  const pageNumber = parseInt(req.query.pageNumber) || 1;

  const { projects, totalCount, totalPages, skip } =
    await getProjectsInWorkspaceService(workspaceId, pageSize, pageNumber);

  return res.status(HTTPSTATUS.OK).json({
    message: "Projects fetched successfully",
    projects,
    pagination: { totalCount, pageSize, pageNumber, totalPages, skip, limit: pageSize },
  });
});

export const getProjectByIdAndWorkspaceIdController = asyncHandler(async (req, res) => {
  const projectId = validateString(req.params.id);
  const workspaceId = validateString(req.params.workspaceId);
  const userId = req.user?._id;

  if (!projectId || !workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid project or workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { project } = await getProjectByIdAndWorkspaceIdService(workspaceId, projectId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Project fetched successfully",
    project,
  });
});

export const getProjectAnalyticsController = asyncHandler(async (req, res) => {
  const projectId = validateString(req.params.id);
  const workspaceId = validateString(req.params.workspaceId);
  const userId = req.user?._id;

  if (!projectId || !workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid project or workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.VIEW_ONLY]);

  const { analytics } = await getProjectAnalyticsService(workspaceId, projectId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Project analytics retrieved successfully",
    analytics,
  });
});

export const updateProjectController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const projectId = validateString(req.params.id);
  const workspaceId = validateString(req.params.workspaceId);
  const body = req.body;

  if (!projectId || !workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid project or workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.EDIT_PROJECT]);

  const { project } = await updateProjectService(workspaceId, projectId, body);

  return res.status(HTTPSTATUS.OK).json({
    message: "Project updated successfully",
    project,
  });
});

export const deleteProjectController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const projectId = validateString(req.params.id);
  const workspaceId = validateString(req.params.workspaceId);

  if (!projectId || !workspaceId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid project or workspace ID" });
  }

  const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
  roleGuard(role, [Permissions.DELETE_PROJECT]);

  await deleteProjectService(workspaceId, projectId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Project deleted successfully",
  });
});
