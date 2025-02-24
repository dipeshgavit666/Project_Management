import mongoose, { model, Schema } from "mongoose"

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


const User = model("User", userSchema)
export default User