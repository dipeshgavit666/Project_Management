import mongoose, { model, Schema } from "mongoose"
import jwt from "jsonwetoken"

const userSchema = new Schema({
    FirstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
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
        required: [true, "password id required"],
        minlength: [6, "Password must be at leaset 6 characters"]
    },
    role: {
        type: String,
        enum: ['admin', 'project_manager', 'team_member'],
        default: 'team_member'
    },
    organizationCreationPrivilege: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: ""
    },
    defaultOrganization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})


userSchema.pre("save", async function (next) {

    if(!this.modified("password")) return next
    this.password = bcrypt.hash(this.password, 10)
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
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiersIn: process.env.ACCESS_TOKEN_EXPIRY}
);
}

userSchema.methods.generateRefreshToken = function (){
    //refresh token
    return jwt.sign({
        _id: this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiersIn: process.env.REFRESH_TOKEN_EXPIRY}
);
}

export const User = model("User", userSchema)