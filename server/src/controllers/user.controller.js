import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = User.findOne(userId)
    
        if(!user){
            throw new ApiError(401, "user not exists")
        }
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }

}


const registerUser = asyncHandler(async (req, res) => {
    const {
        firstName, 
        lastName, 
        email,
        password,
        role,
    } = req.body

    if(!firstName || !lastName || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }


    const avatarLocalPath = req.files?.avatar?.[0]?.path
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const existedUser = await User.findOne({
        $or: [{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with this email already exists")
    }

    // Upload avatar to Cloudinary
    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // if(!avatar || !avatar.url) {
    //     throw new ApiError(500, "Error uploading avatar to Cloudinary")
    // }

    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log("Uploaded avatar", avatar)
    } catch (error) {
        console.log("Error uploading avatar", error)
        throw new ApiError(500, "Failed to uplaod avatar")
    }


    try {
        const user = await User.create({
            firstName,
            lastName,
            avatar: avatar.url,
            email,
            password,
            role: role || "team_member",
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
    } catch (error) {
        console.log("User creation failed")

        if(avatar){
            await deleteFromCloudinary(avatar.public_id)
        }

        throw new ApiError(500, "Something went wrong while creting a user and avatar image is deleted")
    }
})


const  loginUser = asyncHandler(async (req,res) => {
    try {
        
    } catch (error) {
        
    }
})

export {
    registerUser
}