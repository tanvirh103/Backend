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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dtoValidator = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const Apiresponse_1 = require("../utils/Apiresponse");
const zod_1 = require("zod");
const dtoValidator = (dto) => {
    return (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = dto.parse(req.body);
            req.body = result;
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                }));
                return res
                    .status(400)
                    .json(new Apiresponse_1.ApiResponse(400, "Bad Request - Validation Error", errorMessages));
            }
            console.error("❌ Unexpected Validation Middleware Error:", error);
            return res
                .status(500)
                .json(new Apiresponse_1.ApiResponse(500, "Internal Server Error"));
        }
    }));
};
exports.dtoValidator = dtoValidator;
