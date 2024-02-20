import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    tin: {
      type: String,
      require: false,
      unique: true,
    },
    city: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isManger: {
      type: Boolean,
      default: false,
    },
    isFinance: {
      type: Boolean,
      default: false,
    },
    isSupplier: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
