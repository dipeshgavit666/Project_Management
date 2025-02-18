import mongoose, { model, Schema } from "mongoose";

const OrganizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    logo: {
        type: String
    },
    website: {
        type: String
    },
    industry: {
        type: String,
        trim: true
    },
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
        default: '1-10'
    },
    status: {
        type: String,
        rnum: ['active', 'inactive', 'suspemded'],
        default: 'active'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subsritionPlan: {
        type: String,
        rnum: ['free', 'basic', 'professional', 'enterprise'],
        default: 'free'
    },
    SubscriptionStatus: {
        type: String,
        enum: ['active', 'trial', 'expired'],
        default: 'trial'
    }

}, {
    timestamps: true
})

const Organization = model("Organization", OrganizationSchema)
export default Organization