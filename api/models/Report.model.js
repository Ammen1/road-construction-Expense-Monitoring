import mongoose from "mongoose";

const managerInputSchema = new mongoose.Schema({
  projectReport: { type: Buffer, },
  budget: { type: Number, },
  budgetDetails: { type: String},
  requiredMaterials: { type: String },
  machineryRequirements: { type: String },
  laborRequirements: { type: String},
  timeline: { type: String },
  sitePreparation: { type: String },
  environmentalConsiderations: { type: String },
  safetyPlan: { type: String },

});

const ManagerInput = mongoose.model("managerInput", managerInputSchema);

export default ManagerInput;