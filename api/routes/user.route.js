import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  updateUser,
  getManagers,
  getNotificationsList,
  getEmployees
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers",  getUsers);
router.get("/getemployees", getEmployees)
router.get("/:userId", getUser);
router.get("/:getmanagers", getManagers);
router.get("/notifications", getNotificationsList);

export default router;
