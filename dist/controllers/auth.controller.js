"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleIsApproved = exports.toggleIsBlocked = exports.getAllUsers = exports.getUserInfo = exports.updatedPassword = exports.updateProfile = exports.logIn = exports.createUser = void 0;
const user_schema_1 = require("../schema/user.schema");
const Apiresponse_1 = require("../utils/Apiresponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.createUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirmPassword, role } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "All required fields must be provided"));
    }
    const isEmailUnique = yield user_schema_1.User.findOne({ email });
    if (isEmailUnique) {
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "Email is already in use"));
    }
    if (password !== confirmPassword) {
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "Password and Confirm Password do not match"));
    }
    const passhash = yield bcryptjs_1.default.hash(password, 10);
    try {
        const newUser = {
            name,
            email,
            password: passhash,
            role,
        };
        const result = yield user_schema_1.User.create(newUser);
        if (!result) {
            return res
                .status(500)
                .json(new Apiresponse_1.ApiResponse(500, "Failed to create user"));
        }
        return res
            .status(201)
            .json(new Apiresponse_1.ApiResponse(201, { id: String(result._id), name: result.name, email: result.email }, "User created successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.logIn = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, remember } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "Email and Password are required"));
    }
    try {
        const user = yield user_schema_1.User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json(new Apiresponse_1.ApiResponse(400, "No account found with this email"));
        }
        const expires = remember === "on" ? 12 * 60 * 60 : 1 * 24 * 60 * 60;
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (isPasswordValid) {
            if (!user.isApproved) {
                return res
                    .status(403)
                    .json(new Apiresponse_1.ApiResponse(403, "Your account is not approved yet"));
            }
            if (user.isBlocked) {
                return res
                    .status(403)
                    .json(new Apiresponse_1.ApiResponse(403, "Your account is blocked"));
            }
            const token = yield jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: expires });
            return res
                .status(200)
                .json(new Apiresponse_1.ApiResponse(200, { user: user._id, role: user.role, token, expires }, "Login successful"));
        }
        else {
            return res
                .status(400)
                .json(new Apiresponse_1.ApiResponse(400, "Invalid email or password"));
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.updateProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.userId;
    const { name, bio, skills, experience, resume } = req.body;
    const authUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (authUserId !== userId) {
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "You are not authorized to update this profile"));
    }
    const updateUser = {
        name,
        bio,
        skills,
        experience,
        resume,
    };
    try {
        const result = yield user_schema_1.User.findByIdAndUpdate(userId, updateUser);
        if (!result) {
            return res
                .status(500)
                .json(new Apiresponse_1.ApiResponse(500, "Failed to update user profile"));
        }
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, result, "User profile updated successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.updatedPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.userId;
    const { oldPassword, password, confirmPassword } = req.body;
    const findUser = yield user_schema_1.User.findById(userId);
    const authUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if ((findUser === null || findUser === void 0 ? void 0 : findUser.id) !== authUserId)
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "You are not permitted to update info!"));
    if (!findUser)
        return res.status(404).json(new Apiresponse_1.ApiResponse(404, "User not found!"));
    if (password !== confirmPassword)
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "Passwords do not match!"));
    const isValid = yield bcryptjs_1.default.compare(oldPassword, findUser.password);
    if (!isValid)
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "Old password does not match!"));
    const passhash = yield bcryptjs_1.default.hash(password, 10);
    try {
        const result = yield user_schema_1.User.findByIdAndUpdate(userId, {
            password: passhash,
        });
        if (!result)
            return res
                .status(400)
                .json(new Apiresponse_1.ApiResponse(400, "failed to change password"));
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, result, "Password changed successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.getUserInfo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const user = yield user_schema_1.User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json(new Apiresponse_1.ApiResponse(404, "User not found"));
        }
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, user, "User found successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_schema_1.User.find({ role: { $ne: "admin" } }).select("-password");
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, users, "Users fetched successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.toggleIsBlocked = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.userId;
    const authUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const isAdmin = yield user_schema_1.User.findById(authUserId);
    if ((isAdmin === null || isAdmin === void 0 ? void 0 : isAdmin.role) !== "admin") {
        return res.status(403).json(new Apiresponse_1.ApiResponse(403, "Forbidden: Admins only"));
    }
    try {
        const user = yield user_schema_1.User.findById(userId);
        if (!user) {
            return res.status(404).json(new Apiresponse_1.ApiResponse(404, "User not found"));
        }
        user.isBlocked = !user.isBlocked;
        yield user.save();
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, user, `User has been ${user.isBlocked ? "blocked" : "unblocked"} successfully`));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.toggleIsApproved = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.userId;
    const authUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const isAdmin = yield user_schema_1.User.findById(authUserId);
    if ((isAdmin === null || isAdmin === void 0 ? void 0 : isAdmin.role) !== "admin") {
        return res.status(403).json(new Apiresponse_1.ApiResponse(403, "Forbidden: Admins only"));
    }
    try {
        const user = yield user_schema_1.User.findById(userId);
        if (!user) {
            return res.status(404).json(new Apiresponse_1.ApiResponse(404, "User not found"));
        }
        user.isApproved = !user.isApproved;
        yield user.save();
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, user, `User has been ${user.isApproved ? "approved" : "disapproved"} successfully`));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
