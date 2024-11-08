import mongoose from "mongoose"; // to communicate with the db
import Product from "../models/productModel.js";
import { createRatingStage } from "../helpers/aggregationHelper.js";
import axios from "axios";

// Function to create a product
export const createProduct = async (req, res) => {
  try {
    const { name, image, price, quantity, description } = req.body;

    const newProduct = new Product({
      name,
      image,
      price,
      quantity,
      description,
      sellerId: req.user.userId,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const archiveProduct = async (req, res) => {
  try {
    const{id}= req.params;
    console.log(`Archiving product with ID: ${id}`);

    const ArchivedProduct = await Product.findByIdAndUpdate(
      id,
      {archived: true}, 
      {new: true}
    );

    if(!ArchivedProduct){
      return res.status(404).json({ message: 'Product not found'});
    }
    res.status(200).json({ message: 'Product archived successfully'});
  } catch(error){
    res.status(500).json({message: 'error occured ...'});
  }
  }

export const unarchiveProduct = async (req, res) =>{
  try{
    const {id} = req.params;
    const unArchivedProduct = await Product.findByIdAndUpdate(id, {archived: false}, {new: true});

    if(!unArchivedProduct){
      return res.status(404).json({messege: "Product not found"});
    }
    res.status(200).json({messege: 'Product unarchived successfully'});
  } catch (error){
    res.status(500).json({messege: 'Error occured'});
  }
}




// Function to delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    // Find the product by ID and remove it
    const deletedProduct = await Product.findByIdAndDelete(id);

    // If no product found, return a 404 error
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to create a populate stage
const createPopulateStage = (minRating) => {
  const ratingStage = createRatingStage("Product", false, minRating);
  return [
    ...ratingStage,
    {
      $lookup: {
        from: "sellers",
        localField: "sellerId",
        foreignField: "_id",
        as: "seller",
      },
    },
    {
      $unset: "sellerId",
    },
    {
      $addFields: {
        seller: { $ifNull: [{ $arrayElemAt: ["$seller", 0] }, null] }, // Set seller to null if no match
      },
    },
  ];
};

// Function to get exchange rates
async function getExchangeRates(base = "USD") {
  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${base}`
  );
  return response.data.rates;
}

// Function to get all products
export const getAllProducts = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      sortByRating,
      search,
      minRating,
      sortBy,
      order,
      currency = "USD",
    } = req.query;

    // Fetch exchange rates
    const rates = await getExchangeRates("USD");
    const exchangeRate = rates[currency] || 1;
    const userRole = req.user?.role; //user role available on req.user ? 

    // Prepare filter for price range, converting values from the selected currency to USD
    let filter = {};
    //if(userRole !== 'admin' && userRole !== 'seller'){ //kda admins and sellers see all products archived or not
      //filter.archived = false; // toursits only see unarchived products
   // }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice) / exchangeRate;
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice) / exchangeRate;
    }

    // Search logic
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Sorting logic
    let sortCondition = {};
    if (sortByRating) {
      sortCondition.averageRating = sortByRating === "desc" ? -1 : 1;
    }
    if (sortBy) {
      sortCondition[sortBy] = order === "desc" ? -1 : 1;
    }

    // Use createPopulateStage to populate the data
    const aggregationPipeline = [
      { $match: filter },
      ...createPopulateStage(minRating),
      ...(sortBy ? [{ $sort: sortCondition }] : []),
    ];

    // Execute the aggregation pipeline
    let products = await Product.aggregate(aggregationPipeline);

    // Convert prices back to the selected currency for display
    products = products.map((product) => ({
      ...product,
      price: (product.price * exchangeRate).toFixed(2),
    }));

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error fetching products:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Function to update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found; invalid" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document with updated data
      runValidators: true, // Validate the data against the schema
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get products belonging to the authenticated user
export const getMyProducts = async (req, res) => {
  const userId = req.user?.userId;
  try {
    const products = await Product.find({ sellerId: userId });
    if (products.length === 0) res.status(204).send();
    else res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ message: "Enter a valid ID" });
  }
};
