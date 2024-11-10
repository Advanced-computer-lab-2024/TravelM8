import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate,useParams } from 'react-router-dom';
import { Bell, ChevronDown, Layout, List, Map, Plus, Settings, Tag, User, Edit, Trash2, Eye  } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";  
import * as services from "@/pages/TourismGovernor/services.js";
import Logout from "@/hooks/logOut.jsx";


const TourismGovernorDashboard = () => {
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [open, setOpen] = useState(false)
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { id } = useParams();
    const [type, setType] = useState("");
    const [historicalPeriod, setHistoricalPeriod] = useState("");
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [tags, setTags] = useState([]); // State to hold the tags
    const [error, setError] = useState(""); // State to hold error message
    const [message, setMessage] = useState("")
    const [selectedTags, setSelectedTags] = useState([]);
    const [newLocation, setNewLocation] = useState({
        name: '',
        description: '',
        location: { lat: '', lng: '' },
        image: '',
        openingHours: { open: '', close: '' },
        price: [
            { type: 'Regular', price: '' },
            { type: 'Student', price: '' },
            { type: 'Foreigner', price: '' },
        ],
        tags: "",
     });
     const [isEditing, setIsEditing] = useState({
        image: false,
        name: false,
        description: false,
        openingHours: false,
        priceRegular: false,
        priceStudent: false,
        priceForeigner: false,
        locationLng:false,
        locationLat:false,
    });

    const handleDialogClose = () => {
      setSelectedPlace(null);
        setIsEditing({
            image: false,
            name: false,
            description: false,
            openingHours: false,
            priceRegular: false,
            priceStudent: false,
            priceForeigner: false,
            locationLng:false,
            locationLat:false

        });
      };
    const handleEditClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    };
    const [editableLocation, setEditableLocation] = useState({
        name: '',
        description: '',
        location: { lat: '', lng: '' },
        image: '',
        openingHours: { open: '', close: '' },
        price: [
            { type: 'Regular', price: '' },
            { type: 'Student', price: '' },
            { type: 'Foreigner', price: '' },
        ],
        tags: '',
     });;

     useEffect(() => {
      const fetchTags = async () => {
        try {
          const fetchedTags = await services.getTags(); 
          setTags(fetchedTags); 
        } catch (error) {
          setError("Error fetching place tags."); 
        }
      };
      fetchTags();
    }, []);


    const handleInputChange = (e, field) => {
    setEditableLocation({
        ...editableLocation,
        [field]: e.target.value,
    });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newPlace = { ...newLocation };
        const filteredLocation = Object.entries(editableLocation).reduce((acc, [key, value]) => {
            if (value) {
                if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        const filteredArray = value.filter(item => item.price);
                        if (filteredArray.length > 0) {
                            acc[key] = filteredArray; 
                        }
                    } else {
                        const nonEmptyObject = Object.fromEntries(
                            Object.entries(value).filter(([_, v]) => v) 
                        );
                        if (Object.keys(nonEmptyObject).length > 0) {
                            acc[key] = nonEmptyObject;
                        }
                    }
                } else {
                    acc[key] = value; // Add non-empty primitive value to the result
                }
            }
            return acc;
        }, {});
        console.log(filteredLocation);
//        setEditableLocation(filteredLocation);
        const updatedPlace = {...filteredLocation};
        const missingFields = [];
        Object.entries(newLocation).forEach(([key, value]) => {
        if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue === '') {
                missingFields.push(key);
            }
            });
        } else if (value === '') {
            missingFields.push(key);
        }
    });
        try {
          if (selectedPlace) {
            services.updatePlace(token,selectedPlace._id,updatedPlace);
            console.log(updatedPlace);
            alert('Place updated successfully!');
            window.location.reload();
          } else {
            if (missingFields.length > 0) {
                alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
                return;
            }
            services.postPlace(token,newPlace);
            alert("Place Added Succesfully");
            console.log("form submitted");
             window.location.reload();
          }
          navigate('/TourismGovernorDashboard');
        }catch (error) {
            console.error('Error submitting form:', id);
            console.error('Error submitting form:', error);
            alert("Failed to add place");
        }
        setOpen(false)
      };
      const handleTagChange = (value) => {
        console.log("Selected Tag:", value); // Debugging line
        setNewLocation(prevLocation => ({
            ...prevLocation,
            tags: value, // Ensure this matches the field you're using
        }));
    };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchHistoricalPlaces();
  }, [navigate, token]);

  async function fetchHistoricalPlaces() {
    try {
      const response = await services.getMyPlaces(token);
      console.log(response);
      setHistoricalPlaces(Array.isArray(response.Places) ? response.Places : []);
    } catch (error) {
      console.error('Error fetching historical places:', error);
    }
  };

  const deleteHistoricalPlace = async (id) => {
    try {
      services.deleteHistoricalPlaceApi(id);
      setHistoricalPlaces(historicalPlaces.filter(place => place._id !== id));
    } catch (error) {
      console.error('Error deleting historical place:', error);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!type || !historicalPeriod) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await services.createPlaceTag({ type, historicalPeriod })
      setMessage(response.message || "Tag created successfully");
      setTags((prevTags) => [...prevTags, { type, historicalPeriod }]);
      setType("");
      setHistoricalPeriod("");
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Error occurred");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-white drop-shadow-xl flex flex-col justify-between">
        <div>
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800">TravelM8</h2>
          </div>
          <nav className="mt-6">
            <button className="flex items-center w-full px-4 py-2 text-gray-700 bg-gray-100">
              <Layout className="mr-3" />
              Dashboard
            </button>
            <button className="flex items-center w-full px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
              <Map className="mr-3" />
              Locations
            </button>
            <button className="flex items-center w-full px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
              <Tag className="mr-3" />
              Tags
            </button>
            <button className="flex items-center w-full px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
              <List className="mr-3" />
              Itineraries
            </button>
            <button className="flex items-center w-full px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100">
              <Settings className="mr-3" />
              Settings
            </button>
          </nav>
        </div>
        <div className="p-4">
          <Logout />
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Tourism Governor Dashboard</h1>
            <div className="flex items-center">
              <Button variant="outline" size="icon" className="mr-4">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center">
                <img
                  className="w-8 h-8 rounded-full mr-2"
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                />
                <span className="text-gray-700 mr-2">John Doe</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{historicalPlaces.length}</div>
                <p className="text-xs text-muted-foreground">Across various historical periods</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tags.length}</div>
                <p className="text-xs text-muted-foreground">For categorizing locations</p>
              </CardContent>
            </Card>
          </div>

       <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Locations</CardTitle>
          <CardDescription>Add, edit, or remove historical locations and museums</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All Locations</TabsTrigger>
                  <TabsTrigger value="museums">Museums</TabsTrigger>
                  <TabsTrigger value="historical">Historical Sites</TabsTrigger>
                </TabsList>
                <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Add New Location
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[700px] !max-w-[800px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Location</DialogTitle>
                          <DialogDescription>
                            Enter the details of the new historical location or museum.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        {/* Name and Image URL in two columns */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                <Label htmlFor="name" className="text-left">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newLocation.name}
                                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                />
                                </div>
                                <div className="flex flex-col gap-2">
                                <Label htmlFor="imageURL" className="text-left">
                                    Image URL
                                </Label>
                                <Input
                                    required
                                    id="imageURL"
                                    value={newLocation.image}
                                    onChange={(e) => setNewLocation({ ...newLocation, image: e.target.value })}
                                />
                                </div>
                            </div>

                            {/* Description (spanning the full width) */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description" className="text-left">
                                Description
                                </Label>
                                <Textarea
                                required
                                id="description"
                                value={newLocation.description}
                                onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                                />
                            </div>

                            {/* Location Latitude and Longitude in two columns */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                <Label htmlFor="locationLat" className="text-left">
                                    Location Latitude
                                </Label>
                                <Input
                                    required
                                    id="locationLat"
                                    type="number"
                                    value={newLocation.location.lat}
                                    onChange={(e) => setNewLocation({
                                    ...newLocation,
                                    location: { ...newLocation.location, lat: e.target.value }
                                    })}
                                />
                                </div>
                                <div className="flex flex-col gap-2">
                                <Label htmlFor="locationLng" className="text-left">
                                    Location Longitude
                                </Label>
                                <Input
                                    id="locationLng"
                                    type="number"
                                    required
                                    value={newLocation.location.lng}
                                    onChange={(e) => setNewLocation({
                                    ...newLocation,
                                    location: { ...newLocation.location, lng: e.target.value }
                                    })}
                                />
                                </div>
                            </div>

                            {/* Type and Period in two columns */}
                            <div className="grid grid-cols-1 gap-4"> 
                                <div className="flex flex-col gap-2">
                                <Label htmlFor="tag" className="text-left">
                                    Tag
                                </Label>
                                <Select onValueChange={handleTagChange} value={newLocation.tags}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select a tag" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {tags.map((tag) => (
                                        <SelectItem key={tag._id} value={tag._id}>
                                            {tag.type} - {tag.historicalPeriod}
                                        </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                                </div>
                             </div>

                            {/* Opening Time and Closing Time in two columns */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                <Label htmlFor="openingHoursOpen" className="text-left">
                                    Opening Time
                                </Label>
                                <Input
                                    required
                                    id="openingHoursOpen"
                                    value={newLocation.openingHours.open}
                                    onChange={(e) => setNewLocation({
                                    ...newLocation,
                                    openingHours: { ...newLocation.openingHours, open: e.target.value }
                                    })}
                                />
                                </div>
                                <div className="flex flex-col gap-2">
                                <Label htmlFor="openingHoursClose" className="text-left">
                                    Closing Time
                                </Label>
                                <Input
                                    id="openingHoursClose"
                                    required
                                    value={newLocation.openingHours.close}
                                    onChange={(e) => setNewLocation({
                                    ...newLocation,
                                    openingHours: { ...newLocation.openingHours, close: e.target.value }
                                    })}
                                />
                                </div>
                            </div>

                            {/* Ticket Price in one row */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="ticketPriceForNatives" className="text-left">
                                    Ticket Price For Natives
                                </Label>
                                  <Input
                                    id="ticketPriceForNatives"
                                    required
                                    type="number"
                                    step="0.01" 
                                    value={newLocation.price[0].price}
                                    onChange={(e) => {
                                        const updatedPrice = parseFloat(e.target.value); // Parse the input value to a number
                                        setNewLocation((prevLocation) => ({
                                            ...prevLocation,
                                            price: prevLocation.price.map((p) => 
                                                p.type === 'Regular' ? { ...p, price: updatedPrice } : p // Update only the Native price
                                            ),
                                        }));
                                    }}
                                />
                            </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="ticketPriceForStudents" className="text-left">
                                        Ticket Price For Students
                                    </Label>
                                    <Input
                                        id="ticketPriceForStudents"
                                        required
                                        type="number"
                                        step="0.01" 
                                        value={newLocation.price[1].price}
                                        onChange={(e) => {
                                            const updatedPrice = parseFloat(e.target.value);
                                            setNewLocation((prevLocation) => ({
                                                ...prevLocation,
                                                price: prevLocation.price.map((p) => 
                                                    p.type === 'Student' ? { ...p, price: updatedPrice } : p
                                                ),
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="ticketPriceForForeigners" className="text-left">
                                        Ticket Price For Foreigners
                                    </Label>
                                    <Input
                                        id="ticketPriceForForeigners"
                                        required
                                        type="number"
                                        step="0.01" 
                                        value={newLocation.price[2].price}
                                        onChange={(e) => {
                                            const updatedPrice = parseFloat(e.target.value);
                                            setNewLocation((prevLocation) => ({
                                                ...prevLocation,
                                                price: prevLocation.price.map((p) => 
                                                    p.type === 'Foreigner' ? { ...p, price: updatedPrice } : p
                                                ),
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                       <DialogClose asChild>          
                          <Button type="submit" onClick={handleSubmit} className="mt-4" >
                            Add Location
                           </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
              </div>
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {historicalPlaces.map((location) => (
                    <Card key={location.id}>
                      <CardHeader>
                        <img src={location.image} alt={location.name} className="w-full h-48 object-cover rounded-t-lg" />
                        <CardTitle >{location.name}</CardTitle>
                        <CardDescription >{location.description}</CardDescription>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                            <Tag className="w-4 h-4 mr-1" /> {location.tags?.type}
                          </span>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-end space-x-2">
                        <Dialog onOpenChange={(open) => !open && handleDialogClose()}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick = {()=>setSelectedPlace(location)}>
                                <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader> 
                                    <div className="flex items-center justify-center"> 
                                    {isEditing.name ? (
                                            <Input
                                            id="updatedName"
                                            className="text-center"
                                            value={editableLocation.name}
                                            onChange={(e) => handleInputChange(e, 'name')}
                                            />
                                        ) : (
                                            <DialogTitle className="text-center">
                                            {location.name}
                                            </DialogTitle>
                                        )}
                                        <Edit
                                            className="h-4 w-4 ml-2 cursor-pointer"
                                            onClick={() => handleEditClick('name')}
                                        />
                                    </div>  
                                    <div className="flex items-center justify-center">  
                                         {isEditing.description ? (
                                        <Input
                                        id="updatedDescription"
                                        className="text-center"
                                        value={editableLocation.description}
                                        onChange={(e) => handleInputChange(e, 'description')}
                                        />
                                    ) : (
                                        <DialogDescription className="text-center">
                                        {location.description}
                                        </DialogDescription>
                                    )}
                                    <Edit
                                        className="h-4 w-4 ml-2 cursor-pointer"
                                        onClick={() => handleEditClick('description')}
                                    />
                                    </div> 
                                    {isEditing.image ? (
                                            <Input
                                            id="updatedImage"
                                            className="text-center"
                                            value={editableLocation.image}
                                            onChange={(e) => handleInputChange(e, 'image')}
                                            />
                                        ) : (
                                            <img src={location.image} alt={location.name} className="w-full h-48 object-cover rounded-t-lg" /> 
                                        )}
                                        <Edit
                                            className="h-4 w-4 mt-2 cursor-pointe"
                                            onClick={() => handleEditClick('image')}
                                        />    
                                </DialogHeader>
                                <div className="flex items-center">
                                <p className="text-sm">
                                    <strong>Opening Hours:</strong>{' '}
                                    {isEditing.openingHours ? (
                                    <>
                                        <Input
                                        id ="openHoursUpd"
                                        placeholder="Opening Time"
                                        value={editableLocation.openingHours.open}
                                        onChange={(e) =>
                                            setEditableLocation({
                                            ...editableLocation,
                                            openingHours: {
                                                ...editableLocation.openingHours,
                                                open: e.target.value,
                                            },
                                            })
                                        }
                                        />{' '}
                                        -{' '}
                                        <Input
                                        id ="closeHoursUpd"
                                        placeholder="Closing Time"
                                        value={editableLocation.openingHours.close}
                                        onChange={(e) =>
                                            setEditableLocation({
                                            ...editableLocation,
                                            openingHours: {
                                                ...editableLocation.openingHours,
                                                close: e.target.value,
                                            },
                                            })
                                        }
                                        />
                                    </>
                                    ) : (
                                    `${location.openingHours.open} - ${location.openingHours.close}`
                                    )}
                                </p>
                                <Edit
                                    className="h-4 w-4 ml-2 cursor-pointer" // Smaller size, left margin for spacing
                                    onClick={() => handleEditClick('openingHours')}
                                />
                                </div>
                                <div className="flex items-center">
                                <p className="text-sm">
                                    <strong>Location Latitude:</strong>
                                    {isEditing.locationLat ? (
                                        <Input
                                        id ="updatedLocLat"
                                        type="number"
                                        placeholder="Location Latitude"
                                        value={editableLocation.location.lat}
                                        onChange={(e) =>
                                            setEditableLocation({
                                            ...editableLocation,
                                            location: {
                                                ...editableLocation.location,
                                                lat: e.target.value,
                                            },
                                            })
                                        }
                                        />
                                    ) : (
                                    location.location.lat
                                    )}
                                </p>
                                <Edit
                                    className="h-4 w-4 ml-2 cursor-pointer" // Smaller size, left margin for spacing
                                    onClick={() => handleEditClick("locationLat")}
                                />
                                </div>

                                <div className="flex items-center">
                                <p className="text-sm">
                                    <strong>Location Longitude: </strong>
                                    {isEditing.locationLat ? (
                                        <Input
                                        id ="updatedLocLng"
                                        type="number"
                                        placeholder="Location Longitude"
                                        value={editableLocation.location.lng}
                                        onChange={(e) =>
                                            setEditableLocation({
                                            ...editableLocation,
                                            location: {
                                                ...editableLocation.location,
                                                lng: e.target.value,
                                            },
                                            })
                                        }
                                        />
                                    ) : (
                                    location.location.lng
                                    )}
                                </p>
                                <Edit
                                    className="h-4 w-4 ml-2 cursor-pointer" // Smaller size, left margin for spacing
                                    onClick={() => handleEditClick("locationLat")}
                                />
                                </div>
                                <div className="flex items-center">
                                <p className="text-sm">
                                    <strong>Ticket Price For Regular: </strong>
                                    {isEditing.priceRegular ? (
                                        <Input
                                        id ="priceRegular"
                                        type="number"
                                        placeholder="Regular Price"
                                        value={editableLocation.price[0].price}
                                        onChange={(e) => {
                                            const updatedPrice = parseFloat(e.target.value); // Parse the input value to a number
                                            setEditableLocation((prevLocation) => ({
                                                ...prevLocation,
                                                price: prevLocation.price.map((p) => 
                                                    p.type === 'Regular' ? { ...p, price: updatedPrice } : p // Update only the Native price
                                                ),
                                            }));
                                        }}
                                        />
                                    ) : (
                                          location.price[0].price
                                    )}
                                </p>
                                <Edit
                                    className="h-4 w-4 ml-2 cursor-pointer" // Smaller size, left margin for spacing
                                    onClick={() => handleEditClick("priceRegular")}
                                />
                                </div>

                                <div className="flex items-center">
                                <p className="text-sm">
                                    <strong>Ticket Price For Students: </strong>
                                    {isEditing.priceRegular ? (
                                        <Input
                                        id ="priceStudent"
                                        type="number"
                                        placeholder="Student Price"
                                        value={editableLocation.price[1].price}
                                        onChange={(e) => {
                                            const updatedPrice = parseFloat(e.target.value); // Parse the input value to a number
                                            setEditableLocation((prevLocation) => ({
                                                ...prevLocation,
                                                price: prevLocation.price.map((p) => 
                                                    p.type === 'Student' ? { ...p, price: updatedPrice } : p // Update only the Native price
                                                ),
                                            }));
                                        }}
                                        />
                                    ) : (
                                    location.price[1].price
                                    )}
                                </p>
                                <Edit
                                    className="h-4 w-4 ml-2 cursor-pointer" // Smaller size, left margin for spacing
                                    onClick={() => handleEditClick("priceRegular")}
                                />
                                </div>        
                                <div className="flex items-center">
                                <p className="text-sm">
                                    <strong>Ticket Price For Foreigners: </strong>
                                    {isEditing.priceRegular ? (
                                        <Input
                                        id ="priceForeigner"
                                        type="number"
                                        placeholder="Foreigner Price"
                                        value={editableLocation.price[2].price}
                                        onChange={(e) => {
                                            const updatedPrice = parseFloat(e.target.value); // Parse the input value to a number
                                            setEditableLocation((prevLocation) => ({
                                                ...prevLocation,
                                                price: prevLocation.price.map((p) => 
                                                    p.type === 'Foreigner' ? { ...p, price: updatedPrice } : p // Update only the Native price
                                                ),
                                            }));
                                        }}
                                        />
                                    ) : (
                                    location.price[2].price
                                    )}
                                </p>
                                <Edit
                                    className="h-4 w-4 ml-2 cursor-pointer" // Smaller size, left margin for spacing
                                    onClick={() => handleEditClick("priceRegular")}
                                />
                                </div>    
                                {/* <DialogFooter > */}
                                    <DialogClose asChild>
                                        <Button type="submit" className="mt-4" onClick={handleSubmit} >
                                            Save Changes
                                        </Button>
                                    </DialogClose>
                                {/* </DialogFooter> */}
                            </DialogContent>
                        </Dialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete this  historical place?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        created place and remove it from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => deleteHistoricalPlace(location._id)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Tags</CardTitle>
              <CardDescription>Create and manage tags for categorizing locations</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex space-x-2 mb-4">
            <Select value ={type} onValueChange={(value) => setType(value)}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Museum">Museum</SelectItem>
                        <SelectItem value="Palace">Palace</SelectItem>
                        <SelectItem value="Monument">Monument</SelectItem>
                        <SelectItem value="Religious Site">Religious Site</SelectItem>
                  </SelectContent>
            </Select>
              {/* <Input
                placeholder="Type"
                className="w-1/2"
                value={type}
                onChange={(e) => setType(e.target.value)}
              /> */}
              <Input
                value={historicalPeriod}
                onChange={(e) => setHistoricalPeriod(e.target.value)}
                placeholder="Historical Period"
                className="w-1/2" // Half width
              />
              <Button onClick={handleAddTag}>Add Tag</Button>
            </div>
              <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                  <span className="font-semibold">{tag.type}</span>
                  <span>-</span>
                  <span className="font-semibold">{tag.historicalPeriod}</span>
                </div>
              ))}

              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TourismGovernorDashboard;