import express from "express";
import { requestRenewal } from "../controller/renewalrequestController.js";
import { isPatientAuthenticated as isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/request", isAuthenticated, requestRenewal);

export default router;
