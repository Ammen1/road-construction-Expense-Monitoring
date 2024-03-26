import Project from "../models/allocateBudget.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import nodemailer from 'nodemailer';
import ManagerInput from '../models/Report.model.js'; 

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      manager,
      employee,
      tasks,
      location,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(employee)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    if (!name || !startDate || !endDate ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create a post"));
    }

    if (!isNaN(name)) {
      return res.status(400).json({ error: "Name must not be a number" });
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
      employee,
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

export const getProjectByManager = async (req, res, next) => {
  try {
    const managerId = req.params.userId;
    const projects = await Project.find({ manager: managerId }).populate('manager');
    res.json({ seccuss: true, projects });
  } catch(error) {
    console.error(" Error fetching  projects:", error);
    res.status(500).json({ success: false, message: "Erro fetching projects"});
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
          manager: req.body.manager,
          employee: req.body.employee,
          status: req.body.status,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};


export const generateProjectReport = async (req, res) => {
  try {
    // Fetch projects from the database
    const projects = await Project.find().populate('manager').populate('employee');

    // Create a new PDF document
    const doc = new PDFDocument();
    // Pipe the PDF into a writeable stream to save to a file
    const stream = fs.createWriteStream('project_report.pdf');
    doc.pipe(stream);

    // Generate report content
    doc.fontSize(14).text('Project Report', { align: 'center' }).moveDown();

    projects.forEach(project => {
      doc.fontSize(12)
        .text(`Name: ${project.name}`)
        .text(`Description: ${project.description}`)
        .text(`Start Date: ${project.startDate}`)
        .text(`End Date: ${project.endDate}`)
        .text(`Location: ${project.location}`)
        .text(`Manager: ${project.manager ? project.manager.name : 'N/A'}`)
        .text(`Employee: ${project.employee ? project.employee.name : 'N/A'}`)
        .moveDown();
    });

    // Finalize the PDF
    doc.end();

    // Send the PDF file as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="project_report.pdf"');
    fs.createReadStream('project_report.pdf').pipe(res);
  } catch (error) {
    console.error("Error generating project report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




export const generateProjectReports = async (req, res) => {
  try {
    // Fetch projects from the database
    const projects = await Project.find().populate('manager').populate('employee');

    // Create a new PDF document
    const doc = new PDFDocument();
    const pdfPath = './project_report.pdf'; 

    // Generate report content
    doc.fontSize(14).text('Project Report', { align: 'center' }).moveDown();

    projects.forEach(project => {
      doc.fontSize(12)
        .text(`Name: ${project.name}`)
        .text(`Description: ${project.description}`)
        .text(`Start Date: ${project.startDate}`)
        .text(`End Date: ${project.endDate}`)
        .text(`Location: ${project.location}`)
        .text(`Manager: ${project.manager ? project.manager.name : 'N/A'}`)
        .text(`Employee: ${project.employee ? project.employee.name : 'N/A'}`)
        .moveDown();
    });

    // Finalize the PDF and save to a file
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.end();

    // Save the PDF file to ManagerInput schema
    const pdfData = fs.readFileSync(pdfPath);
    const managerInput = new ManagerInput({
      projectReport: pdfData, 
    });
    await managerInput.save();

    // Send the PDF report to the manager via email
    await sendReportByEmail(pdfPath, 'amenguda@gmail.com'); 

    // Send the PDF file as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="project_report.pdf"');
    fs.createReadStream(pdfPath).pipe(res);
  } catch (error) {
    console.error("Error generating project report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendReportByEmail = async (pdfPath, managerEmail) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "mail.gooderash.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: 'e-learning@gooderash.com',
        pass: 'Amen#19729',
      },
    });

    // Setup email data
    const mailOptions = {
      from: 'e-learning@gooderash.com',
      to: managerEmail,
      subject: 'Project Report',
      text: 'Please find the attached project report.',
      attachments: [{
        filename: 'project_report.pdf',
        path: pdfPath, 
      }],
    };
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Report sent to manager successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



export const getProjectReport = async (req, res) => {
  try {
  
    const managerInput = await ManagerInput.find();

    if (!managerInput) {
      return res.status(404).json({ error: 'Project report not found' });
    }

    // Send the PDF data as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.send(managerInput.projectReport);
  } catch (error) {
    console.error("Error fetching project report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
