import Project from "../models/allocateBudget.model.js";

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      manager,
      role,
      budget,
      tasks,
    } = req.body;
    // !manager
    if (!name || !startDate || !endDate || !budget) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // if (role !== "admin") {
    //   return res.status(403).json({
    //     error: "Unauthorized: Only admin can create a project with a budget",
    //   });
    // }

    if (!isNaN(name)) {
      return res.status(400).json({ error: "Name must not be a number" });
    }

    // Validate budget is not a negative number
    if (budget < 0) {
      return res
        .status(400)
        .json({ error: "Budget must not be a negative number" });
    }

    // Validate startDate is before or equal to endDate
    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ error: "Start date must be before or equal to end date" });
    }

    // Create a new project document
    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      manager,
      budget,
      tasks,
    });

    // Save the project to the database
    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error:", error);

    if (error.name === "ValidationError") {
      // Handle validation errors
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      res.status(400).json({ errors });
    } else {
      // Log other errors
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

export const getprojects = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const projects = await Project.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.name && { name: req.query.name }),
      ...(req.query.location && { slug: req.query.location }),
      ...(req.query.projectId && { _id: req.query.projectId }),
      ...(req.query.searchTerm && {
        $or: [
          { name: { $regex: req.query.searchTerm, $options: "i" } },
          { location: { $regex: req.query.searchTerm, $options: "i" } },
        ],
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
    await Project.findByIdAndDelete(req.params.postId);
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
      req.params.postId,
      {
        $set: {
          name: req.body.name,
          clocation: req.body.locatin,
          budget: req.body.budget,
          description: req.body.description,
          tasks: req.body.tasks,
          manager: req.body.isManager,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};
