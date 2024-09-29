import mongoose from 'mongoose';
import Activity from './activityModel';

const Activity = require('./Activity');

const itineraySchema = new mongoose.Schema({
    activities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
            required: true // Makes the field required
        }
    ],
    sites:{
        type: [String],
        required: true,
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
        }
    ],
////////////////////////////////////???????????????/??????
    activityDuration: {
        type: String, // or `Number`, if storing as minutes/hours
        required: true,
    },
////////////////////////////////////
    tourLanguage:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0, 
    },
    availableSlots: [
        {
            date: {
                type: Date,
                required: true,
            },
            startTime: {
                type: String,
                required: true,
            },
            endTime: {
                type: String,
                required: true,
            },
        }
    ],
    accessibility: {
        type: String,
        required: true,
    },
    pickupLocation: {
        type: String,
        required: true, 
    },
    dropoffLocation: {
        type: String,
        required: true, 
    },
    preferences: {
        type: [String], // Fixed preferences as an array of strings
        enum: ['historic', 'beaches', 'family-friendly', 'shopping'], // Enumerate valid preferences
        required: true,
    }
});

const Itinerary = mongoose.model("Itinerary", itineraySchema);
export default Itinerary;