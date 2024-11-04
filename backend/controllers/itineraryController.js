import axios from "axios";
import Itinerary from "../models/itineraryModel.js";
import Activity from "../models/activityModel.js";
import HistoricalPlaces from "../models/historicalPlacesModel.js";
import PreferenceTag from "../models/preferenceTagModel.js";
import ActivityCategory from "../models/activityCategoryModel.js";
import mongoose from "mongoose";

export const createItinerary = async (req, res) => {
  try {
    const newItineraryData = new Itinerary({
      ...req.body,
      tourGuideId: req.user.userId,
    });
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
    const { upcoming } = req.query;
    const filters = {};

    if (upcoming === "true")
      filters["availableSlots.startTime"] = { $gte: new Date() };

    const itineraries = await Itinerary.find(filters)
      .populate("activities")
      .populate("historicalSites")
      .populate("tags")
      .populate("tourGuideId");
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching itineraries",
      error: error.message,
    });
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
      .populate("activities")
      .populate("historicalSites")
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
      .populate("activities")
      .populate("historicalSites")
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
      const deletedItinerary = await Itinerary.findByIdAndDelete(id);
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

// Read all itineraries with filtering and currency conversion
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
      currency = "USD", // Default to USD if currency is not provided
    } = req.query;

    // Fetch exchange rates for price conversion
    const rates = await getExchangeRates(currency); // Pass the currency directly

    const exchangeRate = rates[currency] || 1;

    // Build filters based on query params
    const filters = {};

    if (search) filters.name = { $regex: search, $options: "i" };

    if (startDate)
      filters["availableSlots.date"] = { $gte: new Date(startDate) };
    if (endDate) {
      filters["availableSlots.date"] = {
        ...filters["availableSlots.date"],
        $lte: new Date(endDate),
      };
    }

    // Convert prices based on selected currency
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

    // Fetch itineraries with filters and sort
    let itineraries = await Itinerary.find(filters)
      .populate("tags")
      .populate("tourGuideId")
      .sort(sortCondition);

    // Convert itinerary prices to the selected currency
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

// export const searchItems = async (req, res) => {
//   try {

//       const { name, category, tags } = req.query;

//       const activityFilter = {};
//       const historicalPlacesFilter = {};
//       const itineraryFilter = {};

//       if (name) {
//         const regexName = { $regex: name, $options: 'i' };
//         activityFilter.title = regexName;
//         historicalPlacesFilter.name = regexName;
//         itineraryFilter.name = regexName;
//       }

//       if (category) {
//         //activityFilter.category = category.toLowerCase()
//        // const categoryResult = await ActivityCategory.findOne({ name: category.toLowerCase() });
//        const tagsArray = category.split(',').map(category => category.trim());
//         activityFilter.category = { $in: await ActivityCategory.find({ name: { $in: tagsArray } }).select('_id') };
//         // const activities = await Activity.find(activityFilter);
//         // return  res.status(200).json(activities);
//       }

//       if (tags) {
//         const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
//          activityFilter['tags'] = { $in: await PreferenceTag.find({ name: { $in: tagsArray } }).select('_id') };
//        historicalPlacesFilter.tags = { $in: tagsArray };
//         itineraryFilter['tags']={ $in: await PreferenceTag.find({ name: { $in: tagsArray } }).select('_id') };

//       }

//       const activities =  await Activity.find(activityFilter) ;
//       const historicalPlace = await HistoricalPlaces.find(historicalPlacesFilter);
//       const itineraries = await Itinerary.find(itineraryFilter).populate('activities').populate(
//           'historicalSites');

//       const results = { activities, historicalPlace, itineraries };

//       if (activities.length === 0 && historicalPlace.length === 0 && itineraries.length==0) {
//         return res.status(404).json({
//           success: false,
//           message: 'No matching results found for the given criteria',
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Results fetched successfully',
//         results,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: 'Error occurred while searching',
//         error: error.message,
//       });
//     }
//   };
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

////For rating the itineraries
export const rateItinerary = async (req, res) => {
  const { itineraryId, touristId, rating, comment } = req.body;
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" });

    // Add or update the rating for this tourist
    const existingRating = itinerary.ratings.find(r => r.touristId.toString() === touristId);
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      itinerary.ratings.push({ touristId, rating, comment });
    }

    await itinerary.save();
    res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting rating", error });
  }
};