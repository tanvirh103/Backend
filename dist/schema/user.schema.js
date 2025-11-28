"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
    experience: { type: String, default: null },
    resume: { type: String, default: null },
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", UserSchema);
