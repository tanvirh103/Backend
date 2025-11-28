import { AuthReq } from "../middleware/authMiddleWare";
import { User } from "../schema/user.schema";
import { ApiResponse } from "../utils/Apiresponse";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All required fields must be provided"));
  }
  const isEmailUnique = await User.findOne({ email });
  if (isEmailUnique) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Email is already in use"));
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Password and Confirm Password do not match"));
  }
  const passhash = await bcrypt.hash(password, 10);
  try {
    const newUser = {
      name,
      email,
      password: passhash,
      role,
    };
    const result = await User.create(newUser);
    if (!result) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Failed to create user"));
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: String(result._id), name: result.name, email: result.email },
          "User created successfully",
        ),
      );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const logIn = asyncHandler(async (req, res) => {
  const { email, password, remember } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Email and Password are required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(400, "No account found with this email"));
    }
    const expires = remember === "on" ? 12 * 60 * 60 : 1 * 24 * 60 * 60;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      if (!user.isApproved) {
        return res
          .status(403)
          .json(new ApiResponse(403, "Your account is not approved yet"));
      }
      if (user.isBlocked) {
        return res
          .status(403)
          .json(new ApiResponse(403, "Your account is blocked"));
      }
      const token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: expires },
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user: user._id, role: user.role, token, expires },
            "Login successful",
          ),
        );
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, "Invalid email or password"));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const updateProfile = asyncHandler(async (req: AuthReq, res) => {
  const userId = req.params.userId;
  const { name, bio, skills, experience, resume } = req.body;
  const authUserId = (req.user as any)?._id;

  if (authUserId !== userId) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "You are not authorized to update this profile"),
      );
  }
  const updateUser = {
    name,
    bio,
    skills,
    experience,
    resume,
  };
  try {
    const result = await User.findByIdAndUpdate(userId, updateUser);
    if (!result) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Failed to update user profile"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, result, "User profile updated successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const updatedPassword = asyncHandler(async (req: AuthReq, res) => {
  const userId = req.params.userId;
  const { oldPassword, password, confirmPassword } = req.body;
  const findUser = await User.findById(userId);
  const authUserId = (req.user as any)?._id;
  if (findUser?.id !== authUserId)
    return res
      .status(400)
      .json(new ApiResponse(400, "You are not permitted to update info!"));
  if (!findUser)
    return res.status(404).json(new ApiResponse(404, "User not found!"));
  if (password !== confirmPassword)
    return res
      .status(400)
      .json(new ApiResponse(400, "Passwords do not match!"));
  const isValid = await bcrypt.compare(oldPassword, findUser.password);
  if (!isValid)
    return res
      .status(400)
      .json(new ApiResponse(400, "Old password does not match!"));
  const passhash = await bcrypt.hash(password, 10);
  try {
    const result = await User.findByIdAndUpdate(userId, {
      password: passhash,
    });
    if (!result)
      return res
        .status(400)
        .json(new ApiResponse(400, "failed to change password"));

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Password changed successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const getUserInfo = asyncHandler(async (req: AuthReq, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User found successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const getAllUsers = asyncHandler(async (req: AuthReq, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password",
    );
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const toggleIsBlocked = asyncHandler(async (req: AuthReq, res) => {
  const userId = req.params.userId;
  const authUserId = (req.user as any)?._id;
  const isAdmin = await User.findById(authUserId);
  if (isAdmin?.role !== "admin") {
    return res.status(403).json(new ApiResponse(403, "Forbidden: Admins only"));
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          `User has been ${
            user.isBlocked ? "blocked" : "unblocked"
          } successfully`,
        ),
      );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const toggleIsApproved = asyncHandler(async (req: AuthReq, res) => {
  const userId = req.params.userId;
  const authUserId = (req.user as any)?._id;
  const isAdmin = await User.findById(authUserId);
  if (isAdmin?.role !== "admin") {
    return res.status(403).json(new ApiResponse(403, "Forbidden: Admins only"));
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    user.isApproved = !user.isApproved;
    await user.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          `User has been ${
            user.isApproved ? "approved" : "disapproved"
          } successfully`,
        ),
      );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});
