"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJob = exports.jobValidationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.jobValidationSchema = zod_1.z.object({
    title: zod_1.z.string({ message: "Title is required" })
        .trim()
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters"),
    company: zod_1.z.string({ message: "Company is required" })
        .trim()
        .min(1, "Company cannot be empty")
        .max(100, "Company name cannot exceed 100 characters"),
    location: zod_1.z.string({ message: "Location is required" })
        .trim()
        .min(1, "Location cannot be empty")
        .max(100, "Location cannot exceed 100 characters"),
    jobType: zod_1.z.enum(['Full-time', 'Part-time', 'Remote']),
    salaryRange: zod_1.z.string({ message: "Salary range must be a string" })
        .max(50, "Salary range cannot exceed 50 characters")
        .optional()
        .default(""),
    description: zod_1.z.string({ message: "Description must be a string" })
        .max(5000, "Description cannot exceed 5000 characters")
        .optional()
        .default(""),
    employer: zod_1.z.string({ message: "Employer ID is required" })
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid employer ID format"
    }),
});
exports.updateJob = exports.jobValidationSchema.partial().omit({ employer: true });
