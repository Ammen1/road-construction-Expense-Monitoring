import express from "express";
import {
  deleteproject,
  getProjects,
  createProject,
  updateproject,
  getProject,
  getProjectByManager,

} from "../controllers/allocatBudget.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import {
  applyForProject,
  manageSupplierApplication,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createProject);
router.get("/getprojects", getProjects);
router.get("/getproject", getProject);
router.delete("/deleteproject/:projectId/:userId", verifyToken, deleteproject);
router.put("/updateproject/:projectId/:userId", verifyToken, updateproject);
router.post("/projects/:projectId/apply", applyForProject);
router.patch(
  "/projects/:projectId/suppliers/:userId",
  manageSupplierApplication );
router.get("/managerproject/:userId", getProjectByManager);

export default router;
