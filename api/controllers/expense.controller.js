import { errorHandler } from "../utils/error.js";
import Expense from "../models/expense.model.js";

export const expense = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to create an expense")
      );
    }

    const { title, amount, category, description, date } = req.body;
    if (!title || !amount || !category || !description || !date) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const newExpense = new Expense({
      title,
      amount,
      category,
      description,
      date,
      userId: req.user.id,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    // Pass the error to the next middleware
    next(error);
  }
};
