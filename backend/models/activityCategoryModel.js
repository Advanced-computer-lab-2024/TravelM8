import mongoose from "mongoose";

const activityCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

activityCategorySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const ActivityCategory = mongoose.model("ActivityCategory", activityCategorySchema);
export default ActivityCategory;