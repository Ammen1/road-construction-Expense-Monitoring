import Supplier from '../models/supplier.model.js';
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";

export const applyForProject = async (req, res, next) => {
    try {
        const { userId } = req.body
        const user = await User.findById(userId);
        if (!user || !user.isSupplier) {
            return res.status(403).json({ message: "Only suppliers can apply for projects" });
        }
        const { projectId, tinNumber, name, email, phone,city, servicesProvided,projectsCompleted } = req.body;
        // Check if the supplier already applied for this project
        const existingApplication = await Supplier.findOne({ user: userId, project: projectId });
        console.log(existingApplication);
        if (existingApplication) {
            return res.status(400).json({ message: "Supplier already applied for this project" });
        }

        // Create a new application
        const application = await Supplier.create({
            project: projectId,
            user: userId,
            tinNumber,
            email,
            name,
            phone,
            city,
            servicesProvided,
            projectsCompleted,
        });

        res.status(201).json({
            success: true,
            message: "Application Submitted!",
            application
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllApplications = async (req, res) => {
    try {
        const applications = await Supplier.find();
        console.log(applications)
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getAllApplication = async (req, res, next) => {
    try {
        // Check if the user making the request is the same as the requested user
        if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, "You are not allowed to access this user's applications"));
        }
        const { userId } = req.params;
        // Fetch applications where the user field matches the requested user ID
        const applications = await Supplier.findById({ user: mongoose.Types.ObjectId(userId) }).populate('project');
        console.log(applications);
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




