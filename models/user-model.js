import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    address : {
      type : String,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", userSchema);