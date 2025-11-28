import z from "zod";

export const loginDto = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const userValidationSchema = z
  .object({
    name: z
      .string({
        message: "Name is required",
      })
      .min(1, "Name cannot be empty")
      .max(100, "Name cannot exceed 100 characters")
      .trim(),

    email: z
      .email("Please provide a valid email address")
      .min(1, "Email cannot be empty")
      .max(255, "Email cannot exceed 255 characters")
      .trim()
      .toLowerCase(),

    password: z
      .string({
        message: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      ),
    confirmPassword: z
      .string({
        message: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      ),
    role: z
      .enum(['admin', 'employer', 'jobseeker']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const updateUserValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name cannot exceed 100 characters")
    .trim()
    .optional(),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  skills: z
    .array(
      z
        .string()
        .min(1, "Skill cannot be empty")
        .max(50, "Skill cannot exceed 50 characters")
        .trim(),
    )
    .max(20, "Cannot have more than 20 skills")
    .optional(),

  experience: z
    .string().trim()
    .max(20, "Experience cannot exceed 20 characters")
    .optional(),

resume: z
  .url("Resume must be a valid URL")
  .optional()
  .or(z.literal(""))
});

export const updatePasswordDto = z
  .object({
    oldPassword: z.string({message: "Old password is required"}).trim().min(8).nonempty(),
    password: z.string({message: "New password is required"}).trim().min(8).nonempty(),
    confirmPassword: z.string({message: "Confirm password is required"}).trim().min(8).nonempty(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "does not match",
    path: ["confirmPassword"],
  });
