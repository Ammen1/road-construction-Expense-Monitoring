import Project from "../models/allocateBudget.model.js";
import { errorHandler } from "../utils/error.js";

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      manager,
      budget,
      tasks,
      location,
    } = req.body;

    if (!name || !startDate || !endDate || !budget || !manager) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create a post"));
    }

    if (!isNaN(name)) {
      return res.status(400).json({ error: "Name must not be a number" });
    }

    if (budget < 0) {
      return res
        .status(400)
        .json({ error: "Budget must not be a negative number" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ error: "Start date must be before or equal to end date" });
    }

    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      manager,
      budget,
      tasks,
      location,
    });

    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      res.status(400).json({ errors });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find();
    if (!projects) {
      return next(errorHandler(404, "Projects not found"));
    }
    res.status(200).json({ projects }); // Wrap projects in an object
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const projects = await Project.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.name && { name: req.query.name }),
      ...(req.query.projectId && { _id: req.query.projectId }),
      ...(req.query.searchTerm && {
        $or: [{ name: { $regex: req.query.searchTerm, $options: "i" } }],
      }),
    })
      .sort({ endDate: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProjects = await Project.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthProjects = await Project.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      projects,
      totalProjects,
      lastMonthProjects,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteproject = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateproject = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        $set: {
          name: req.body.name,
          location: req.body.location,
          budget: req.body.budget,
          description: req.body.description,
          tasks: req.body.tasks,
          manager: req.body.manager,
          endDate: req.body.endDate,
        },
      },
      { new: true }
    );

    console.log("Updated Project:", updatedProject); // Add this line

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error); // Add this line
    next(error);
  }
};
