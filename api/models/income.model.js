import mongoose from "mongoose";
import Project from "./allocateBudget.model.js";

const incomeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      maxLength: 20,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 200,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", 
    },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);
export default Income;
