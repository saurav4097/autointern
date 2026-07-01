import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    isSubscribed: {
      type: Boolean,
      default: false,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Internship ||
  mongoose.model("Internship", InternshipSchema);