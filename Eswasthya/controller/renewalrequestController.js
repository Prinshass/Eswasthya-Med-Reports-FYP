import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { RenewalRequest } from "../models/renewalrequestSchema.js";
import { MedicalReport } from "../models/medicalreportSchema.js";
import { User } from "../models/userSchema.js";

// @desc Request a renewal of a report
export const requestRenewal = catchAsyncErrors(async (req, res, next) => {
  const { reportId, reason, requestedBy } = req.body;

  if (!reportId || !reason || !requestedBy) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const report = await MedicalReport.findById(reportId);
  if (!report) return next(new ErrorHandler("Report not found", 404));

  const user = await User.findById(requestedBy);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const existingRequest = await RenewalRequest.findOne({ reportId, requestedBy, status: "Pending" });
  if (existingRequest) return next(new ErrorHandler("A renewal request is already pending", 400));

  const request = await RenewalRequest.create({
    reportId,
    requestedBy,
    reason,
  });

  res.status(201).json({
    success: true,
    message: "Renewal request submitted",
    request,
  });
});