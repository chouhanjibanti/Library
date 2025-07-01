import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Full name must be at least 3 characters long"],
    maxlength: [15, "Full name must not exceed 15 characters"],
    match: /^[a-zA-Z\s]+$/,
    message: "Full name can only contain letters and spaces",
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, "Password must be at least 8 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email is Already is in use"],
    trim: true,
    lowercase: true,
    minlength: [13, "Email must be at least 13 characters long"],
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    default: "student",
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  photoUrl:{
    type: String,
    default: ""
  }
},{
    timestamps: true
}
);
const User = mongoose.model("User", userModel);

export default User;