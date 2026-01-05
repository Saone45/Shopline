import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength:5,
    select: false, // hide password by default
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  avatar: {
    type: Object,
    default: null,
  },
  reset_password_token: {
    type: String,
    default: null,
  },
  reset_password_expire: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User',userSchema);
export default User;
