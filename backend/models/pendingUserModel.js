import mongoose from "mongoose";
import validator from "validator";

const pendingUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    match: /^[a-zA-Z0-9]{3,16}$/,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    validate: function (value) {
      // Regular expression to check if the password has at least one letter and one number
      return /[a-zA-Z]/.test(value) && /\d/.test(value);
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email), // Using Validator.js
      message: "Please enter a valid email address.",
    },
  },
  type: {
    type: String,
    enum: ["Seller", "Advertiser", "TourGuide"],
    required: true,
  },
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
export default PendingUser;
