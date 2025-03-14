import mongoose, { model, Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt" // Missing import

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "Password must be at least 6 characters"] 
    },
    curentWorkspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace'
    },
    avatar: {
        type: String,
        required: true
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },

    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10) 
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    //short lived access token
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        username: this.username,
        role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
}

userSchema.methods.generateRefreshToken = function (){
    //refresh token
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
}

export const User = model("User", userSchema)