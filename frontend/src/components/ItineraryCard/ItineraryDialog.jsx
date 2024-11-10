// CreateItineraryDialog.js
import React from 'react';
import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from  "@/components/ui/dialog"; 
import { EditIcon, Plus, PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as services from "@/pages/TourGuide/api/apiService.js"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom";


const CreateItineraryDialog = ({itineraryData, isEditing, onRefresh}) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activities: [''],
    historicalSites: [''],
    tourLanguage: '',
    price: 0,
    timeline: [{ event: '', startTime: '', endTime: '' }],
    availableSlots: [{ date: '', numberOfBookings: 0 }],
    accessibility: '',
    pickUpLocation: '',
    dropOffLocation: '',
    images:[''],
    tags: [''],
  });
  useEffect(() => {
    if (isEditing && itineraryData) {
      setFormData({
        name: itineraryData.name || '',
        description: itineraryData.description || '',
        activities: itineraryData.activities || [''],
        historicalSites: itineraryData.historicalSites || [''],
        tourLanguage: itineraryData.tourLanguage || '',
        price: itineraryData.price || 0,
        timeline: itineraryData.timeline?.map(item => ({
          event: item.event || '',
          startTime: item.startTime || '',
          endTime: item.endTime || ''
        })) || [{ event: '', startTime: '', endTime: '' }],
        availableSlots: itineraryData.availableSlots?.map(slot => ({
          date: slot.date || '',
          numberOfBookings: slot.numberOfBookings || 0
        })) || [{ date: '', numberOfBookings: 0 }],
        accessibility: itineraryData.accessibility || '',
        pickUpLocation: itineraryData.pickUpLocation || '',
        dropOffLocation: itineraryData.dropOffLocation || '',
        images: itineraryData.images || [''],
        tags: itineraryData.tags || ['']
      });
      setSelectedActivities(itineraryData.activities);
      setSelectedPlaces(itineraryData.historicalSites);
      setSelectedTags(itineraryData.tags);
    }
  }, [isEditing, itineraryData]);
  const [itinerary, setItinerary] = useState(null);
  const token = localStorage.getItem('token');
  const [combinedArray, setCombinedArray] = useState([]);
  const [activities, setActivities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    if(itinerary)
      setFormData(itinerary);
  }, []); 


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  


  const handleTimelineChange = (index, key, value) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    }))
  }

  const handleAvailableSlotsChange = (index, key, value) => {
    setFormData(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    }))
  }
  const addField = (field) => {
    if (field === 'timeline') {
      setFormData({
        ...formData,
        [field]: [...formData[field], { event: '', startTime: '', endTime: '' }]
      });
    } else if (field === 'availableSlots') {
      setFormData({
        ...formData,
        [field]: [...formData[field], { date: '', numberOfBookings: 0 }]
      });
    } else {
      setFormData({ ...formData, [field]: [...formData[field], ''] });
    }
  };

  const removeField = (field, index) => {
    const updatedData = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedData });
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`; // Format: yyyy-MM-ddThh:mm
  };
  const handleSelectChange = (value, field) => {
    const isSelected = selectedActivities.includes(value);
    setFormData({ ...formData, [field]: isSelected ? selectedActivities.filter(item => item !== value) : [...selectedActivities, value] });
    setSelectedActivities((prevItems) => {
      if (isSelected) {
        return prevItems.filter((item) => item !== value);
      } else {
        return [...prevItems, value];
      }
    });
  };

  const handleSelectPlacesChange = (value, field) => {
    const isSelected = selectedPlaces.includes(value);
    setFormData({ ...formData, [field]: isSelected ? selectedPlaces.filter(item => item !== value) : [...selectedPlaces, value] });
    setSelectedPlaces((prevItems) => {
      if (isSelected) {
        return prevItems.filter((item) => item !== value);
      } else {
        return [...prevItems, value];
      }
    });
  };

  const handleSelectTagChange = (value, field) => {
    setSelectedTags((prevItems) => {
      const isSelected = prevItems.includes(value);
  
      // Update selectedTags state: add or remove the value
      const updatedTags = isSelected
        ? prevItems.filter((item) => item !== value)
        : [...prevItems, value];
  
      // Update formData with updated tags
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: updatedTags, // Update the formData with the new tags array
      }));
  
      return updatedTags; // Return the updated tags to update selectedTags state
    });
  };

  const handleRemoveActivityBadge = (activity) => {
    setSelectedActivities((prevItems) =>
      prevItems.filter((item) => item !== activity)
    );
    setFormData((prevData) => ({
      ...prevData,
      activities: prevData.activities.filter((item) => item !== activity),
    }));
  };
  
  const handleRemoveTagBadge = (tag) => {
    setSelectedTags((prevItems) =>
      prevItems.filter((item) => item !== tag)
    );
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((item) => item !== tag),
    }));
  };

  const handleRemovePlaceBadge = (place) => {
    setSelectedPlaces((prevItems) =>
      prevItems.filter((item) => item !== place)
    );
    setFormData((prevData) => ({
      ...prevData,
      historicalSites: prevData.tags.filter((item) => item !== place),
    }));
  };

  const formatDateForInput2 = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const fetchTags = async () => {
    const tags = await services.getTags();
    setCombinedArray(tags);
  }
  useEffect(() => {
  fetchTags();
  }, []);

  const fetchActivities = async () => {
        const activities = await services.getActivities();
        const allActivities = [...activities].map(activity => activity.title);
        setActivities(allActivities);
    }
    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchPlaces = async () => {
        const places = await services.getAllPlaces();
        const allPlaces = [...places].map(place => place.name);
        setPlaces(allPlaces);
    }
    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      let response;
      try {
        if(isEditing){
           const id = itineraryData._id;
            response = await fetch(`http://localhost:5001/api/itineraries/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          alert("place updated succesfully");
          setDialogOpen(false); 
        }
        else{
          try{
            response = await services.addItinerary(token, formData);
            alert('Itinerary Added Successfully');
            setDialogOpen(false); 
          }
          catch (error) {
            console.log('Error:', error.message);
          }
        }
      } catch (error) {
        console.log('Error:', error.message);
      }
      console.log(formData)
      onRefresh();
    }
    
    
    useEffect(() => {
      if (!token) {
        navigate("/login");
        return;
      }
      fetchItineraries();
    }, [navigate, token]);
    
    async function fetchItineraries() {
      try {
        const response = await services.getMyItineraries(token);
        setItineraries(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };       

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                <Button
                  className={isEditing ? "border border-gray-200 text-gray-600" : ""}
                  variant={isEditing ? "outline" : "primary"}
                >
                  {isEditing ? (
                    <>
                      <EditIcon className="mr-2 h-4 w-4" /> Edit Itinerary
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Create Itinerary
                    </>
                  )}
                </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Tour</DialogTitle>
                  </DialogHeader>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Activities</Label>
                      <Select
                          name="activities"
                          value={formData.activities}
                          onValueChange={(value) => handleSelectChange(value, "activities")}
                          multiple
                      >
                              <SelectTrigger>
                              <SelectValue placeholder="Select activities" />
                              </SelectTrigger>
                              <SelectContent>
                              {activities.map((activity) => (
                                  <SelectItem key={activity} value={activity}>
                                  {activity}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                <div style={{ marginTop: "10px" }} className="badge-container">
                  {selectedActivities.map((activity, index) => (
                    <Badge key={index} style={{ marginRight:"5px" }}  className="badge">
                      {activity}
                      <button
                        onClick={() => handleRemoveActivityBadge(activity)}
                        style={{
                          marginLeft: "5px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
                    </div>

                    <div>
                      <Label>Historical Sites</Label>
                      <Select
                          name="historicalSites"
                          value={formData.historicalSites}
                          onValueChange={(value) => handleSelectPlacesChange(value, "historicalSites")}
                          multiple>
                              <SelectTrigger>
                              <SelectValue placeholder="Select historical sites" />
                              </SelectTrigger>
                              <SelectContent>
                              {places.map((place) => (
                                  <SelectItem key={place} value={place}>
                                  {place}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                <div style={{ marginTop: "10px" }} className="badge-container">
                  {selectedPlaces.map((place, index) => (
                    <Badge key={index} style={{ marginRight:"5px" }}  className="badge">
                      {place}
                      <button
                        onClick={() => handleRemovePlaceBadge(place)}
                        style={{
                          marginLeft: "5px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
                    </div>

                    <div>
                      <Label htmlFor="tourLanguage">Tour Language</Label>
                      <Select name="tourLanguage" value={formData.tourLanguage} onValueChange={(value) => setFormData({ ...formData, tourLanguage: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          {/* Add more languages as needed */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Timeline</Label>
                      {formData.timeline.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Input
                            value={item.event}
                            onChange={(e) => handleTimelineChange(index, 'event', e.target.value)}
                            placeholder="Event"
                          />
                          <Input
                            type="datetime-local"
                            value={formatDateForInput(item.startTime)}
                            onChange={(e) => handleTimelineChange(index, 'startTime', e.target.value)}
                          />
                          <Input
                            type="datetime-local"
                            value={formatDateForInput(item.endTime)}
                            onChange={(e) => handleTimelineChange(index, 'endTime', e.target.value)}
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeField('timeline', index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addField('timeline')} className="mt-2">
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Timeline Event
                      </Button>
                    </div>
                    <div>
                      <Label>Available Slots</Label>
                      {formData.availableSlots.map((slot, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Input
                            type="date" 
                            value={formatDateForInput2(slot.date)}
                            onChange={(e) => handleAvailableSlotsChange(index, 'date', e.target.value)}
                          />
                          <Input
                            type="number"
                            value={slot.numberOfBookings}
                            onChange={(e) => handleAvailableSlotsChange(index, 'numberOfBookings', parseInt(e.target.value))}
                            placeholder="Number of Bookings"
                          />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeField('availableSlots', index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addField('availableSlots')} className="mt-2">
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Available Slot
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="accessibility">Accessibility</Label>
                      <Select name="accessibility" value={formData.accessibility} onValueChange={(value) => setFormData({ ...formData, accessibility: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select accessibility level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="challenging">Challenging</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pickUpLocation">Pick Up Location</Label>
                      <Input id="pickUpLocation" name="pickUpLocation" value={formData.pickUpLocation} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="dropOffLocation">Drop Off Location</Label>
                      <Input id="dropOffLocation" name="dropOffLocation" value={formData.dropOffLocation} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <Select
                          name="tags"
                          value={formData.tags}
                          onValueChange={(value) => handleSelectTagChange(value, "tags")}
                          multiple
                      >
                              <SelectTrigger>
                              <SelectValue placeholder="Select tags" />
                              </SelectTrigger>
                              <SelectContent>
                              {combinedArray.map((tag) => (
                                  <SelectItem key={tag._id} value={tag}>
                                  {tag.name}
                                  </SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                          <div style={{ marginTop: "10px" , marginRight:"50px" }} className="badge-container">
                              {selectedTags.map((tag, index) => (
                              <Badge key={index} style={{ marginRight:"5px" }} className="badge">
                                  {tag.name}
                                  <button
                                  onClick={() => handleRemoveTagBadge(tag)}
                                  style={{
                                      marginLeft: "5px",
                                      background: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                  }}
                                  >
                                  &times;
                                  </button>
                              </Badge>
                              ))}
                          </div>
                              </div>
                              <div>
                              <Label htmlFor="images">Images URL</Label>
                              <Input id="images" name="images" value={formData.images} onChange={handleInputChange} required />
                            </div>
                              <DialogFooter className="sm:justify-start">
                                 <Button  onClick={handleSubmit} className="w-full">Submit</Button>
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>

  );
};

export default CreateItineraryDialog;
