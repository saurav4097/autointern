import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  email: String,
  role: String,

  // project1 / project2
  task: String,

  // 📝 text input
  text: String,

  // 📂 files
  file1: String,
  file2: String,

  submitted: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Submission ||
  mongoose.model("Submission", SubmissionSchema);