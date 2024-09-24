import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true
    },

    location: {

    },
    
    price: {
        type: mongoose.Schema.Types.Mixed,
        validate: {
            validator: (v) => {
                return (
                    typeof v === 'number' || 
                        ( Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number' && v[0] < v[1])  
                );
            },
            message : "Insert a valid price range!"
        }
    },

    date: {
        type: Date,
        required: true,
    },

    category: {
        type: String,
        required: true,
        //include an array of categories available
    },

    tags: {
        type: Array,
    },

    discount: {
        type: Number,
    },

    isBookingOpen: {
        type: Boolean,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    advertiserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;