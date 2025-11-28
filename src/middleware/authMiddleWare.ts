import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/Apiresponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../schema/user.schema";

export interface AuthReq extends Request {
  user?: JwtPayload | string;
}

export const authenticateToken = asyncHandler(
  async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        return res
          .status(401)
          .json(new ApiResponse(401, "Authorization token missing"));
      }

      const token = bearerToken.split(" ")[1];
      if (!token) {
        return res.status(401).json(new ApiResponse(401, "Token not provided"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;
      if (!decoded || !decoded.id) {
        return res
          .status(401)
          .json(new ApiResponse(401, "Invalid or malformed token"));
      }

      // Check if user exists in DB
      const user = await User.findById(decoded.id).select("id email name");
      const formateduser={
        _id:user?._id.toString(),
        email:user?.email,
        name:user?.name
      }
      if (!user) {
        return res
          .status(403)
          .json(new ApiResponse(403, "User not found or no longer active"));
      }
      req.user = formateduser;
      next();
    } catch (err) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Unauthorized: Invalid token"));
    }
  },
);
