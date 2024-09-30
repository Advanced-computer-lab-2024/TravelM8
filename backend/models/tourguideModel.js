import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tourGuideSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  yearsOfExperience: {
    type: Number,
  },
  previousWork: {
    type: String,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
}, 
    { 
    timestamps: true 
    });

    tourGuideSchema.pre('save', async function (next) {
        if (!this.isModified('password')) {
            next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      });

const TourGuide= mongoose.model("TourGuide", tourGuideSchema);
export default TourGuide;