import mongoose from "mongoose";
import HistoricalPlace from "../models/historicalPlacesModel.js";
import TourismGovernor from "../models/tourismGovernorModel.js";
//const  mongoose = require('mongoose');
import jwt from "jsonwebtoken"; // Add this line
import axios from "axios";
import PlaceTags from "../models/placeTag.js";

export const createHistoricalPlace = async (req, res) => {
  try {
    const { name, description, location, image, openingHours, price, tags } =
      req.body;

    if (
      !name ||
      !description ||
      !location ||
      !image ||
      !openingHours ||
      !price
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newPlace = new HistoricalPlace({
      name,
      description,
      location,
      image,
      openingHours,
      price,
      tags,
      tourismGovernorId: req.user.userId,
    });

    await newPlace.save();

    res
      .status(201)
      .json({ message: " Historical place created successfully", newPlace });
  } catch (error) {
    console.error("Error creating new historical place:", error);
    res.status(500).json({
      message: "Server error. Could not create the historical place.",
    });
  }
};

//TourismGovernor only
export const getMyPlaces = async (req, res) => {
  const userId = req.user?.userId;

  try {
    let Places;
    Places = await HistoricalPlace.find({ tourismGovernorId: userId }).populate('tags','type');
    if (Places.length == 0) res.status(204);
    else res.status(200).json({ Places });
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(400).json({ message: "enter a valid id" });
  }
};

async function getExchangeRates(base = "USD") {
  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${base}`
  );
  return response.data.rates;
}
export const getAllHistoricalPlaces = async (req, res) => {
  try {
    const {
      currency = "USD",
      exchangeRate = 1,
      minPrice,
      maxPrice,
    } = req.query;
    const filter = {};

    if (minPrice || maxPrice) {
      const minConverted = minPrice
        ? parseFloat(minPrice) / exchangeRate
        : null;
      const maxConverted = maxPrice
        ? parseFloat(maxPrice) / exchangeRate
        : null;
      filter.price = {};
      if (minConverted !== null) filter.price.$gte = minConverted;
      if (maxConverted !== null) filter.price.$lte = maxConverted;
    }

    let places = await HistoricalPlace.find(filter);

    // Convert prices to the selected currency
    places = places.map((place) => ({
      ...place.toObject(),
      price: place.price.map(({ type, price }) => ({
        type,
        price: (price * exchangeRate).toFixed(2),
      })),
    }));

    res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching historical places:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteHistoricalPLace = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: "Historical place not found; invalid id" });
    }

    const deletedPlace = await HistoricalPlace.findByIdAndDelete(id);
    if (!deletedPlace) {
      return res.status(404).json({ message: "Historical Place not found" });
    }

    res.status(200).json({ message: "Historical Place deleted successfully" });
  } catch (error) {
    console.error("Error deleting Historical Place:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await HistoricalPlace.findById(id);

    if (!tour) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the tour", error });
  }
};

export const updateHistoricalPLace = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: "Historical place not found; invalid id" });
    }

    const updatedPlace = await HistoricalPlace.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPlace) {
      return res.status(404).json({ message: "Historical Place not found" });
    }

    res
      .status(200)
      .json({ message: "Historical place updated successfully", updatedPlace });
  } catch (error) {
    console.error("Error updating historical place:", error);
    res.status(500).json({
      message: "Server error. Could not update the historical place.",
    });
  }
};

export const createTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, historicalPeriod } = req.body;
    // Find the historical place by ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: "Historical place not found; invalid id" });
    }
    const place = await HistoricalPlace.findById(id);
    if (!place) {
      return res.status(404).json({ message: "Historical Place not found" });
    }

    // Update the type and/or historical period
    if (type) place.tags.type = type;
    if (historicalPeriod) place.tags.historicalPeriod = historicalPeriod;
    await place.save();

    res.status(200).json({ message: "Tags updated successfully", place });
  } catch (error) {
    console.error("Error updating tags:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not update the tags." });
  }
};

export const filterbyTags = async (req, res) => {
  try {
    // const { type, historicalPeriod } = req.query;
    const { tag, searchBy, search, price, currency = "USD", exchangeRate = 1} = req.query;

    // Build the query object dynamically
    const filter = {};

    if (price)
    {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      filter["price.price"] = { $gte: minPrice, $lte: maxPrice };
    }

    // Add filters to the query object based on the presence of query parameters
    if (tag) {
      filter["$or"] = [{ "tags.type": tag }, { "tags.historicalPeriod": tag }];
    }

    if (searchBy === "name" && search) {
      filter.name = { $regex: search, $options: "i" };
    } else if (searchBy === "tag" && search) {
      filter["$or"] = [
        { "tags.type": { $regex: search, $options: "i" } },
        { "tags.historicalPeriod": { $regex: search, $options: "i" } },
      ];
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: "placetags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      { $match: filter }
    ];

    let filteredPlaces = await HistoricalPlace.aggregate(aggregationPipeline);
    filteredPlaces = filteredPlaces.map((place) => ({
      ...place,
      price: place.price.map(({ type, price }) => ({
        type,
        price: (price * exchangeRate).toFixed(2),
      })),
    }));
    // Send response
    res.status(200).json(filteredPlaces);
  } catch (error) {
    console.error("Error filtering historical places:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not filter historical places." });
  }
};

export const getMyGovernor = async (req, res) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure this is the same secret used when signing the token
    const governorId = decoded.id; // Extract the governorId from the token

    // Fetch the governor's information from the database
    const governor = await TourismGovernor.findById(governorId).select(
      "-password"
    ); // Exclude password from the response

    if (!governor) {
      return res.status(404).json({ message: "Governor not found" });
    }

    // Send the governor's information as a response
    res.status(200).json(governor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//module.exports = { getAllHistoricalPlaces,deleteHistoricalPLace,updateHistoricalPLace, };
