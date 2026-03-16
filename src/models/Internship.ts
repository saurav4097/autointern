import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  startDate: Date,
  endDate: Date,
});

export default mongoose.models.Internship ||
  mongoose.model("Internship", InternshipSchema);