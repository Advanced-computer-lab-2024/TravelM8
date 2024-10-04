import mongoose from 'mongoose';  //to communicate with the db
import Product from '../models/productModel.js';


export const createProduct = async (req, res) => {
  try {
    const { Name, Image, Price, Quantity, Description, Seller, Rating, Reviews } = req.body;

    const newProduct = new Product({
      Name,
      Image,
      Price,
      Quantity,
      Description,
      Seller,
      Rating,
      Reviews
    });

    
    const savedProduct = await newProduct.save();

  
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters

    // Find the product by ID and remove it
    const deletedProduct = await Product.findByIdAndDelete(id);

    // If no product found, return a 404 error
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, sortByRating, search } = req.query;  //here ba-retrieve el query parameter (min,max) and sorting that the user will put in the request
    
    //My Filter Logic
    let filter = {};   //this is empty filter object and if user did not provide min and max, will retrieve all products
    if (minPrice || maxPrice) {
      filter.Price = {}; //ba-initialize empty price filter object
      if (minPrice) filter.Price.$gte = parseFloat(minPrice);  // Price >= minPrice
      if (maxPrice) filter.Price.$lte = parseFloat(maxPrice);  // Price <= maxPrice
    }

    //Search Logic 
      if (search) {
        filter.Name = { $regex: search, $options: 'i' }; // 'i' makes it case-insensitive; ya3ny masln product and PRODUCT ; bei-treat the uppercase and lowercase the same 
      }

    //Sorting Logic
    let sortCondition = {};
    if (sortByRating === 'asc') {
      sortCondition.Rating = 1;  // Ascending order; 1 means in mongodb ascending 
    } else if (sortByRating === 'desc') { 
      sortCondition.Rating = -1; // Descending order; -1 means in mongodb descending 
    }


    const products = await Product.find(filter).sort(sortCondition);  //hena will find the products with the given price filter or sorting
    
    if (products.length === 0) {  //el condition da 3alashan law 3amal serach 3ala product msh mawgood in the db
      return res.status(404).json({ success: false, message: 'No products found matching the search criteria' });
    }

    res.status(200).json({success : true , data: products}); 
  } catch (error) {
    console.log("error in ftching products:", error.message);
    res.status(500).json({ message: error.message }); 
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({success: false , message:"Product not found; invalid"});
    }


    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document with updated data 
      runValidators: true // Validate the data against the schema
    });

    //law mafeesh product
    //if (!updatedProduct) {
      //return res.status(404).json({ message: 'Product not found' });
    //}

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

