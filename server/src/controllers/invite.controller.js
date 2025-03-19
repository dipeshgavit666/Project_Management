import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { InviteCode } from "../models/inviteCode.model.js"
import { generateRandomCode } from "../utils/codeGenerator.js";
import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//generate invite code
export const generateInviteCode = asyncHandler( async(req, res) => {
    const { projectId, customCode } = req.body;

    const project  = await Project.findOne(projectId)
    if(!project){
        throw new ApiError(401, "Project not found")
    }

    if(project.createdBy.toString() !== req.user.id && !project.team.includes(req.user.id)){
        throw new ApiError(403, "Not authorized to generate invite codes for this project")
    }

    let code = customCode || generateRandomCode();

    const existingCode = await InviteCode.findOne({ code });
    if (existingCode) {
      
      if (customCode) {
        throw new ApiError(400, "This code is already in use. Please try a different one.")
      }
      code = generateRandomCode();
    }

    const inviteCode = new InviteCode({
        code,
        projectId,
        createdBy: req.user.id
      });
      
    await inviteCode.save();

    return res.status(201).json( new ApiResponse(201, inviteCode.code, "Invite code generated successfully"))

})

//join project using invite code
export const joinProjectWithCode = asyncHandler(async (req, res) => {
    try {
      const { code } = req.body;
      
      const inviteCode = await InviteCode.findOne({ 
        code, 
        isActive: true,
        expiresAt: { $gt: new Date() }
      });
      
      if (!inviteCode) {
        throw new ApiError(404, "Invalid or expired invitr code")
      }
      
      const project = await Project.findById(inviteCode.projectId);
      
      if (!project) {
        throw new ApiError(404, "Project not found")
      }
      
      if (project.team.includes(req.user.id) || project.createdBy.toString() === req.user.id) {
        throw new ApiError(400, "You are already a member of this project")
      }
      
      project.teamMembers.push(req.user.id);
      await project.save();
      
      return res.status(200).json({
        success: true,
        message: 'Successfully joined the project',
        project: {
          id: project._id,
          name: project.name
        }
      });
      
    } catch (error) {
        throw new ApiError(500, "Error joining project")
    }
  });





// List all active invite codes for a project
export const getProjectInviteCodes = asyncHandler( async (req, res) => {
    try {
      const { projectId } = req.params;

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (project.createdBy.toString() !== req.user.id && 
          !project.team.includes(req.user.id) && 
          !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view invite codes for this project'
        });
      }
      

      const inviteCodes = await InviteCode.find({ 
        projectId, 
        isActive: true,
        expiresAt: { $gt: new Date() }
      }).select('code createdAt expiresAt');
      
      return res.status(200).json({
        success: true,
        inviteCodes
      });
      
    } catch (error) {
      console.error('Error getting project invite codes:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  });
  
  



// Deactivate an invite code
export const deactivateInviteCode = asyncHandler(async (req, res) => {
    try {
      const { codeId } = req.params;
      
      const inviteCode = await InviteCode.findById(codeId);
      
      if (!inviteCode) {
        return res.status(404).json({
          success: false,
          message: 'Invite code not found'
        });
      }
      
      // Check user permission
      const project = await Project.findById(inviteCode.projectId);
      
      if (!project) {
        throw new ApiError(404, "Project not found")
      }
      
      if (project.createdBy.toString() !== req.user.id && 
          !project.team.includes(req.user.id) && 
          !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to deactivate invite codes for this project'
        });
      }
      
      // Deactivatecode
      inviteCode.isActive = false;
      await inviteCode.save();
      
      return res.status(200).json({
        success: true,
        message: 'Invite code deactivated successfully'
      });
      
    } catch (error) {
      console.error('Error deactivating invite code:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  });
