"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });
exports.Job = mongoose_1.default.model("Job", JobSchema);
