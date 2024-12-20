import { Clock, Globe, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "../stars";
import {createItineraryBooking} from "../../api/apiService";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner";


const token = localStorage.getItem('token');

export function Itineraries({ itineraries, currency, exchangeRate }) {
  return (
    <div className="space-y-4">
      {itineraries.length === 0 ? (
        <div>No itineraries found.</div>
      ) : (
        itineraries.map((itinerary, index) => (
          <Card key={index}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3">
                <img
                  src={itinerary.image}
                  alt={itinerary.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 p-4">
                <h3 className="text-xl font-semibold mb-2">{itinerary.name}</h3>
                <div className="flex items-center mb-2">
                  <Stars rating={itinerary.averageRating} />
                  <span className="ml-2 text-sm text-gray-600">
                    {itinerary.totalRatings} reviews
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {itinerary.description}
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {itinerary.availableSlots[0]?.date.slice(0, 10)}
                </div>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <Globe className="w-4 h-4 mr-1" />
                  <Badge variant="secondary">{itinerary.tourLanguage}</Badge>
                </div>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <Tag className="w-4 h-4 mr-1" />
                  {itinerary.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag?.name ?? tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xl font-bold">
                  {Array.isArray(itinerary.price) && itinerary.price.length > 0
                    ? itinerary.price
                        .map(
                          ({ value }) =>
                            `${(value * exchangeRate).formatCurrency(currency)}`
                        )
                        .join(" - ")
                    : `${(itinerary.price * exchangeRate).formatCurrency(currency)}`}
                </div>
                <div className="flex justify-end items-center">
                  {/* <Button onClick={modalOpen(true)}>
                    Book Activity!
                  </Button> */}
                  <ChooseDate itinerary ={itinerary}/>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}


const ChooseDate = ({itinerary}) => {
  let remainingSpots;
  const [selectedDate, setSelectedDate] = useState();
  const handleSubmit = async () => {
    e.preventDefault();
      console.log(token);
      const response = await createItineraryBooking(itinerary._id, 
        itinerary.tourGuideId, 
        selectedDate, 
        itinerary.price,
        "Card",
        token);
      console.log(response.message);
      toast(response.message);

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Book Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Date</DialogTitle>
        </DialogHeader>
        <RadioGroup onValueChange={setSelectedDate(e.target.value)} defaultValue="comfortable">
          {itinerary.availableSlots.map((slot,index) => {
            remainingSpots = slot.maxNumberOfBookings - slot.numberOfBookings;
            if (remainingSpots == 0) {
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={slot.date} id= {index} />
                <Label htmlFor={index}>{slot.date}</Label>
              </div>;
            }
          })}
        </RadioGroup>
        <DialogFooter>
          <Button type="submit" onSubmit={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
