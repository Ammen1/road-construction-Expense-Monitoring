import ExpenseSchema from "../models/expense.model.js";
import Project from "../models/allocateBudget.model.js";

export const addExpense = async (req, res) => {
  const {projectId, title, amount, category, description } = req.body;

  // Check if the project exists
  const project = await Project.findById(projectId);
  if (!project) {
      return res.status(404).json({ message: 'Project not found' });
  }

  const income = ExpenseSchema({
    title,
    amount,
    category,
    description,
    project: projectId,
  });

  try {
    //validations
    if (!title || !category || !description || !projectId) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    await income.save();
    // Increment the project budget by the income amount
    project.expense += amount;
    await project.save();


    res.status(200).json({ message: "Expense Added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }

  console.log(income);
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
