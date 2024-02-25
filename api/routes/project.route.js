import express from "express";
import {
  deleteproject,
  getProjects,
  createProject,
  updateproject,
  getProject,
} from "../controllers/allocatBudget.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to create a new project

router.post("/create", verifyToken, createProject);
router.get("/getprojects", getProjects);
router.get("/getproject", getProject);
router.delete("/deleteproject/:projectId/:userId", verifyToken, deleteproject);
router.put("/updateproject/:postId/:userId", verifyToken, updateproject);

export default router;
