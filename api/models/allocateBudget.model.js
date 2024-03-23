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
    type: String,
    required: true,
    default: "0",

  },
  tasks: [
    {
      name: { type: String, required: true },
      description: { type: String },
      dueDate: {
        type: Date,
        validate: {
          validator: function (dueDate) {
            return dueDate > new Date();
          },
          message: "Due date must be in the future",
        },
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
