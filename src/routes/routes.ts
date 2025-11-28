import { Router } from "express";
import { dtoValidator } from "../middleware/dtoValidator";
import { loginDto, updatePasswordDto, updateUserValidationSchema, userValidationSchema } from "../dto/user.dto";
import { createUser, getAllUsers, getUserInfo, logIn, toggleIsApproved, toggleIsBlocked, updatedPassword, updateProfile } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/authMiddleWare";
import { jobValidationSchema, updateJob } from "../dto/job.dto";
import { createJob, deleteJobById, getAllJobs, getJobById, getJobsByEmployer, toogleJobApplicationStatus, updateJobById } from "../controllers/job.controller";
import { applyForJob, getJobApplications, hasUserApplied } from "../controllers/application.controller";

export const router=Router();

// Auth Routes
router.route("/auth/create").post(dtoValidator(userValidationSchema),createUser);
router.route("/auth/login").post(dtoValidator(loginDto),logIn);
router.route("/auth/profile/:userId").put(authenticateToken,dtoValidator(updateUserValidationSchema),updateProfile);
router.route("/auth/password/:userId").patch(authenticateToken,dtoValidator(updatePasswordDto),updatedPassword);

//User Info Route
router.route("/user/:userId").get(authenticateToken,getUserInfo);
router.route("/users").get(authenticateToken,getAllUsers);
router.route("/users/block/:userId").patch(authenticateToken,toggleIsBlocked);
router.route("/users/approve/:userId").patch(authenticateToken,toggleIsApproved);


//Job Routes
router.route("/jobs").post(authenticateToken,dtoValidator(jobValidationSchema),createJob);
router.route("/jobs/:jobId").put(authenticateToken,dtoValidator(updateJob),updateJobById);
router.route("/jobs/:jobId").delete(authenticateToken,deleteJobById);
router.route("/jobs").get(getAllJobs);
router.route("/jobs/:jobId").get(authenticateToken,getJobById);
router.route("/jobs/employer/:employerId").get(authenticateToken,getJobsByEmployer);
router.route("/jobs/status/:jobId").patch(authenticateToken,toogleJobApplicationStatus);

// Additional routes can be added here
router.route("/apply/:jobId").post(authenticateToken,applyForJob);
router.route("/applications/job/:jobId").get(authenticateToken,getJobApplications);
router.route("/applications/check/:jobId").get(authenticateToken, hasUserApplied);