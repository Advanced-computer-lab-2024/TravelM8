import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcryptjs';
import moment from 'moment';
import validator from "validator";

const touristSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  
  username: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    match: /^[a-zA-Z0-9]{3,16}$/,
  },
 
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email), // Using Validator.js
      message: 'Please enter a valid email address.',
    },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    validate: function(value) {
        // Regular expression to check if the password has at least one letter and one number
        return /[a-zA-Z]/.test(value) && /\d/.test(value);
      }
  },
  mobileNumber: {
    type: Number,
    required: true,
     
  },
  nationality: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
    immutable: true,  // This ensures that dob cannot be changed after creation
    validate: {
      validator: function(value) {
        const age = moment().diff(moment(value), 'years');
        return age >= 18; // Returns false if the age is less than 18
      },
      message: 'You must be at least 18 years old to register.'
    }
  },
  occupation:{  // student/job
    type: String,
    required: true,
},

  wallet:{
    type: Number,
    required: false,
    immutable: true,
  },

}, { timestamps: true });



// Prevent dob from being updated after it's initially set
touristSchema.pre('save', function(next) {
  if (this.isModified('dob') && !this.isNew) {
    return next(new Error('Date of Birth cannot be changed once set.'));
  }
  next();
});

touristSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Tourist= mongoose.model("Tourist", touristSchema);
export default Tourist;