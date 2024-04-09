import IncomeSchema from "../models/income.model.js";
import Project from "../models/allocateBudget.model.js";

import Income from "../models/income.model.js";

export const addIncome = async (req, res) => {
    const { projectId, title, amount, category, description } = req.body;
  
    try {
      // Validate the request body
      if (!projectId || !title || !category || !description) {
        return res.status(400).json({ message: 'Project ID, title, category, and description are required!' });
      }
  
      // Parse the amount to ensure it's a valid number
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
      }
  
      // Check if the project exists
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Check if an income already exists for the project
      const existingIncome = await Income.findOne({ project: projectId });
  
      // If no income exists for the project, update the budget
      if (!existingIncome) {
        // If the project already has a budget, increment it by the income amount
        if (project.budget !== undefined) {
          project.budget += parsedAmount;
        } else {
          // If the project doesn't have a budget, set the budget to the income amount
          project.budget = parsedAmount;
        }
  
        // Save the updated project document
        await project.save();
      } else {
        // If an income exists for the project, return a message indicating that the project already has a budget
        return res.status(400).json({ message: 'This project already has a budget.' });
      }
  
      // Create a new income document
      const income = new Income({
        title,
        amount: parsedAmount, // Use the parsed amount
        category,
        description,
        project: projectId, // Associate the income with the project
      });
  
      // Save the income document
      await income.save();
  
      res.status(200).json({ message: 'Income Added' });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).json({ message: 'Server Error' });
    }
  };
  


export const getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: 'Server Error' });
    }
};


export const deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedIncome = await IncomeSchema.findByIdAndDelete(id);
        if (!deletedIncome) {
            return res.status(404).json({ message: 'Income not found' });
        }

        // Retrieve the project associated with the deleted income
        const project = await Project.findById(deletedIncome.project);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Subtract the income amount from the project's budget
        project.budget -= deletedIncome.amount;
        await project.save();

        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: 'Server Error' });
    }
};
