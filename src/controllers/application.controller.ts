import { AuthReq } from "../middleware/authMiddleWare";
import { Application } from "../schema/application.schema";
import { Job } from "../schema/job.schema";
import { ApiResponse } from "../utils/Apiresponse";
import { asyncHandler } from "../utils/asyncHandler";

export const applyForJob = asyncHandler(async (req: AuthReq, res) => {
  const { jobId } = req.params;
  const applicantId = (req.user as any)?._id;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json(new ApiResponse(404, "Job not found"));
    }

    if (!job.isAcceptingApplications) {
      return res
        .status(400)
        .json(new ApiResponse(400, "This job is not accepting applications"));
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, application, "Application submitted successfully"),
      );
  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});



export const getJobApplications = asyncHandler(async (req: AuthReq, res) => {
  const { jobId } = req.params;
  const userId = (req.user as any)?._id;

  try {
    const job = await Job.findById(jobId).populate("employer", "-password");
    if (!job) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Job not found"));
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "-password") 
      .populate("job");

    const userHasApplied = await Application.exists({
      job: jobId,
      applicant: userId,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          job,
          applications,
          userHasApplied: Boolean(userHasApplied),
        },
        "Applications fetched successfully"
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Internal server error", message));
  }
});



export const hasUserApplied = asyncHandler(async (req: AuthReq, res) => {
  const { jobId } = req.params;
  const userId = (req.user as any)?._id;

  try {
    const alreadyApplied = await Application.exists({
      job: jobId,
      applicant: userId,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { applied: Boolean(alreadyApplied) },
        "Application check completed"
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json(
      new ApiResponse(500, "Internal server error", message)
    );
  }
});
