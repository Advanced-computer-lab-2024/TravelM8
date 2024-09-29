import activityModel from "../models/activityModel.js";

const createNewActivity = async(req, res) => {

        const {
            title,
            description,
            location,
            price,
            category,
            tags,
            discount,
            isBookingOpen,
            //advertiserId => add its logic from idk the session or sum
        } = req.body;

        const newActivity = {
            title,
            description,
            location,
            price,
            category,
            tags,
            discount,
            isBookingOpen,
            //advertiserId
        };
        
        const validateNewActivity = Object.values(newActivity).every(value => value !== undefined && value !== null);
        
        if (validateNewActivity){
            try{
                await activityModel.create(newActivity);
                res.status(201).json({message: "successfully created new activity", newActivity});
            }catch(error){
                res.status(400).json({message: "unsuccessful creation of activity"});
            }

        } else {
            res.status(400).json({message: "invalid parameters"});
        }
}

const getAllActivities = async(req, res) => {
    try{
        const activities = await activityModel.find({});
        res.status(200).json(activities);
    }catch(error){
        res.status(400).json({message: "unsuccessful retrieval of data"});
    }
}

const getActivityById = async(req,res) => {
    const activityId = req.params.id;
    if(mongoose.Types.ObjectId.isValid(activityId)){
        try{
            const activity = await activityModel.findById(activityId);
            if(activity.length == 0)
                res.status(204);
            else
                res.status(200).json({activity});
        }catch{
            res.status(400).json({message:"enter a valid id"});
        }
    }else{
        res.status(400).json({message:"enter a valid id"});
    }

}

const updateActivity = async(req, res) => {
    const activityId = req.params.id;
    
    if(mongoose.Types.ObjectId.isValid(activityId)){
        const updateFields = Object.fromEntries(
            Object.entries(req.body).filter(([key, value]) => value != null));
            try {
                await User.findByIdAndUpdate(
                    activityId,
                    { $set: updateFields },
                    { new: true, runValidators: true } // Return updated user and apply validation
                );
            }catch(error){
                res.status(400).json({message:"enter a valid data"});
            }        
    }else{
        res.status(400).json({message:"enter a valid id"});
    }
}

const getMyActivities = async(req, res) => {    
    let activities;
    if(user.type === "advertiser")
        activities = await activityModel.find({advertiserId: user.id});
    else if(user.type === "tour_guide"){
       ///activities = await activityModel.find({advertiserId: user.id});    
    }else{
        res.status(400).json({message:"enter a valid id"});
    }
}

const deleteActivity = async(req,res) => {
    const activityId = req.params.id;
    if(mongoose.Types.ObjectId.isValid(activityId)){
        try{
            const activityDeleted = await activityModel.findByIdAndDelete(activityId);
            res.status(200).json(activityDeleted);   
        } catch(error){
            res.status(400).json({message:"unseuccessful deletion of activity"});

        }
 
    }else{
        res.status(400).json({message:"enter a valid id"});
    }
}



export {createNewActivity, getAllActivities, getActivityById, updateActivity, getMyActivities, deleteActivity};