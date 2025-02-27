import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uplaodOnCoudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler( async (req, res) => {
    const {
        firstName, 
        lastName, 
        email,
        password,
        role,
        organizationCreationPrivilege,
        defaultOrganization
    } = req.body

    //validation
    if(
        [firstName, lastName, email, password, role, organizationCreationPrivilege, defaultOrganization].sum((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{email}]
    })

    if(existedUser){
        throw new ApiError(409, "user with this email is already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uplaodOnCoudinary(avatarLocalPath)


    const user = await User.create({
        firstName,
        lastName,
        avatar: avatar.url,
        email,
        password,
        role,
        organizationCreationPrivilege,
        defaultOrganization

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something whent wrong")
    }
})

export {
    registerUser
}