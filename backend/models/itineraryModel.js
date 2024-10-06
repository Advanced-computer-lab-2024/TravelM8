import mongoose from 'mongoose';
import Activity from './activityModel.js';
import HistoricalPlaces from './historicalPlacesModel.js';
import TourGuide from './tourguideModel.js'
import PreferenceTag from './preferenceTagModel.js'

const itineraySchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true
    },

    activities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
            required: true 
        }
    ],

    historicalSites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HistoricalPlaces',
            required: true
        }
    ],    

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
            timeline: [
                {
                    referenceModel: {
                        type: String,
                        required: true,
                        enum: ['Activity', 'HistoricalPlaces'], // Specify the models that can be referenced
                    },
                    event: {
                        type: mongoose.Schema.Types.ObjectId,
                        refPath: 'referenceModel',
                        required: true 
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
            numberOfBookings :{
                 type: Number,
                 min: 0
            }
        }
    ],

    accessibility: {
        type: String,
        required: true,
    },

    pickUpLocation: {
        //google maps
        type: String,
        required: true, 
    },

    dropOffLocation: {
        //google maps
        type: String,
        required: true, 
    },

    tags: [{
        type: mongoose.Schema.Types.ObjectId, // Fixed preferences as an array of strings
        ref:'PreferenceTag',   // SHould refrence tagsModel
        required: true,
    }],

    tourGuideId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourGuide',
        required: true,
    },

});

const Itinerary = mongoose.model("Itinerary", itineraySchema);
export default Itinerary;