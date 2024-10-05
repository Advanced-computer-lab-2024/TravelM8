import Activity from "../../models/activityModel.js";

function createFilterStage(budget, startDate, endDate, upcoming, category) {
    const filters = {};

    const now = new Date();

    // if upcoming, choose start date as maximum between current date and startDate (if provided)
    // otherwise if startDate only, then filter by startDate

    const start = upcoming ? new Date(Math.max(now, new Date(startDate ?? 0))) :
        startDate ? new Date(startDate) : null;

    if (start) filters.date = { $gte: start }; // Filter by startDate or current date for upcoming

    if (endDate) filters.date = { ...filters.date, $lte: new Date(endDate) };

    if (budget) {
        const [minBudget, maxBudget] = budget.split('-').map(Number);

        filters.$or = [
            {
                $and: [
                    { price: { $type: "number" } },
                    { price: { $gte: minBudget, $lte: maxBudget } }
                ]
            },
            {
                $and: [
                    { price: { $type: "array" } },
                    {
                        $expr: {
                            $and: [
                                { $gte: [{ $arrayElemAt: ["$price", 0] }, minBudget] },
                                { $lte: [{ $arrayElemAt: ["$price", 0] }, maxBudget] }
                            ]
                        }
                    }
                ]
            }
        ];
    }

    if (category) {
        filters.category = category;
    }

    return filters;
}

function createSortStage(sortBy, order) {
    const orderValue = order === "desc" ? -1 : 1; // Determine sort order
    return sortBy ? { [sortBy]: orderValue } : {}; // Return sort stage as an object
}

// only entityType is a required parameter
function createRatingStage(entityType, includeRatings, minRating) {
    return [
        {
            $lookup: {
                from: "ratings",
                localField: "_id",  // (in entity) Entity's ID
                foreignField: "entityId",  // (in rating) Rating's entityId
                as: "ratings"  // Add the ratings to each activity as an array
            }
        },
        {
            $match: { "ratings.entityType": entityType } // Only keep ratings for activities
        },
        {
            $addFields: {
                averageRating: { $avg: "$ratings.rating" },  // Calculate average rating
                totalRatings: { $size: "$ratings" }  // Count number of ratings
            }
        },
        ...(minRating ? [{ $match: { averageRating: { $gte: Number(minRating) } } }] : []),
        ...(!includeRatings ? [{ $unset: "ratings" }] : [])
    ];
}

export async function getActivities({ includeRatings, budget, date, upcoming, category, minRating, sortBy, order }) {
    const filters = createFilterStage(budget, date, upcoming, category);
    const sortStage = createSortStage(sortBy, order);
    const addRatingStage = createRatingStage('Activity', includeRatings, minRating);

    const aggregationPipeline = [
        { $match: filters },
        ...addRatingStage,
        { $sort: sortStage }
    ];

    // Execute the aggregation pipeline
    const activities = await Activity.aggregate(aggregationPipeline);
    return activities;
}