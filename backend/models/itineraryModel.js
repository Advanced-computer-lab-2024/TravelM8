import mongoose from "mongoose";
import Activity from "./activityModel.js";
import HistoricalPlaces from "./historicalPlacesModel.js";
import TourGuide from './tourguideModel.js'
import PreferenceTag from './preferenceTagModel.js'
import Tourist from "./touristModel.js";


const itineraySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  activities: [
    {
      type: String,
      required: true,
    },
  ],

  historicalSites: [
    {
      type: String,
      required: true,
    },
  ],

  tourLanguage: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  timeline: [
    {
      event: {
        type: String,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
    },
  ],

  isBookingOpen: { type:Boolean, default:true},

  availableSlots: [
    {
      date: {
        type: Date,
        required: true,
      },
      numberOfBookings: {
        type: Number,
        default: 0,
      },
      maxNumberOfBookings: {
        type: Number,
        default: 0,
      },
      //have remaining spots
    },
  ],

  accessibility: {
    type: String,
    required: true,
  },

  pickUpLocation: {
    type: String,
    required: true,
  },

  dropOffLocation: {
    type: String,
    required: true,
  },

  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreferenceTag",
      required: true,
    },

  ],
  
  images: [
    {
      type:String,
      required:false
    }
  ],


  tourGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGuide",
    required: true,
  },
  flagged: { type: Boolean, default: false },

});

const Itinerary = mongoose.model("Itinerary", itineraySchema);
export default Itinerary;
