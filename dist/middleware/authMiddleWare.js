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
exports.authenticateToken = void 0;
const Apiresponse_1 = require("../utils/Apiresponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../schema/user.schema");
exports.authenticateToken = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
            return res
                .status(401)
                .json(new Apiresponse_1.ApiResponse(401, "Authorization token missing"));
        }
        const token = bearerToken.split(" ")[1];
        if (!token) {
            return res.status(401).json(new Apiresponse_1.ApiResponse(401, "Token not provided"));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res
                .status(401)
                .json(new Apiresponse_1.ApiResponse(401, "Invalid or malformed token"));
        }
        // Check if user exists in DB
        const user = yield user_schema_1.User.findById(decoded.id).select("id email name");
        const formateduser = {
            _id: user === null || user === void 0 ? void 0 : user._id.toString(),
            email: user === null || user === void 0 ? void 0 : user.email,
            name: user === null || user === void 0 ? void 0 : user.name
        };
        if (!user) {
            return res
                .status(403)
                .json(new Apiresponse_1.ApiResponse(403, "User not found or no longer active"));
        }
        req.user = formateduser;
        next();
    }
    catch (err) {
        return res
            .status(401)
            .json(new Apiresponse_1.ApiResponse(401, "Unauthorized: Invalid token"));
    }
}));
