import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote"],
      required: true,
    },
    isAcceptingApplications: { type: Boolean, default: true },
    salaryRange: String,
    description: String,

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Job = mongoose.model("Job", JobSchema);