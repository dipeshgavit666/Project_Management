import mongoose from "mongoose";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum.js";
import { generateTaskCode } from "../utils/uuid.js";

const { Schema, model, Types } = mongoose;

const taskSchema = new Schema(
  {
    taskCode: {
      type: String,
      unique: true,
      default: generateTaskCode,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    project: {
      type: Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatusEnum),
      default: TaskStatusEnum.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriorityEnum),
      default: TaskPriorityEnum.MEDIUM,
    },
    assignedTo: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = model("Task", taskSchema);
export default TaskModel;
