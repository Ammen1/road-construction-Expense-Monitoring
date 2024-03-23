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
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  tinNumber: {
    type: String,
    required: true,
    unique: true,
  },
  servicesProvided: {
    type: [String],
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
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
