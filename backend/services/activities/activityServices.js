import Activity from "../../models/activityModel.js";

function createFilterStage({ budget, date, category }) {
    const filters = {
        date: { $gte: new Date(Math.max(Date.now(), new Date(date ?? 0))).toISOString() }
    };

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

function createSortStage({sortBy, order}) {
    const orderValue = order === "desc" ? -1 : 1; // Determine sort order
    return sortBy ? { [sortBy]: orderValue } : {}; // Return sort stage as an object
}

export async function getActivities({ budget, date, category, minRating, sortBy, order }) {
    const filters = createFilterStage({ budget, date, category });
    const sortStage = createSortStage({ sortBy, order });

    const aggregationPipeline = [
        { $match: filters },
        {
            $lookup: {
                from: "ratings",
                localField: "_id",  // Activity ID
                foreignField: "entityId",  // Rating's entityId
                as: "ratings"  // Add the ratings to each activity as an array
            }
        },
        {
            $addFields: {
                averageRating: { $avg: "$ratings.rating" },  // Calculate average rating
                totalRatings: { $size: "$ratings" }  // Count number of ratings
            }
        },
        ...(minRating ? [{ $match: { averageRating: { $gte: Number(minRating) } } }] : []),
        ...(sortBy ? [{ $sort: sortStage }] : [])
    ];

    // Execute the aggregation pipeline
    const activities = await Activity.aggregate(aggregationPipeline);
    return activities;
}