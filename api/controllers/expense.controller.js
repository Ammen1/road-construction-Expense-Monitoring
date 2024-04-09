import ExpenseSchema from "../models/expense.model.js";
import Project from "../models/allocateBudget.model.js";

export const addExpense = async (req, res) => {
  const { projectId, title, amount, category, description } = req.body;

  try {
    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create a new expense document
    const expense = new ExpenseSchema({
      title,
      amount,
      category,
      description,
      project: projectId,
    });

    // Validations
    if (!title || !category || !description || !projectId) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number!" });
    }

    // Save the new expense document
    await expense.save();

    // Fetch all expenses for the project and calculate the total expense
    const projectExpenses = await ExpenseSchema.find({ project: projectId });
    const totalExpense = projectExpenses.reduce((acc, cur) => acc + parseFloat(cur.amount), 0);

    // Update the project's total expense
    project.expense = totalExpense;
    await project.save();

    res.status(200).json({ message: "Expense Added" });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




export const getExpense = async (req, res) => {
  try {
    const incomes = await ExpenseSchema.find().sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  ExpenseSchema.findByIdAndDelete(id)
    .then((income) => {
      res.status(200).json({ message: "Expense Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
};
