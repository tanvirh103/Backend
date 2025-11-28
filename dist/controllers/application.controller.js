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
exports.hasUserApplied = exports.getJobApplications = exports.applyForJob = void 0;
const application_schema_1 = require("../schema/application.schema");
const job_schema_1 = require("../schema/job.schema");
const Apiresponse_1 = require("../utils/Apiresponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.applyForJob = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { jobId } = req.params;
    const applicantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const job = yield job_schema_1.Job.findById(jobId);
        if (!job) {
            return res.status(404).json(new Apiresponse_1.ApiResponse(404, "Job not found"));
        }
        if (!job.isAcceptingApplications) {
            return res
                .status(400)
                .json(new Apiresponse_1.ApiResponse(400, "This job is not accepting applications"));
        }
        const application = yield application_schema_1.Application.create({
            job: jobId,
            applicant: applicantId,
        });
        return res
            .status(201)
            .json(new Apiresponse_1.ApiResponse(201, application, "Application submitted successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.getJobApplications = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { jobId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const job = yield job_schema_1.Job.findById(jobId).populate("employer", "-password");
        if (!job) {
            return res
                .status(404)
                .json(new Apiresponse_1.ApiResponse(404, "Job not found"));
        }
        const applications = yield application_schema_1.Application.find({ job: jobId })
            .populate("applicant", "-password")
            .populate("job");
        const userHasApplied = yield application_schema_1.Application.exists({
            job: jobId,
            applicant: userId,
        });
        return res.status(200).json(new Apiresponse_1.ApiResponse(200, {
            job,
            applications,
            userHasApplied: Boolean(userHasApplied),
        }, "Applications fetched successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.hasUserApplied = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { jobId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const alreadyApplied = yield application_schema_1.Application.exists({
            job: jobId,
            applicant: userId,
        });
        return res.status(200).json(new Apiresponse_1.ApiResponse(200, { applied: Boolean(alreadyApplied) }, "Application check completed"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res.status(500).json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
