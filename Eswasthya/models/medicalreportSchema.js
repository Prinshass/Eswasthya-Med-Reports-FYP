import mongoose from "mongoose";
import validator from "validator";


const medicalReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required!"],
    },
    title: {
      type: String,
      required: [true, "Report Title is required!"],
      minLength: [3, "Report Title must contain at least 3 characters!"],
    },
    description: {
      type: String,
      maxLength: [1000, "Description should not exceed 1000 characters!"],
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required!"],
    },
    fileType: {
      type: String,
      required: [true, "File Type is required!"],
      enum: ["pdf", "jpg", "jpeg", "png"],
    },
    uploadedBy: {
      type: String,
      enum: ["Doctor", "Admin", "Patient"],
      default: "Doctor",
    },
    cloudinary_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);
