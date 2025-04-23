import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Eswasthya",
    })
    .then(() => {
      console.log("Succesfully Connected to the database!");
    })
    .catch((err) => {
      console.log("Connection failed error occured while connecting to database:", err);
    });
};