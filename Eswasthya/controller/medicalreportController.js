import mongoose from "mongoose";

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { MedicalReport } from "../models/medicalreportSchema.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";




// @desc Upload a medical report
export const uploadReport = catchAsyncErrors(async (req, res, next) => {
  const { patientId, title, description, uploadedBy } = req.body;
  

  if (!req.file || !title || !description || !uploadedBy || !patientId) {
    return next(new ErrorHandler("All fields are required including file", 400));
  }
  if (!mongoose.isValidObjectId(patientId)) {
    return next(new ErrorHandler("Invalid patient ID format", 400));
  }

  // Validate user
  const patient = await User.findById(patientId);
  if (!patient) return next(new ErrorHandler("Patient not found", 404));

  const validRoles = ["Doctor", "Admin", "Patient"];
if (!validRoles.includes(uploadedBy)) {
  return next(new ErrorHandler("Invalid uploader role", 400));
}

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "medical_reports",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(req.file.buffer); // This uses buffer because you're using memoryStorage
  });


  const fileType = result.format;

  const report = await MedicalReport.create({
    patientId,
    title,
    description,
    fileUrl: result.secure_url,
    fileType,
    uploadedBy,
    cloudinary_id: result.public_id,
  });

  res.status(200).json({
    success: true,
    report,
    message: "Report uploaded successfully!",
  });
});

// @desc Get all reports for a specific patient
export const getReportsByPatient = catchAsyncErrors(async (req, res, next) => {
  const { patientId } = req.params;

  const patient = await User.findById(patientId);
  if (!patient) return next(new ErrorHandler("Patient not found", 404));

  const reports = await MedicalReport.find({ patientId });

  res.status(200).json({
    success: true,
    reports,
  });
});

// @desc Update report title/description
export const updateReport = catchAsyncErrors(async (req, res, next) => {
  const { reportId } = req.params;
  const { title, description } = req.body;

  let report = await MedicalReport.findById(reportId);
  if (!report) return next(new ErrorHandler("Report not found", 404));

  report.title = title || report.title;
  report.description = description || report.description;
  await report.save();

  res.status(200).json({
    success: true,
    message: "Report updated successfully!",
    report,
  });
});

// @desc Redirect to file on Cloudinary
export const downloadReport = catchAsyncErrors(async (req, res, next) => {
  const { reportId } = req.params;
  const report = await MedicalReport.findById(reportId);
  if (!report) return next(new ErrorHandler("Report not found", 404));

  res.redirect(report.fileUrl);
});

// @desc Delete a report
export const deleteReport = catchAsyncErrors(async (req, res, next) => {
  const { reportId } = req.params;

  const report = await MedicalReport.findById(reportId);
  if (!report) return next(new ErrorHandler("Report not found", 404));

  await cloudinary.v2.uploader.destroy(report.cloudinary_id, {
    resource_type: "auto",
  });

  await report.deleteOne();

  res.status(200).json({
    success: true,
    message: "Report deleted successfully!",
  });
});
