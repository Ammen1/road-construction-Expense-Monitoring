import express from "express";
import {
  addExpense,
  getExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import {addIncome, getIncomes, deleteIncome } from "../controllers/income.controller.js";

const router = express.Router();

router.post('/add-income', addIncome)
  .get('/get-incomes', getIncomes)
  .delete('/delete-income/:id', deleteIncome)
  .post("/add-expense", addExpense)
  .get("/get-expenses", getExpense)
  .delete("/delete-expense/:id", deleteExpense);

export default router;
