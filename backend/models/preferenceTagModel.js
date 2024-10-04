import mongoose from 'mongoose';

const preferenceTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

preferenceTagSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });


const PreferenceTag = mongoose.model("PreferenceTag", preferenceTagSchema);
export default PreferenceTag;  
