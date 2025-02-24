import mongoose, { model, Schema } from "mongoose"
import { OrganizationMembership, OrganizationMembership } from ".";

const organizationMembershipSchema = new Schema({
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  joinedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const OrganizationMembership = model("OrganizationMembership", organizationMembershipSchema) 
export default OrganizationMembership
