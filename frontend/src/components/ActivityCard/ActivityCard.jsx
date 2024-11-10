import React, { useState } from "react";
import { Clock, Globe, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stars } from "../Stars";
import { useNavigate } from "react-router-dom";

export default function ActivityCard({ activities, isTourist, isAdvertiser, isAdmin }) {

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/activities/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Success:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <Card key={activity._id}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 p-4">
                <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                <div className="flex items-center mb-2">
                  <Stars rating={activity.averageRating} />
                  <span className="ml-2 text-sm text-gray-600">
                    {activity.totalRatings} reviews
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {activity.date.slice(0, 10)}
                </div>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <Tag className="w-4 h-4 mr-1" />
                  {activity.tags?.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-semibold mr-2">Category:</span>
                  <Badge variant="outline">
                    {activity.categoryName}
                  </Badge>
                </div>
                <div className="text-xl font-bold">
                  {/* {Array.isArray(activity.price) && activity.price.length === 2
                    ? `${(activity.price[0] * exchangeRate).toFixed(2)} - ${(
                        activity.price[1] * exchangeRate
                      ).toFixed(2)} ${currency}`
                    : `${(activity.price * exchangeRate).toFixed(
                        2
                      )} ${currency}`} */}
                      {Array.isArray(activity.price) && activity.price.length === 2
                    ? activity.price[0]
                    : activity.price}
                </div>
                <div className="flex justify-end items-center">
                  {isTourist && <Button onClick={()=>handleBook}>Book Activity!</Button>}
                  {isAdvertiser && (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleDelete(activity._id)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() =>
                          navigate("/ActivityForm", {
                            state: { activity: activity },
                          })
                        }
                      >
                        Update
                      </Button>
                    </div>
                  )}
                  {isAdmin && <Button onClick={()=>handleFlag(activity._id)} variant="destructive">Flag Inappropriate</Button>}

                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
