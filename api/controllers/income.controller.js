import IncomeSchema from "../models/income.model.js";
import Project from "../models/allocateBudget.model.js";

import Income from "../models/income.model.js";

export const addIncome = async (req, res) => {
    const { projectId, title, amount, category, description } = req.body;

    try {
        if (!projectId || !title || !category || !description) {
            return res.status(400).json({ message: 'Project ID, title, category, and description are required!' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        // Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Create a new income document
        const income = new Income({
            title,
            amount,
            category,
            description,
            project: projectId, // Associate the income with the project
        });

        // Save the income document
        await income.save();

        // Increment the project budget by the income amount
        project.budget += amount;
        await project.save();

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
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: 'Server Error' });
    }
};
