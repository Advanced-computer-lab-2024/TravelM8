import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import cron from 'node-cron'; 
import activityCategoryRoute from "./routes/activityCategoryRoute.js";
import adminRoute from "./routes/adminRoute.js";
import preferenceTagRoute from "./routes/preferenceTagRoute.js";
import tourismGovernorRoute from "./routes/tourismGovernorRoute.js";
import advertiserRoute from "./routes/advertiserRoute.js";
import sellerRoute from "./routes/sellerRoute.js";
import tourGuideRoute from "./routes/tourguideRoute.js";
import touristRoute from "./routes/touristRoute.js";
import productRoute from "./routes/productRoute.js";
import activityRoute from "./routes/activityRoute.js";
import historicalPlacesRoute from "./routes/historicalPlacesRoute.js";
import itineraryRoute from "./routes/itineraryRoute.js";
import pendingUserRoute from "./routes/pendingUserRoute.js";
import ratingRoute from "./routes/ratingRoute.js";
import loginRoute from "./routes/loginRoute.js";
import complaintRoute from "./routes/complaintsRoute.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import placeTagRoute from "./routes/placeTagRoute.js";
import purchaseRoute from "./routes/purchaseRoute.js";
import hotelsRoute from "./routes/hotelsRoute.js";
import logoutRoute from "./routes/logoutRouter.js";
import activityBookingsRoute from "./routes/bookingsActivityRoute.js";
import itineraryBookingsRoute from "./routes/bookingsRoute.js";
import deleteRequestRoute from "./routes/deleteRequestRoute.js";
import notificationRoutes from "./routes/notificationsRoutes.js";
import "./services/Reminders/reminderjob.js";
import authRoute from './routes/authRoute.js';
import orderRoutes from './routes/orderRoute.js';
import bookmarksRoutes from './routes/BookmarkRoute.js';
import promoControlRoute from './routes/promoControlRoute.js';
import { sendBirthdayPromoCodes } from './controllers/promoCodeController.js'
import buttonActionRoutes from './routes/buttonAction.js';

import notificationRoutesTourist from './routes/NotificationTouristRouter.js';


dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed methods
    credentials: true, // If you are sending cookies or authorization headers
  })
);

app.options("*", cors());

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use("/api", placeTagRoute);
app.use("/api", activityCategoryRoute);
app.use("/api", adminRoute);
app.use("/api", preferenceTagRoute);
app.use("/api", tourismGovernorRoute); // Fixed route for tourists
app.use("/api", activityRoute);
app.use("/api", advertiserRoute);
app.use("/api", sellerRoute);
app.use("/api", tourGuideRoute);
app.use("/api", touristRoute);
app.use("/api", complaintRoute);
app.use("/api/products", productRoute);
app.use("/api", historicalPlacesRoute);
app.use("/api", itineraryRoute);
app.use("/api", pendingUserRoute);
app.use("/api", ratingRoute);
app.use("/api/auth", loginRoute);
app.use("/api/", logoutRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", uploadRoutes);
app.use("/api", hotelsRoute);
app.use("/api", purchaseRoute);

app.use("/api", activityBookingsRoute);
app.use("/api", itineraryBookingsRoute);
app.use('/api', orderRoutes);
app.use("/api", bookmarksRoutes);

app.use("/api", deleteRequestRoute);
app.use("/api", notificationRoutes);
app.use('/api/auth', authRoute);

app.use('/api', promoControlRoute);

app.use('/api/notifications', notificationRoutesTourist);
app.use(express.json());

app.use('/api/button-actions', buttonActionRoutes);

cron.schedule('0 0 * * *', async () => {
  try {
    await sendBirthdayPromoCodes();
  } catch (error) {
    console.error("Error in sendBirthdayPromoCode cron job:", error.message);
  }
});

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
