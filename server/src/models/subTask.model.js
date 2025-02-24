// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const subTaskSchema = new Schema({
//   title: { 
//     type: String,
//     required: true, 
//     trim: true 
// },
//   description: { 
//     type: String, 
//     trim: true 
// },
//   parentTask: { 
//     type: Schema.Types.ObjectId, 
//     ref: 'Task', 
//     required: true 
// },
//   project: { 
//     type: Schema.Types.ObjectId, 
//     ref: 'Project', 
//     required: true 
// },
//   organization: { 
//     type: Schema.Types.ObjectId, 
//     ref: 'Organization', 
//     required: true 
// },
//   assignedTo: { 
//     type: Schema.Types.ObjectId, 
//     ref: 'User' 
// },
//   status: {
//     type: String,
//     enum: ['todo', 'in_progress', 'review', 'completed'],
//     default: 'todo'
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high'],
//     default: 'medium'
//   },
//   dueDate: { 
//     type: Date 
// },
//   estimatedHours: { 
//     type: Number 
// },
//   actualHours: { 
//     type: Number 
// },
//   completionPercentage: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 0
//   },
//   createdBy: { 
//     type: Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
// },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
// },
//   updatedAt: { 
//     type: Date, 
//     default: Date.now 
// }
// });