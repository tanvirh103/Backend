"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const dtoValidator_1 = require("../middleware/dtoValidator");
const user_dto_1 = require("../dto/user.dto");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const job_dto_1 = require("../dto/job.dto");
const job_controller_1 = require("../controllers/job.controller");
const application_controller_1 = require("../controllers/application.controller");
exports.router = (0, express_1.Router)();
// Auth Routes
exports.router.route("/auth/create").post((0, dtoValidator_1.dtoValidator)(user_dto_1.userValidationSchema), auth_controller_1.createUser);
exports.router.route("/auth/login").post((0, dtoValidator_1.dtoValidator)(user_dto_1.loginDto), auth_controller_1.logIn);
exports.router.route("/auth/profile/:userId").put(authMiddleWare_1.authenticateToken, (0, dtoValidator_1.dtoValidator)(user_dto_1.updateUserValidationSchema), auth_controller_1.updateProfile);
exports.router.route("/auth/password/:userId").patch(authMiddleWare_1.authenticateToken, (0, dtoValidator_1.dtoValidator)(user_dto_1.updatePasswordDto), auth_controller_1.updatedPassword);
//User Info Route
exports.router.route("/user/:userId").get(authMiddleWare_1.authenticateToken, auth_controller_1.getUserInfo);
exports.router.route("/users").get(authMiddleWare_1.authenticateToken, auth_controller_1.getAllUsers);
exports.router.route("/users/block/:userId").patch(authMiddleWare_1.authenticateToken, auth_controller_1.toggleIsBlocked);
exports.router.route("/users/approve/:userId").patch(authMiddleWare_1.authenticateToken, auth_controller_1.toggleIsApproved);
//Job Routes
exports.router.route("/jobs").post(authMiddleWare_1.authenticateToken, (0, dtoValidator_1.dtoValidator)(job_dto_1.jobValidationSchema), job_controller_1.createJob);
exports.router.route("/jobs/:jobId").put(authMiddleWare_1.authenticateToken, (0, dtoValidator_1.dtoValidator)(job_dto_1.updateJob), job_controller_1.updateJobById);
exports.router.route("/jobs/:jobId").delete(authMiddleWare_1.authenticateToken, job_controller_1.deleteJobById);
exports.router.route("/jobs").get(job_controller_1.getAllJobs);
exports.router.route("/jobs/:jobId").get(authMiddleWare_1.authenticateToken, job_controller_1.getJobById);
exports.router.route("/jobs/employer/:employerId").get(authMiddleWare_1.authenticateToken, job_controller_1.getJobsByEmployer);
exports.router.route("/jobs/status/:jobId").patch(authMiddleWare_1.authenticateToken, job_controller_1.toogleJobApplicationStatus);
// Additional routes can be added here
exports.router.route("/apply/:jobId").post(authMiddleWare_1.authenticateToken, application_controller_1.applyForJob);
exports.router.route("/applications/job/:jobId").get(authMiddleWare_1.authenticateToken, application_controller_1.getJobApplications);
exports.router.route("/applications/check/:jobId").get(authMiddleWare_1.authenticateToken, application_controller_1.hasUserApplied);
