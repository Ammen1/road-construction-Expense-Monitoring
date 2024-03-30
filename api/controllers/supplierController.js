import Supplier from '../models/supplier.model.js';
import User from '../models/user.model.js';
import Project from '../models/allocateBudget.model.js';
import { errorHandler } from "../utils/error.js";
import { createPayment } from './payment.controller.js'; // Import the payment creation controller

export const applyForProject = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user || !user.isSupplier) {
            return res.status(403).json({ message: "Only suppliers can apply for projects" });
        }
        const { projectId, tinNumber, name, email, phone, city, servicesProvided, projectsCompleted } = req.body;
        
        // Fetch the project details based on projectId
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if the supplier already applied for this project
        const existingApplication = await Supplier.findOne({ user: userId, project: projectId });
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

        // try {
        //     await createPayment({
        //         projectId: project._id,
        //         userId: userId,
        //         amount: project.amount, 
        //         tinNumber: tinNumber,
                
        //     });
        // } catch (error) {
        //     console.error('Error creating payment:', error);
        //     return res.status(500).json({ error: "Failed to ask for payment for this project" });
        // }


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
        const applications = await Supplier.find()
        console.log(applications);
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
        const { userId } = req.body;
        // Fetch applications where the user field matches the requested user ID
        const applications = await Supplier.findById({ user: mongoose.Types.ObjectId(userId) }).populate('name');
        console.log(applications);
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const approve = async (req, res, next) => {
    try {
      const { applicationId } = req.params;
  
      const approve = await Supplier.findById(applicationId);
  
      approve.isActive = true;
  
      await approve.save();
  
      res.status(200).json({
        status: true,
        message: `application approved successfully.`,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };




  // Delete Supplier
export const deleteSupplier = async (req, res) => {
    try {
      const { applicationId } = req.params;
      const deletedSupplier = await Supplier.findByIdAndDelete(applicationId);
      if (!deletedSupplier) {
        return res.status(404).json({ success: false, message: 'Supplier not found' });
      }
      res.status(200).json({ success: true, message: 'Supplier deleted successfully', data: deletedSupplier });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Edit Supplier
  export const editSupplier = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, city, tinNumber, servicesProvided, isActive } = req.body;
      
      const updatedSupplier = await Supplier.findByIdAndUpdate(id, {
        name,
        email,
        phone,
        city,
        tinNumber,
        servicesProvided,
        isActive
      }, { new: true }); // Set new: true to return the updated document
  
      if (!updatedSupplier) {
        return res.status(404).json({ success: false, message: 'Supplier not found' });
      }
      
      res.status(200).json({ success: true, message: 'Supplier updated successfully', data: updatedSupplier });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  