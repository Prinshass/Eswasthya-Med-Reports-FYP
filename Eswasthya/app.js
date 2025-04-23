import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import fileUpload from "express-fileupload";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import medicalreportRouter from "./router/medicalreportRouter.js";
import renewalrequestRouter from "./router/renewalrequestRouter.js";

const app = express();
config({ path: "./config/config.env" });

app.use(
    cors({
      origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
      method: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  
  app.use("/uploads", express.static("uploads"));
  app.use("/api/v1/message", messageRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/appointment", appointmentRouter);
  app.use("/api/v1/medical-report", medicalreportRouter);
  app.use("/api/v1/renewal", renewalrequestRouter);
  dbConnection();
  app.use(errorMiddleware);
export default app;