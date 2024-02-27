import Project from "../models/allocateBudget.model.js";
import User from "../models/user.model.js";

export const applyForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findById(userId);
    if (!user || !user.isSupplier) {
      return res
        .status(403)
        .json({ message: "Only suppliers can apply for projects" });
    }

    const existingApplication = project.supplierApplications.find(
      (app) => app.user.toString() === userId
    );

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "Supplier already applied for this project" });
    }

    // Add the application to the project
    project.supplierApplications.push({ user: userId, status: "Pending" });
    await project.save();

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to handle admin approval or rejection of supplier applications
export const manageSupplierApplication = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const { action } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requestingUser = await User.findById(req.user._id);
    if (!requestingUser.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can manage supplier applications" });
    }

    const applicationIndex = project.supplierApplications.findIndex(
      (app) => app.user && app.user.toString() === userId
    );

    if (applicationIndex === -1) {
      return res
        .status(404)
        .json({ message: "Supplier application not found" });
    }

    // Update the status based on the admin's action
    const { status } = req.body;

    if (status === "Approved") {
      // Move the supplier to the approved list
      project.suppliers.push({ user: userId, approved: true });

      const supplier = await User.findById(userId);
      if (supplier) {
        console.log(
          `Congratulations! Your application for project ${project.name} has been approved.`
        );
      }
    } else if (status === "Rejected") {
      // Remove the application from the pending list
      project.supplierApplications.splice(applicationIndex, 1);

      // Send a rejection message to the supplier (you can replace this with your actual notification logic)
      const supplier = await User.findById(userId);
      if (supplier) {
        console.log(
          `We're sorry, but your application for project ${project.name} has been rejected.`
        );
      }
    }

    await project.save();

    res
      .status(200)
      .json({ message: "Supplier application updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
