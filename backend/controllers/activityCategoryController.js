import ActivityCategory from "../models/activityCategoryModel.js";

// Create a new activity category
export const createActivityCategory = async (req, res) => {
  const { name } = req.body; // Only get name
  try {
    const newCategory = new ActivityCategory({ name });
    await newCategory.save();
    res.status(201).json(newCategory); // Send the created category back
  } catch (error) {
    console.error("Error creating activity category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all activity categories
export const getAllActivityCategories = async (req, res) => {
  try {
    const categories = await ActivityCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching activity categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an activity category by name
export const updateActivityCategory = async (req, res) => {
  const { name, newName } = req.body; // Expect both current and new name from the request body
  try {
    const updatedCategory = await ActivityCategory.findOneAndUpdate(
      { name }, // Find by current name
      { name: newName }, // Update to the new name
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating activity category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete an activity category by name
// export const deleteActivityCategory = async (req, res) => {
//   const { name } = req.body; // Get the name of the category to delete from the request body
//   try {
//     const deletedCategory = await ActivityCategory.findOneAndDelete({ name }); // Find and delete by name
//     if (!deletedCategory) {
//       return res.status(404).json({ message: "Category not found" });
//     }
//     res.status(200).json({ message: "Activity category deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting activity category:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

//updateg using id
// export const updateActivityCategory = async (req, res) => {
//   const { id } = req.params; // Get the category ID from the request parameters
//   const { newName } = req.body; // Expect the new name from the request body

//   try {
//     const updatedCategory = await ActivityCategory.findByIdAndUpdate(
//       id, // Find by ID
//       { name: newName }, // Update to the new name
//       { new: true } // Return the updated document
//     );

//     if (!updatedCategory) {
//       return res.status(404).json({ message: "Category not found" });
//     }
    
//     res.status(200).json(updatedCategory);
//   } catch (error) {
//     console.error("Error updating activity category:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


//delete using id
export const deleteActivityCategory = async (req, res) => {
  const { name } = req.body; // Get the name of the category to delete from the request body
  try {
    const deletedCategory = await ActivityCategory.findOneAndDelete({ name }); // Find and delete by name
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Activity category deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};