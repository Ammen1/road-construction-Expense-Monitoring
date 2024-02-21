import express from "express";
import { expense } from "../controllers/expense.controller.js";

const router = express.Router();

router.post("/create", expense);

export default router;
