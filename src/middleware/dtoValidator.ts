import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/Apiresponse";
import { ZodError, ZodObject, ZodRawShape } from "zod";

export const dtoValidator = <T extends ZodRawShape>(dto: ZodObject<T>) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = dto.parse(req.body);
        req.body = result;
        return next();
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessages: any = error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          }));
          return res
            .status(400)
            .json(
              new ApiResponse(
                400,
                "Bad Request - Validation Error",
                errorMessages,
              ),
            );
        }
        console.error("❌ Unexpected Validation Middleware Error:", error);
        return res
          .status(500)
          .json(new ApiResponse(500, "Internal Server Error"));
      }
    },
  );
};
