import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: {
    type: Date,
    validate: {
      validator: function (endDate) {
        return endDate >= this.startDate;
      },
      message: "End date must be equal to or after the start date",
    },
  },
  location: { type: String },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Pending", "InProgress", "Completed"],
    default: "Pending",
  },
  budget: {
    materials: { type: Number, default: 0 },
    labor: { type: Number, default: 0 },
    equipment: { type: Number, default: 0 },
    permits: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },

  supplierApplications: [
    {
      name: { type: String, required: false },
      tin: { type: String, required: false },
      city: { type: String, require: false },
    },
  ],
  tasks: [
    {
      name: { type: String, required: true },
      description: { type: String },
      // assignedTo: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "User",
      //   validate: {
      //     validator: async function (userId) {
      //       // Check if the assigned user has the role "Employee"
      //       const user = await mongoose.model("User").findById(userId);
      //       return user && user.role === "Employee";
      //     },
      //     message: "Task must be assigned to a user with the role 'Employee'",
      //   },
      // },
      dueDate: {
        type: Date,
        // validate: {
        //   validator: function (dueDate) {
        //     // Ensure that the due date is in the future
        //     return dueDate > new Date();
        //   },
        //   message: "Due date must be in the future",
        // },
      },
      status: {
        type: String,
        enum: ["NotStarted", "InProgress", "Completed"],
        default: "NotStarted",
      },
    },
  ],

  suppliers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      approved: { type: Boolean, default: false },
    },
  ],
});

// Create a Project model based on the schema
const Project = mongoose.model("Project", projectSchema);

export default Project;
