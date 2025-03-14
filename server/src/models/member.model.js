import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const memberSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: Types.ObjectId,
      ref: "Role",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Member = model("Member", memberSchema);
export default Member;
