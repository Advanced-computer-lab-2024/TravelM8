import express from "express";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from 'cors';
import activityCategoryRoute from "./routes/activityCategoryRoute.js";
import adminRoute from "./routes/adminRoute.js";
import preferenceTagRoute from "./routes/preferenceTagRoute.js";
import tourismGovernorRoute from "./routes/tourismGovernorRoute.js";
import advertiserRoute from './routes/advertiserRoute.js';
import sellerRoute from './routes/sellerRoute.js';
import tourGuideRoute from "./routes/tourGuideRoute.js";
import touristRoute from "./routes/touristRoute.js";
import productRoute from './routes/productRoute.js'; 
import activityRoute from "./routes/activityRoute.js"
import historicalPlacesRoute from "./routes/historicalPlacesRoute.js"
import itineraryRoute from "./routes/itineraryRoute.js";
import pendingUserRoute from "./routes/pendingUserRoute.js";




dotenv.config({path:'../.env'});

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});


app.use(express.json()); // allows us to accept JSON data in the req.body
app.use("/api", activityCategoryRoute);
app.use("/api", adminRoute);
app.use("/api", preferenceTagRoute);
app.use("/api", tourismGovernorRoute); // Fixed route for tourists
app.use("/api", activityRoute);
app.use("/api", advertiserRoute);
app.use("/api", sellerRoute);
app.use("/api", tourGuideRoute);
app.use("/api", touristRoute);
app.use('/api/products',productRoute);
app.use("/api", historicalPlacesRoute);
app.use("/api", itineraryRoute);
app.use("/api", pendingUserRoute);



// app.use(express.static("frontend/public")); // Serve static files from the public directory inside frontend

// Serve HTML pages from the public folder
// app.get("/user", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/user.html")); // Landing page
// });

// app.get("/admin", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/index.html")); // Admin registration page
// });

// app.get("/tourist", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/index2.html")); // Tourist registration page
// });

// // New Route for Activity Categories
// app.get("/activityCategory", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/public/activities.html")); // Serve the activity categories HTML page
// });
// =======
