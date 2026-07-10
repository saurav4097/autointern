import mongoose from "mongoose";

const InterndataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
   details: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    credentialType: {
      type: String,
      required: true,
      default: "Experience Program",
    },

    credentialId: {
      type: String,
      required: true,
      unique: true,
    },

    duration: {
      type: String,
      default: "30 Days",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

   
  },
  {
    timestamps: true,
     collection: "interndata",
  }
);

export default mongoose.models.Interndata ||
  mongoose.model("Interndata", InterndataSchema);