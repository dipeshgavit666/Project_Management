import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    const {
        firstName, 
        lastName, 
        email,
        password,
        role,
    } = req.body

    // Basic validation
    if(!firstName || !lastName || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with this email already exists")
    }

    // Make avatar optional
    let avatarUrl = "";
    
    // Check if avatar file exists and upload only if it does
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    if(avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        if(avatar && avatar.url) {
            avatarUrl = avatar.url;
        }
    }

    // Create user with optional avatar
    const user = await User.create({
        firstName,
        lastName,
        avatar: avatarUrl, // This will be empty string if no avatar was uploaded
        email,
        password,
        role: role || "team_member", // Make role optional too with default
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"))
})

export {
    registerUser
}