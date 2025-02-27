import mongoose, { model, Schema } from "mongoose"

const commentSchema = new Schema({
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  task: { 
    type: Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true 
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const  Comment  = model("Comment",  commentSchema)
export default Comment