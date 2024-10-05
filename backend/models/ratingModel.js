import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
   
    
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    entityType: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
