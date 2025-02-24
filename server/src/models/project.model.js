import mongoose, { model, Schema } from "mongoose"

const projectSchema = new Schema({
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
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    team: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

}, {
    timestamps: true
})

const Project = model("Project", projectSchema)
export default Project