import mongoose, { model, Schema } from "mongoose";
import { generateInviteCode } from "../utils/uuid.js"

const workspaceSchema = new Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
        maxlength: [60, "you can use more than 60 characters"]
    },
    description: {
        type: String,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true,
        default: generateInviteCode
    },
}, {
    timestamps: true
})

workspaceSchema.methods.resetInviteCode = function() {
    this.inviteCode = generateInviteCode()
}

export const Workspace = model("Project", workspaceSchema)
