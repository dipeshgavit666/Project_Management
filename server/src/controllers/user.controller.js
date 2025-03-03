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
        const { email, password } = req.body;

        const user = User.findOne({email});
        if(!user){
            throw new ApiError(401, "Invalid credentials")
        }

        const isMatch = await User.isPasswordCorrect(password)
        if(!isMatch){
            throw new ApiError(401, "incorrect password")
        }

        const {accessToken, refreshToken} = generateAccessAndRefreshToken(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
        // if(!loggedInUser){
        //     throw new ApiError(401, "Something went wrong while logging in")
        // }


        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            {user: loggedInUser, accessToken, refreshToken},
             "User logged in successfully"))
    } catch (error) {
        throw new ApiError(401, "Something went wrong while loging in")
    }
})

export {
    registerUser,
    loginUser
}