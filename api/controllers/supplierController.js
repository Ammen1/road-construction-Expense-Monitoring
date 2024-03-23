import Supplier from '../models/supplier.model.js';
import User from '../models/user.model.js';

export const applyForProject = async (req, res, next) => {
    try {
        const { projectId, tinNumber, userId, name, email, phone,  } = req.body;

        // Check if the user is a supplier
        const user = await User.findById(userId);
        if (!user || !user.isSupplier) {
            return res.status(403).json({ message: "Only suppliers can apply for projects" });
        }

        // Check if the supplier already applied for this project
        const existingApplication = await Supplier.findOne({ user: userId, project: projectId });
        if (existingApplication) {
            return res.status(400).json({ message: "Supplier already applied for this project" });
        }

        // Create a new application
        const application = await Supplier.create({
            project: projectId,
            tinNumber,
            email,
            name,
            phone
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
