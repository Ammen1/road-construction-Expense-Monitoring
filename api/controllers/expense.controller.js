import { errorHandler } from "../utils/error.js";
import Expense from "../models/expense.model.js";

export const addExpense = async (req, res) => {
  const { title, amount, category, description } = req.body;

  const expense = new Expense({
    title,
    amount,
    category,
    description,
  });

  try {
    // Validations
    if (!title || !category || !description) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    await expense.save();
    res.status(200).json({ message: "Expense Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
