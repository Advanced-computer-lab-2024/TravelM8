import axios from "axios";
import Itinerary from "../models/itineraryModel.js";
import Activity from "../models/activityModel.js";
import HistoricalPlaces from "../models/historicalPlacesModel.js";
import PreferenceTag from "../models/preferenceTagModel.js";
import ActivityCategory from "../models/activityCategoryModel.js";
import mongoose from "mongoose";

export const createItinerary = async (req, res) => {
  try {
    // const newItineraryData = new Itinerary({
    //   ...req.body,
    //   tourGuideId: req.user.userId,
    // });
    const newItineraryData = new Itinerary(req.body);
    await newItineraryData.save();
    res.status(201).json({
      message: "Itinerary added successfully",
      newItineraryData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding itinerary",
      error: error.message,
    });
  }
};

// read/retrieve all itineraries
export const readItineraries = async (req, res) => {
  try {
    const { upcoming, isAdmin } = req.query;
    const filters = {};

    // Apply flagged filter for non-admin users
    if (isAdmin !== "true") {
      filters.flagged = false; // Only show unflagged itineraries to non-admin users
    }

    // Apply the upcoming filter, if specified
    if (upcoming === "true") {
      filters["availableSlots.startTime"] = { $gte: new Date() };
    }

    // Fetch itineraries with the specified filters
    const itineraries = await Itinerary.find(filters)
      .populate("tags")
      .populate("tourGuideId");

    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Error fetching itineraries:", error.message);
    res.status(500).json({
      message: "Error fetching itineraries",
      error: error.message,
    });
  }
};

export const fetchItinerary = async (req, res) => {
  const id = req.params.id;
  try {
    const itinerary = await Itinerary.findById(id)
      .populate("tags")
      .populate("tourGuideId");
    return res.status(200).json(itinerary);
  } catch (error) {
    return res.status(400).json({ message: "Error", error: error.message });
  }
};

//TourGuide only
export const getMyItineraries = async (req, res) => {
  try {
    const tourGuideId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(tourGuideId)) {
      return res.status(404).json({ message: "Enter a valid id" });
    }
    const itineraries = await Itinerary.find({ tourGuideId })
      .populate("tags")
      .populate("tourGuideId");
    if (itineraries.length == 0)
      return res.status(404).json({ message: "no itineraries found" });
    else return res.status(200).json({ itineraries });
  } catch (error) {
    return res.status(400).json({ message: "Error", error: error.message });
  }
};

// update an itinerary in the database
export const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItinerary = await Itinerary.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("tags")
      .populate("tourGuideId");

    if (!updatedItinerary) {
      return res.status(404).json({
        message: "Itinerary not found",
      });
    }

    res.status(200).json({
      message: "Itinerary updated successfully",
      itinerary: updatedItinerary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating itinerary",
      error: error.message,
    });
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itineraryToBeDeleted = await Itinerary.findById(id);

    if (!itineraryToBeDeleted) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    let hasBookings = false;
    const slots = itineraryToBeDeleted.availableSlots;
    console.log(hasBookings);
    for (let i = 0; i < slots.length; i++) {
      console.log("Checking slot:", slots[i]);
      console.log(slots[i].numberOfBookings);
      if (slots[i].numberOfBookings > 0) {
        hasBookings = true;
        console.log(hasBookings);
        break;
      }
    }

    if (hasBookings) {
      console.log("Itinerary has bookings:", slots);
      return res
        .status(400)
        .json({ message: "Cannot delete itinerary with existing bookings" });
    } else {
      await Itinerary.findByIdAndDelete(id);
    }

    return res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting itinerary",
      error: error.message,
    });
  }
};
async function getExchangeRates(base = "USD") {
  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${base}`
    );
    return response.data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error.message);
    throw new Error("Could not fetch exchange rates");
  }
}

export const filterItineraries = async (req, res) => {
  try {
    const {
      minPrice = 0,
      maxPrice = Infinity,
      tags,
      language,
      startDate,
      endDate,
      search,
      sortBy,
      order,
      currency = "USD",
    } = req.query;

    // Fetch exchange rates for price conversion
    const rates = await getExchangeRates("USD");
    const exchangeRate = rates[currency] || 1;
    const filters = {};
    if (search) filters.name = { $regex: search, $options: "i" };
    if (startDate)
      filters["availableSlots.date"] = { $gte: new Date(startDate) };
    if (endDate)
      filters["availableSlots.date"] = {
        ...filters["availableSlots.date"],
        $lte: new Date(endDate),
      };

    const minConvertedPrice = parseFloat(minPrice) / exchangeRate;
    const maxConvertedPrice = parseFloat(maxPrice) / exchangeRate;
    filters.price = { $gte: minConvertedPrice, $lte: maxConvertedPrice };

    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      const tagIds = await PreferenceTag.find({
        name: { $in: tagsArray },
      }).select("_id");
      filters.tags = { $in: tagIds.map((tag) => tag._id) };
    }
    if (language) filters.tourLanguage = language;

    const sortCondition = sortBy ? { [sortBy]: order === "desc" ? -1 : 1 } : {};

    let itineraries = await Itinerary.find(filters)
      .populate("tags")
      .populate("tourGuideId")
      .sort(sortCondition);

    itineraries = itineraries.map((itinerary) => ({
      ...itinerary.toObject(),
      price: (itinerary.price * exchangeRate).toFixed(2),
    }));

    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Error in filterItineraries:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Could not filter itineraries." });
  }
};
export const searchItems2 = async (req, res) => {
  try {
    const { name, category, tags } = req.query;

    // Filters for different models
    const activityFilter = {};
    const historicalPlacesFilter = {};
    const itineraryFilter = {};

    // Filter by name (case-insensitive)
    if (name) {
      const regexName = { $regex: name, $options: "i" };
      activityFilter.title = regexName;
      historicalPlacesFilter.name = regexName;
      itineraryFilter.name = regexName;
    }

    // Filter by category (if present)
    if (category) {
      const categoryArray = category
        .split(",")
        .map((category) => category.trim());

      const categoryIds = await ActivityCategory.find({
        name: { $in: categoryArray },
      }).select("_id");

      if (categoryIds.length > 0) {
        activityFilter.category = { $in: categoryIds.map((cat) => cat._id) };
      }
    }

    // Filter by tags (if present)
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      console.log(tagsArray);
      const tagIds = await PreferenceTag.find({
        name: { $in: tagsArray },
      }).select("_id");
      console.log(tagIds);
      historicalPlacesFilter.$or = [
        { "tags.type": { $in: tagsArray } },
        { "tags.historicalPeriod": { $in: tagsArray } },
      ];
      console.log(historicalPlacesFilter);
      if (tagIds.length > 0) {
        activityFilter.tags = { $in: tagIds.map((tag) => tag._id) };
        //historicalPlacesFilter.tags = { $in: tagsArray }; // Assuming tag names for historical places

        itineraryFilter.tags = { $in: tagIds.map((tag) => tag._id) };
      }
    }

    // Fetch results only if there are valid filters
    const activities =
      Object.keys(activityFilter).length > 0
        ? await Activity.find(activityFilter)
        : [];
    const historicalPlaces =
      Object.keys(historicalPlacesFilter).length > 0
        ? await HistoricalPlaces.find(historicalPlacesFilter)
        : [];
    const itineraries =
      Object.keys(itineraryFilter).length > 0
        ? await Itinerary.find(itineraryFilter)
            .populate("activities")
            .populate("historicalSites")
        : [];

    const results = { activities, historicalPlaces, itineraries };
    if (
      activities.length === 0 &&
      historicalPlaces.length === 0 &&
      itineraries.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "No matching results found for the given criteria",
      });
    }

    // Return success with results
    res.status(200).json({
      success: true,
      message: "Results fetched successfully",
      results,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error occurred while searching:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while searching",
      error: error.message,
    });
  }
};
export const flagItinerary = async (req, res) => {
  const { id } = req.params;
  console.log("ittt");
  try {
    const itinerary = await Itinerary.findByIdAndUpdate(
      id,
      { flagged: true }, // Set flagged to true
      { new: true }
    );

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res
      .status(200)
      .json({ message: "Itinerary flagged as inappropriate", itinerary });
  } catch (error) {
    console.error("Error flagging itinerary:", error);
    res.status(500).json({ message: "Error flagging itinerary" });
  }
};
