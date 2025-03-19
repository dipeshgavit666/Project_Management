import mongoose, {Schema} from "mongoose";

const inviteCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
        uniqe: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // }
    
}, {
    timestamps: true
})

export const InviteCode = mongoose.model("InviteCode", inviteCodeSchema)