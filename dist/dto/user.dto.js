"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordDto = exports.updateUserValidationSchema = exports.userValidationSchema = exports.loginDto = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginDto = zod_1.default.object({
    email: zod_1.default.email({ message: "Invalid email address" }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
exports.userValidationSchema = zod_1.default
    .object({
    name: zod_1.default
        .string({
        message: "Name is required",
    })
        .min(1, "Name cannot be empty")
        .max(100, "Name cannot exceed 100 characters")
        .trim(),
    email: zod_1.default
        .email("Please provide a valid email address")
        .min(1, "Email cannot be empty")
        .max(255, "Email cannot exceed 255 characters")
        .trim()
        .toLowerCase(),
    password: zod_1.default
        .string({
        message: "Password is required",
    })
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password cannot exceed 100 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    confirmPassword: zod_1.default
        .string({
        message: "Password is required",
    })
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password cannot exceed 100 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    role: zod_1.default
        .enum(['admin', 'employer', 'jobseeker']),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
});
exports.updateUserValidationSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(1, "Name cannot be empty")
        .max(100, "Name cannot exceed 100 characters")
        .trim()
        .optional(),
    bio: zod_1.default.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
    skills: zod_1.default
        .array(zod_1.default
        .string()
        .min(1, "Skill cannot be empty")
        .max(50, "Skill cannot exceed 50 characters")
        .trim())
        .max(20, "Cannot have more than 20 skills")
        .optional(),
    experience: zod_1.default
        .string().trim()
        .max(20, "Experience cannot exceed 20 characters")
        .optional(),
    resume: zod_1.default
        .url("Resume must be a valid URL")
        .optional()
        .or(zod_1.default.literal(""))
});
exports.updatePasswordDto = zod_1.default
    .object({
    oldPassword: zod_1.default.string({ message: "Old password is required" }).trim().min(8).nonempty(),
    password: zod_1.default.string({ message: "New password is required" }).trim().min(8).nonempty(),
    confirmPassword: zod_1.default.string({ message: "Confirm password is required" }).trim().min(8).nonempty(),
})
    .refine((data) => data.confirmPassword === data.password, {
    message: "does not match",
    path: ["confirmPassword"],
});
