import { User } from "../models/user.model.js";
import jwt, { decode } from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const verifyJWT = asyncHandler( async(req, _, next) => {

    const token = req.cookies.accesstoken || req.headder("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(401, "Unauthorized")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user  = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if(!user){
            throw new  ApiError(401, "Unautorized")
        }

        req.user = user
        req.user.id = User._id

        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})