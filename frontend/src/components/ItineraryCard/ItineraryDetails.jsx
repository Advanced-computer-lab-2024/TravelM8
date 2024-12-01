import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Clock, Globe, Tag, Calendar, Users } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { flagItinerary } from "../../pages/admin/services/AdminItineraryService";
import { Timeline } from './Timeline';
import { ChooseDate } from './ChooseDate';

export default function ItineraryDetails({ itinerary, isAdmin, isTourist, isTourGuide, onRefresh }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/itineraries/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
      }
      await onRefresh();
      alert("Itinerary Deleted successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleActivationToggle = async (id, isBookingOpen) => {
    const state = isBookingOpen ? "Deactivated" : "Activated";
    try {
      const response = await fetch(
        `http://localhost:5001/api/itineraries/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isBookingOpen: !isBookingOpen }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
      }
      onRefresh();
      alert(`Itinerary ${state} successfully`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFlagItinerary = async (itineraryId) => {
    try {
      await flagItinerary(itineraryId);
      alert("Itinerary flagged successfully");
    } catch (error) {
      console.error("Error flagging itinerary:", error);
      alert("Failed to flag itinerary");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{itinerary.name}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="w-1/3">
            <div className="aspect-square overflow-hidden rounded-lg mb-2">
              <img
                src={itinerary.images[selectedImage] || "/placeholder.svg?height=300&width=300"}
                alt={itinerary.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* <div className="grid grid-cols-3 gap-2">
              {itinerary.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square overflow-hidden rounded-md ${index === selectedImage ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg?height=100&width=100"}
                    alt={`${itinerary.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div> */}
          </div>
          <div className="w-2/3 space-y-4">
          <div className="flex flex-wrap gap-2">
              <Globe className="w-4 h-4" />
              <Badge variant="secondary">{itinerary.tourLanguage}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
            <Tag className="w-4 h-4" />
            {itinerary.tags.map((tag, tagIndex) => (
                <Badge key={tagIndex}
                className="space-x-12" 
                variant="secondary">
                  {tag?.name ?? tag}
                </Badge>
              ))}
             </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <div className="grid gap-2">
                <div>
                  <div className="flex flex-wrap gap-2 ">
                  <p className="text-sm text-muted-foreground">{itinerary.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <Separator/>
            <div>
              <h3 className="text-lg font-semibold mb-2">Activities</h3>
              <div className="grid gap-2">
                <div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {itinerary.activities.map((activity, index) => (
                      <Badge key={index} variant="secondary">{activity}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Separator/>
            <div>
              <h3 className="text-lg font-semibold mb-2">Historical Sites</h3>
              <div className="grid gap-2">
                <div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {itinerary.historicalSites.map((site, index) => (
                      <Badge key={index} variant="secondary">{site}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Separator/>
            <div>
              <h3 className="text-lg font-semibold mb-2">Available Dates</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {itinerary.availableSlots.map((slot, index) => (
                  <div key={index} className="flex items-center p-2 border rounded-md">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{new Date(slot.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-8 bg-gray-100 justify-between w-full p-4 rounded-lg">
          {/* Price on the far left */}
          <span className="text-2xl font-bold">
            ${(itinerary.price * 1).toFixed(2)}
          </span>

          {/* Right-aligned components (Timeline and ChooseDate) */}
          <div className="flex items-center space-x-4">
            <Timeline selectedItinerary={itinerary} />
            {isTourist && <ChooseDate itinerary={itinerary} />}
          </div>
        </div>
        {(isTourGuide || isAdmin) && (
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
            {isTourGuide && (
              <>
                <Button
                  className={itinerary.isBookingOpen ? "bg-sky-800 hover:bg-sky-900" : "bg-sky-500 hover:bg-sky-600"}
                  onClick={() => handleActivationToggle(itinerary._id, itinerary.isBookingOpen)}
                >
                  {itinerary.isBookingOpen ? "Deactivate" : "Activate"} Itinerary
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(itinerary._id)}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/itineraryForm", { state: { itinerary: itinerary } })}
                >
                  Update
                </Button>
              </>
            )}
            {isAdmin && (
              <Button
                variant="destructive"
                onClick={() => handleFlagItinerary(itinerary._id)}
              >
                Flag as Inappropriate
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
