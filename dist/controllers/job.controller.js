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
exports.toogleJobApplicationStatus = exports.getJobsByEmployer = exports.getJobById = exports.getAllJobs = exports.deleteJobById = exports.updateJobById = exports.createJob = void 0;
const job_schema_1 = require("../schema/job.schema");
const user_schema_1 = require("../schema/user.schema");
const Apiresponse_1 = require("../utils/Apiresponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createJob = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, company, location, jobType, salaryRange } = req.body;
    if (!title || !description || !company || !location || !jobType) {
        return res
            .status(400)
            .json(new Apiresponse_1.ApiResponse(400, "Title, Description, Location and Job Type are required"));
    }
    const employerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const isEmployer = yield user_schema_1.User.findById(employerId);
    if (!isEmployer || isEmployer.role !== "employer") {
        return res
            .status(403)
            .json(new Apiresponse_1.ApiResponse(403, "Only employers can create job postings"));
    }
    try {
        const newJob = {
            title,
            company,
            description,
            location,
            jobType,
            salaryRange,
            employer: employerId,
        };
        const result = yield job_schema_1.Job.create(newJob);
        if (!result) {
            return res
                .status(500)
                .json(new Apiresponse_1.ApiResponse(500, "Failed to create job posting"));
        }
        return res
            .status(201)
            .json(new Apiresponse_1.ApiResponse(201, result, "Job created successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.updateJobById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { jobId } = req.params;
    const updateData = req.body;
    const employerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const job = yield job_schema_1.Job.findById(jobId);
        if (!job) {
            return res.status(404).json(new Apiresponse_1.ApiResponse(404, "Job not found"));
        }
        if (job.employer.toString() !== employerId) {
            return res
                .status(403)
                .json(new Apiresponse_1.ApiResponse(403, "You are not authorized to update this job"));
        }
        const updatedJob = yield job_schema_1.Job.findByIdAndUpdate(jobId, updateData);
        if (!updatedJob) {
            return res.status(500).json(new Apiresponse_1.ApiResponse(500, "Failed to update job"));
        }
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, updatedJob, "Job updated successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.deleteJobById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { jobId } = req.params;
    const employerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const job = yield job_schema_1.Job.findById(jobId);
        if (!job) {
            return res.status(404).json(new Apiresponse_1.ApiResponse(404, "Job not found"));
        }
        if (job.employer.toString() !== employerId) {
            return res
                .status(403)
                .json(new Apiresponse_1.ApiResponse(403, "You are not authorized to delete this job"));
        }
        const deletedJob = yield job_schema_1.Job.findByIdAndUpdate(jobId, {
            deletedAt: new Date(),
        });
        if (!deletedJob) {
            return res.status(500).json(new Apiresponse_1.ApiResponse(500, "Failed to delete job"));
        }
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, deletedJob, "Job deleted successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.getAllJobs = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield job_schema_1.Job.find({ deletedAt: null });
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, jobs, "Jobs fetched successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.getJobById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        const job = yield job_schema_1.Job.findById(jobId);
        if (!job) {
            return res.status(404).json(new Apiresponse_1.ApiResponse(404, "Job not found"));
        }
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, job, "Job fetched successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.getJobsByEmployer = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employerId = req.params.employerId;
    try {
        const jobs = yield job_schema_1.Job.find({ employer: employerId, deletedAt: null });
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, jobs, "Jobs fetched successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
exports.toogleJobApplicationStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { jobId } = req.params;
    const employerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const job = yield job_schema_1.Job.findById(jobId);
        if (!job) {
            return res.status(404).json(new Apiresponse_1.ApiResponse(404, "Job not found"));
        }
        if (job.employer.toString() !== employerId) {
            return res
                .status(403)
                .json(new Apiresponse_1.ApiResponse(403, "You are not authorized to update this job"));
        }
        job.isAcceptingApplications = !job.isAcceptingApplications;
        yield job.save();
        return res
            .status(200)
            .json(new Apiresponse_1.ApiResponse(200, job, "Job application status toggled successfully"));
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res
            .status(500)
            .json(new Apiresponse_1.ApiResponse(500, "Internal server error", message));
    }
}));
