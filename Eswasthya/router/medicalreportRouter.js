import express from "express";
import {
  uploadReport,
  getReportsByPatient,
  updateReport,
  downloadReport,
  deleteReport,
} from "../controller/medicalreportController.js";
import { isPatientAuthenticated as isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";


const router = express.Router();

router.post("/upload", isAuthenticated, singleUpload, uploadReport);
router.get("/patient/:patientId", isAuthenticated, getReportsByPatient);
router.put("/update/:reportId", isAuthenticated, updateReport);
router.get("/download/:reportId", isAuthenticated, downloadReport); // now redirects to Cloudinary URL
router.delete("/delete/:reportId", isAuthenticated, deleteReport);

export default router;
