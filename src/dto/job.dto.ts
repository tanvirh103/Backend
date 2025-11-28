import { z } from 'zod';
import mongoose from 'mongoose';

export const jobValidationSchema = z.object({
  title: z.string({ message: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),

  company: z.string({ message: "Company is required" })
    .trim()
    .min(1, "Company cannot be empty")
    .max(100, "Company name cannot exceed 100 characters"),

  location: z.string({ message: "Location is required" })
    .trim()
    .min(1, "Location cannot be empty")
    .max(100, "Location cannot exceed 100 characters"),

  jobType: z.enum(['Full-time', 'Part-time', 'Remote']),

  salaryRange: z.string({ message: "Salary range must be a string" })
    .max(50, "Salary range cannot exceed 50 characters")
    .optional()
    .default(""),

  description: z.string({ message: "Description must be a string" })
    .max(5000, "Description cannot exceed 5000 characters")
    .optional()
    .default(""),

  employer: z.string({ message: "Employer ID is required" })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid employer ID format"
    }),
});

export const updateJob = jobValidationSchema.partial().omit({employer:true});