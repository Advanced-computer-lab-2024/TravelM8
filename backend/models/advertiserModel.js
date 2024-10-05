import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from "validator";

const advertiserSchema = new mongoose.Schema({
  name: {
    type: String,
     
  },
  description: {
    type: String,
   // required: true,
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
    minlength : 6,
    required: true,
    validate: function(value) {
      // Regular expression to check if the password has at least one letter and one number
      return /[a-zA-Z]/.test(value) && /\d/.test(value);
    }
  },
  website: {
    type: String,
  },
  hotline: {
    type: Number,
  },
  
 
}, 
    { 
    timestamps: true 
    });


advertiserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const Advertiser= mongoose.model("Advertiser", advertiserSchema);
export default Advertiser;//.model("collection name",schema)=creates a model from a schema, which maps to a specific collection in the MongoDB database.
