import mongoose, { model, Schema } from "mongoose"

const taskSchema = new Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
},
  description: { 
    type: String, 
    trim: true 
},
  project: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
},
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: { 
    type: Date 
},
  createdAt: { 
    type: Date, 
    default: Date.now 
},
  updatedAt: { 
    type: Date, 
    default: Date.now 
}
});

export const Task = model("Task", taskSchema)