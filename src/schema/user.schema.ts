import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "employer", "jobseeker"],
      default: "jobseeker",
    },
    isApproved: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    bio: { type: String },
    skills: { type: [String] },
    experience: { type: String ,default:null},
    resume: { type: String,default:null },
  },
  { timestamps: true },
);
export const User = mongoose.model("User", UserSchema);