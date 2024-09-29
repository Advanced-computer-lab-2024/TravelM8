const Itinerary = require('../models/itineraryModel.js');
const Activity = require('../models/activityModel.js');

//const { default: mongoose } = require('mongoose');

//create new itinerary 
const createItinerary = async (req, res) => {
    try {
        const newItinerary = new Itinerary(req.body); // Create a new instance of the Itinerary model
        await newItinerary.save(); // Save the new itinerary to the database
        res.status(201).json({
             message: 'Itinerary added successfully', itinerary: newItinerary }); // Send a success response
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding itinerary', error: error.message }); // Send error response if something goes wrong
    }
};

// read/retrieve all itineraries 
const readItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find().populate('activities'); // Fetch all itineraries and populate activities
        res.status(200).json(itineraries); // Send the list of itineraries in the response
    } catch (error) {
        res.status(500).json({
             message: 'Error fetching itineraries', error: error.message }); // Send error response if something goes wrong
    }
};

// update an itinerary in the database
const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params; // Get itinerary ID from URL parameters
        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, req.body, { new: true }); // Update the itinerary

        if (!updatedItinerary) {
            return res.status(404).json({
                 message: 'Itinerary not found' }); // Handle case where itinerary is not found
        }

        res.status(200).json({ 
            message: 'Itinerary updated successfully', itinerary: updatedItinerary }); // Send success response
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating itinerary', error: error.message }); // Send error response if something goes wrong
    }
};

// delete an itinerary from the database
const deleteItinerary = async (req, res) => {

    /////////////////////////////////////////////////////////////////////////////////
    ///??????????????????? cannot be deleted if bookings are already made
    /////////////////////////////////////////////////////////////////////////////////

    try {
        const { id } = req.params; // Get itinerary ID from URL parameters
        const deletedItinerary = await Itinerary.findByIdAndDelete(id); // Find the itinerary by ID and delete

        if (!deletedItinerary) {
            return res.status(404).json({
                 message: 'Itinerary not found' }); // Handle case where itinerary is not found
        }

        res.status(200).json({
             message: 'Itinerary deleted successfully' }); // Send success response
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting itinerary', error: error.message }); // Send error response if something goes wrong
    }
};

const filterItineraries = async (req, res) => {
    try {
        const { budget, date, preferences, language } = req.query;

        const fixedPreferences = ['historic', 'beaches', 'family-friendly', 'shopping']; // Fixed array of preferences
        const filterCriteria = {}; //empty object that will be populated based on the presence 
                                    //and validity of the filter values provided

        // Budget filtering
        // Budget filtering: expects budget to be an array [min, max]

        if (budget) {
            const budgetArray = budget.split(',').map(Number); // Convert to array of numbers
            if (budgetArray.length === 2) { // Ensure the array has exactly two values
                const [min, max] = budgetArray; // Destructure the array
                // Include values less than the min and within the min-max range
                filterCriteria.price = {
                    $or: [
                        { $lte: min }, // Prices less than or equal to min
                        { $gte: min, $lte: max } // Prices within the range [min, max]
                    ]
                };
            }
        }

        // Date filtering
        if (date) {
            const availableDate = new Date(date);
            filterCriteria.availableDates = { $gte: availableDate }; // Upcoming dates
        } 
        // Preferences filtering
        if (preferences) {
            const prefArray = preferences.split(',');
            // Only allow preferences that are in the fixed array
            const validPreferences = prefArray.filter(pref => fixedPreferences.includes(pref));
            filterCriteria.preferences = { $in: validPreferences }; // Matching any of the valid preferences
        }

        // Language filtering
        if (language) {
            filterCriteria.language = language; // Exact match for language
        }

        const itineraries = await Itinerary.find(filterCriteria).populate('activities');
        res.status(200).json(itineraries); // Return the filtered itineraries

    } catch (error) {
        res.status(500).json({ message: 'Error filtering itineraries', error: error.message });
    }
};

const searchItems = async (req, res) => {
    try {
        const { name, category, tags } = req.query;

        // Initialize filter criteria
        const filterCriteria = {};

        // If searching by name, use a case-insensitive partial match
        if (name) {
            filterCriteria.name = { $regex: name, $options: 'i' };
        }

        // If category is provided, match it using a reference to the Category collection
        if (category) {
            filterCriteria.category = category; 
        }

        // If tags are provided, split into an array and match using references to the Tag collection
        if (tags) {
            const tagsArray = tags.split(',').map(tag => tag.trim());
            filterCriteria.tags = { $in: tagsArray }; // Assuming `tags` are references or exact strings
        }

        // Execute the query, populating any referenced fields
        const items = await Activity.find(filterCriteria)
            .populate('category') // Populate category reference
            .populate('tags');    // Populate tags reference

        // Return the filtered results
        res.status(200).json({ results: items });
    } catch (error) {
        res.status(500).json({ message: 'Error searching for items', error: error.message });
    }
};

module.exports = { createItinerary, readItineraries, updateItinerary, 
                    deleteItinerary,filterItineraries, searchItems };