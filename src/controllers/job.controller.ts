import { AuthReq } from "../middleware/authMiddleWare";
import { Application } from "../schema/application.schema";
import { Job } from "../schema/job.schema";
import { User } from "../schema/user.schema";
import { ApiResponse } from "../utils/Apiresponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createJob = asyncHandler(async (req: AuthReq, res) => {
  const { title, description, company, location, jobType, salaryRange } =
    req.body;
  if (!title || !description || !company || !location || !jobType) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Title, Description, Location and Job Type are required",
        ),
      );
  }
  const employerId = (req.user as any)?._id;
  const isEmployer = await User.findById(employerId);
  if (!isEmployer || isEmployer.role !== "employer") {
    return res
      .status(403)
      .json(new ApiResponse(403, "Only employers can create job postings"));
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
    const result = await Job.create(newJob);
    if (!result) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Failed to create job posting"));
    }
    return res
      .status(201)
      .json(new ApiResponse(201, result, "Job created successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const updateJobById = asyncHandler(async (req: AuthReq, res) => {
  const { jobId } = req.params;
  const updateData = req.body;
  const employerId = (req.user as any)?._id;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json(new ApiResponse(404, "Job not found"));
    }
    if (job.employer.toString() !== employerId) {
      return res
        .status(403)
        .json(
          new ApiResponse(403, "You are not authorized to update this job"),
        );
    }
    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData);
    if (!updatedJob) {
      return res.status(500).json(new ApiResponse(500, "Failed to update job"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const deleteJobById = asyncHandler(async (req: AuthReq, res) => {
  const { jobId } = req.params;
  const employerId = (req.user as any)?._id;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json(new ApiResponse(404, "Job not found"));
    }

    if (job.employer.toString() !== employerId) {
      return res
        .status(403)
        .json(
          new ApiResponse(403, "You are not authorized to delete this job"),
        );
    }
    const deletedJob = await Job.findByIdAndUpdate(jobId, {
      deletedAt: new Date(),
    });
    if (!deletedJob) {
      return res.status(500).json(new ApiResponse(500, "Failed to delete job"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, deletedJob, "Job deleted successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const getAllJobs = asyncHandler(async (req: AuthReq, res) => {
  try {
    const jobs = await Job.find({ deletedAt: null });
    return res
      .status(200)
      .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const getJobById = asyncHandler(async (req: AuthReq, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json(new ApiResponse(404, "Job not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, job, "Job fetched successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const getJobsByEmployer = asyncHandler(async (req, res) => {
  const employerId = req.params.employerId;
  try {
    const jobs = await Job.find({ employer: employerId, deletedAt: null });
    return res
      .status(200)
      .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});

export const toogleJobApplicationStatus = asyncHandler(
  async (req: AuthReq, res) => {
    const { jobId } = req.params;
    const employerId = (req.user as any)?._id;
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json(new ApiResponse(404, "Job not found"));
      }
      if (job.employer.toString() !== employerId) {
        return res
          .status(403)
          .json(
            new ApiResponse(403, "You are not authorized to update this job"),
          );
      }
      job.isAcceptingApplications = !job.isAcceptingApplications;
      await job.save();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            job,
            "Job application status toggled successfully",
          ),
        );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return res
        .status(500)
        .json(new ApiResponse(500, "Internal server error", message));
    }
  },
);
