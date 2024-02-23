import express from "express";
import "./db/init.js";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
dotenv.config();

const App = express();
App.use(express.urlencoded({ extended: false }));
App.use(express.json());
App.use(cors());

App.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello World",
  });
});

App.use("/v1/api", userRoutes);

App.use("*", (req, res) => {
  return res.status(500).json({
    statusCode: 500,
    success: false,
    message: "Route not found",
    data: null,
  });
});

App.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    success: false,
    message: err.message,
    data: null,
  });
});

const PORT = process.env.PORT;
App.listen(PORT, () => {
  console.log(`Server Started at port ${PORT}`);
});
