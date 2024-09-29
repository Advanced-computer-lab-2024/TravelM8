import mongoose from 'mongoose';

const HistoricalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true
    },

    location: {
      type: String,
      required: true
    },
    
    image: {
        type: String,
        required: true,
    },

   // openingHours: {
     //   open: String,  required: true,// Example: "09:00"
     // close: String,  required: true,// Example: "17:00"
    //},
      openingHours: {
        open: { type: String, required: true },
        close: { type: String, required: true },
      },

    price: {
  type: Number,    
  required: true,
  validate: {
    validator: (v) => v > 0,
    message: "Price must be a positive number!"
  }
},
 


tags: {
  type: {
      type: String, // Example: "museum", "landmark", etc.
      enum: ["museum", "Palaces/castles", "monument", "religious site"], //list of valid types
      default: null,  
  },
  historicalPeriod: {
      type: String,   
      default: null,   
  },
},

    TourismGovernorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required: true,
   },
    
 });

const HistoricalPlaces = mongoose.model("HistoricalPlaces", HistoricalSchema);
export default HistoricalPlaces;