import express from "express";
import {
  addExpense,
  getExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";

const router = express.Router();

router
  .post("/add-expense", addExpense)
  .get("/get-expenses", getExpense)
  .delete("/delete-expense/:id", deleteExpense);

export default router;
