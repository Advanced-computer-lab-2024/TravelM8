import BookingActivity from "../models/bookingsActivityModel.js";
import Activity from "../models/activityModel.js";
import {updatePoints} from "./touristController.js"
import {getActivityPrice} from "./activityController.js"

// Booking an activity
export const createBooking = async (req, res) => {
    const { activityId } = req.body;
    const  touristId  = req.user.userId;
    console.log(activityId, touristId);

    if (!touristId || !activityId) {
        return res.status(400).json({ message: "Tourist ID and Activity ID are required." });
    }

    try {
        // Find the activity and check if it exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        // Check if booking is open for this activity
        if (!activity.isBookingOpen) {
            return res.status(400).json({ message: "Booking is not open for this activity." });
        }

        // Create a new booking
        const newBooking = new BookingActivity({
            touristId,
            activityId,
            bookingDate: new Date(),
            status: "booked" // Set initial status to "booked"
        });

        await newBooking.save();
        const activityPrice = await getActivityPrice(activityId);
        if(activityPrice){
            const {points, current} = await updatePoints(touristId,activityPrice);
            return res.status(201).json({ message: `Activity booked successfully. You gained ${points} points and currently have ${current} loyality points`, booking: newBooking });
        }else
        return res.status(400).json({ message: "Error reading the activity price."});

    } catch (error) {
        console.error("Error booking activity:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const getAllActivityBookings = async (req, res) => {
    try {
        const touristId = req.user.userId;
        const allBookings = await BookingActivity.find({ touristId: touristId })
            .populate('activityId');
        res.status(201).json({ allBookings, message: "Successfully fetched all your activity bookings!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const cancelBooking = async (req, res) => {
    try {
        // const touristId = req.user.userId;
        const bookingId = req.params.id;
        const bookingToCancel = await BookingActivity.findById(bookingId)
            .populate('activityId');

        const currentDate = new Date();
        const slotDateObj = new Date(bookingToCancel.activityId.date);

        const hoursDifference = (slotDateObj - currentDate) / (1000 * 60 * 60);

        if (hoursDifference < 48) {
            return res.status(400).json({
                message: "Cancellations are only allowed 48 hours before the activity date",
            });
        }

        bookingToCancel.status = 'cancelled';
        await bookingToCancel.save();
        res.status(201).json({ bookingToCancel, message: "Successfully cancelled your booking!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const bookActivity = async (req, res) => {
    const { touristId, activityId } = req.body;

    if (!touristId || !activityId) {
        return res.status(400).json({ message: "Tourist ID and Activity ID are required." });
    }

    try {
        // Find the activity and check if it exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        // Check if booking is open for this activity
        if (!activity.isBookingOpen) {
            return res.status(400).json({ message: "Booking is not open for this activity." });
        }

        // Create a new booking
        const newBooking = new BookingActivity({
            touristId,
            activityId,
            bookingDate: new Date(),
            status: "booked" // Set initial status to "booked"
        });

        await newBooking.save();

        return res.status(201).json({ message: "Activity booked successfully.", booking: newBooking });
    } catch (error) {
        console.error("Error booking activity:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getCompletedActivities = async (req, res) => {
    const { touristId } = req.params;

    if (!touristId) {
        return res.status(400).json({ message: "Tourist ID is required." });
    }

    try {
        // Retrieve bookings for the tourist and populate activity details
        const bookings = await BookingActivity.find({ touristId }).populate("activityId");

        const completedActivities = [];
        for (const booking of bookings) {
            const activityDate = booking.activityId?.date;

            // Check if the activity date is in the past and status is "booked"
            if (activityDate && new Date(activityDate) < new Date() && booking.status === "booked") {
                booking.status = "completed"; // Update status to "completed"
                await booking.save(); // Save the updated booking
            }

            // Only add bookings with status "completed" to the response
            if (booking.status === "completed") {
                completedActivities.push(booking);
            }
        }

        console.log("Completed Activities:", completedActivities);
        return res.status(200).json(completedActivities);
    } catch (error) {
        console.error("Error fetching completed activities:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const addReview = async (req, res) => {
    const { touristId, activityId, rating, comment } = req.body;

    if (!touristId || !activityId || !rating) {
        return res.status(400).json({ message: "Tourist ID, Activity ID, and rating are required." });
    }

    try {
        const booking = await BookingActivity.findOne({ touristId, activityId, status: 'completed' });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found or activity is not completed." });
        }

        booking.rating = rating;
        booking.comment = comment;
        await booking.save();

        return res.status(200).json({ message: "Review added successfully.", review: { rating, comment } });
    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const addRatingAndComment = async (req, res) => {
    const { bookingId, rating, comment } = req.body;

    try {
        // Update the booking with rating and comment
        const booking = await BookingActivity.findByIdAndUpdate(
            bookingId,
            { rating, comment },
            { new: true }
        ).populate('activityId');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        // Update average rating and review count in Activity
        const activity = booking.activityId;
        activity.reviewCount += 1;
        activity.averageRating = ((activity.averageRating * (activity.reviewCount - 1)) + rating) / activity.reviewCount;
        await activity.save();

        return res.status(200).json({ message: "Rating and comment added successfully." });
    } catch (error) {
        console.error("Error adding rating and comment:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};