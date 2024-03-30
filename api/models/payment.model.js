import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    tin: { type: String },
    name: { type: String },
    amount: { type: String},
    approved: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
      },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", 
      },
},
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
