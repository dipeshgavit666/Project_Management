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