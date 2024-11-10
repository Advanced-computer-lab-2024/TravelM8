import mongoose from 'mongoose';
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Seller from '../models/sellerModel.js';
import Advertiser from '../models/advertiserModel.js';
const Schema = mongoose.Schema;

const deletionRequestSchema = new Schema({
  
    name: {
        type: String,
        required: true,
      },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userType',
  },
  userType: {
    type: String,
    required: true,
    enum: ['Tourist', 'TourGuide', 'Seller', 'Advertiser'],
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },

 /* status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },*/
 
}, { timestamps: true });

const DeletionRequest = mongoose.model('DeletionRequest', deletionRequestSchema);
export default DeletionRequest;
