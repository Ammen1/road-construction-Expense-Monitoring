import express from "express";
import {
  deleteproject,
  getProjects,
  createProject,
  updateproject,
} from "../controllers/allocatBudget.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to create a new project

router.post("/create", verifyToken, createProject);
router.get("/getprojects", getProjects);
router.delete("/deleteproject/:projectId/:userId", verifyToken, deleteproject);
router.put("/updateproject/:postId/:userId", verifyToken, updateproject);

export default router;
