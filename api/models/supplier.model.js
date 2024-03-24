import mongoose, { mongo } from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    require: true
  },
  tinNumber: {
    type: String,
    required: true,
    unique: true,
  },
  servicesProvided: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  projectsCompleted: {
    type: String,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
