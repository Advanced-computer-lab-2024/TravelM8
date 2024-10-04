import PreferenceTag from '../models/preferenceTagModel.js';

const createPreferenceTag = async (req, res) => {
  
  const { name } = req.body; 
  try {
    const newTag = new PreferenceTag({ name });
    await newTag.save();
    res.status(201).json(newTag); 
  } catch (error) {
    console.error("Error creating PreferenceTag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPreferenceTags = async (req, res) => {
  try {
    const tags = await PreferenceTag.find(); 
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


const updatePreferenceTag = async (req, res) => {
  const { name, newname } = req.body; 
  try {
    const updatedTag = await PreferenceTag.findOneAndUpdate({ name },{ name: newname },{ new: true } );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error("Error updating Tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deletePreferenceTag = async (req, res) => {
  const { name } = req.body;
  try {
    const deletedTag = await PreferenceTag.deleteOne({ name });
    if (deletedTag.deletedCount === 0) { 
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting Tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {createPreferenceTag, getAllPreferenceTags, updatePreferenceTag, deletePreferenceTag};
