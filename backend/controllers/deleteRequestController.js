import DeletionRequest from '../models/deleteRequestModel.js';
import Tourist from '../models/touristModel.js';
import TourGuide from '../models/tourguideModel.js';
import Seller from '../models/sellerModel.js';
import Advertiser from '../models/advertiserModel.js';
import BookingActivity from '../models/bookingsActivityModel.js';
import Booking from '../models/bookingsModel.js';
import Activity from '../models/activityModel.js';
import jwt from 'jsonwebtoken';



export const createDeletionRequest = async (req, res) => {
    try {
       // const { userId,  userType } = req.body;
        let upcomingActivityBooking ;
        let upcomingItineraryBooking ;
        let hasUpcomingBookings;
        let upcomingBooking;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Authorization token is required" });
        }

        const secret = "a$T8#fGz!x7%kH4q";
        const decoded = jwt.verify(token, secret);
        const { userId, role: userType } = decoded;
       
        let user;
        switch (userType) {
            case 'Tourist':
                user = await Tourist.findById(userId);
                break;
            case 'TourGuide':
                user = await TourGuide.findById(userId);
                break;
            case 'Seller':
                user = await Seller.findById(userId);
                break;
            case 'Advertiser':
                user = await Advertiser.findById(userId);
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        
        if (userType === 'TourGuide') {
           
            hasUpcomingBookings = await Booking.exists({
              tourGuide: userId,
              completionStatus: { $in: ['Pending'] },
              tourDate: { $gte: new Date() } // upcoming tours only
            });
          }
      
          if (userType === 'Tourist') {
              upcomingActivityBooking = await BookingActivity.findOne({
                touristId: userId,
                bookingDate: { $lte: new Date() },
                status: 'booked'
              });
          
                upcomingItineraryBooking = await Booking.findOne({
                tourist: userId,
                tourDate: { $gte: new Date() },
                completionStatus: { $in: ['Pending'] }
              });
          }
          if (userType === 'Advertiser') {

            const advertiserActivities = await Activity.find({ advertiserId: userId }).select('_id');

            // Check if any of these activities have future bookings
            upcomingBooking = await BookingActivity.findOne({
                activityId: { $in: advertiserActivities.map(activity => activity._id) },
                bookingDate: { $lte: new Date() },
                status: 'booked'
            });
        }
      
      
          if (upcomingActivityBooking  ) {
            return res.status(400).json({
              msg: "Cannot delete account with upcoming activity bookings."
            });
          }
          if (  upcomingItineraryBooking) {
            return res.status(400).json({
              msg: "Cannot delete account with upcoming itinerary bookings."
            });
          }
          
          if (hasUpcomingBookings) {    
            return res.status(400).json({
              msg: "Cannot delete account with upcoming booked itineraries ."
            });
          } 
          if (upcomingBooking) {    
            return res.status(400).json({
              msg: "Cannot delete account with upcoming booked activities ."
            });
          } 
      
        const existingRequest = await DeletionRequest.findOne({ user: userId, userType });
        if (existingRequest) {
            return res.status(400).json({ msg: "Deletion request already exists" });
        }

         
        const deletionRequest = new DeletionRequest({
            user: userId,
            name: user.name,   
            userType,
            requestDate: Date.now(),
        });

        await deletionRequest.save();
        res.status(201).json({ msg: "Deletion request created successfully", deletionRequest });
    } catch (error) {
        console.error("Error creating deletion request:", error);
        res.status(500).json({ msg: "Failed to create deletion request" });
    }
};


// Get all deletion requests
export const getAllDeletionRequests = async (req, res) => {
    try {
        const deletionRequests = await DeletionRequest.find().populate('user');
        res.status(200).json(deletionRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch deletion requests', error });
    }
};
