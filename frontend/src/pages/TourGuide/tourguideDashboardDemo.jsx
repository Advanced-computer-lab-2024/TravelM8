import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronDown, DollarSign, Layout,Map, Trash2, Settings, Tag, User, Users} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";
import * as services from "@/pages/TourGuide/api/apiService.js"
import ItineraryDialog from "@/components/ItineraryCard/ItineraryDialog.jsx";
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
import Logout from "@/hooks/logOut.jsx";
import Header from "@/components/navbarDashboard.jsx";


const TourGuideDashboard = () => {
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

  const [itinerary, setItinerary] = useState(null);
  const token = localStorage.getItem('token');
  const [combinedArray, setCombinedArray] = useState([]);
  const [activities, setActivities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isBookingOpen, setIsBookingOpen] = useState(itinerary?.isBookingOpen);


  // Fetch itineraries from the server
  const fetchItinerariesData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchItineraries();
      setItineraries(data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshItineraries = () => {
    setItineraries((prevItineraries) => [...prevItineraries, formData]);
  };
  useEffect(() => {
    if(itinerary)
      setFormData(itinerary);
  }, []); 

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
        console.log(itineraries);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    }; 

  const [salesData] = useState([
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 7000 },
  ]);

  const [notifications] = useState([
    { id: 1, message: "Your 'City Night Tour' has been flagged as inappropriate. Please review." },
    { id: 2, message: "New booking for 'Historical City Tour' on June 15th." },
  ]);

  const toggleItineraryStatus = (id) => {
    setItineraries(itineraries.map(itinerary => 
      itinerary._id === id ? { ...itinerary, isBookingOpen: !itinerary.isBookingOpen } : itinerary
    ));
  };

  const deleteItinerary = async (id) => {
    try {
      await services.deleteItinerary(id);
    } catch (error) {
      alert(error.message);
      console.error('Error deleting Itinerary:', error);
    }
    fetchItineraries();
  };

  const toggleBookingStatus = async (id,itinerary) => {
    try {
      const newStatus = !itinerary?.isBookingOpen;
      setItineraries((prevItineraries) =>
        prevItineraries.map((item) =>
          item._id === id ? { ...item, isBookingOpen: newStatus } : item
        )
      );
      await services.updateItinerary(id, { isBookingOpen: newStatus });
      console.log('Booking status updated successfully');
    } catch (error) {
      console.error("Error updating booking status:", error);
      // setItineraries((prevItineraries) =>
      //   prevItineraries.map((item) =>
      //     item._id === id ? { ...item, isBookingOpen: !newStatus } : item
      //   )
      // );
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
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 w-full text-left">
              <Layout className="mr-3" />
              Dashboard
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <Map className="mr-3" />
              Itineraries
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <DollarSign className="mr-3" />
              Sales Reports
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <Users className="mr-3" />
              Tourist Reports
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
              <Bell className="mr-3" />
              Notifications
            </button>
            <button className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left">
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
        <Header editProfile="/tourGuideProfile"/>
        {/* Dashboard Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Itineraries</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{itineraries?.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Itineraries</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {itineraries?.filter(i => i.isBookingOpen).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,500</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="itineraries" className="space-y-4">
            <TabsList>
              <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
              <TabsTrigger value="sales">Sales Report</TabsTrigger>
              <TabsTrigger value="tourists">Tourist Report</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="itineraries" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Itineraries</h2>
                <ItineraryDialog onRefresh={fetchItineraries}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries?.map((itinerary) => (
                                <Card className="mb-6 flex flex-col h-full" key={itinerary._id}>
                <div className="flex-grow p-4">
                  <CardHeader>
                    <img src={itinerary.images?.[0]} alt={itinerary.name} className="w-full h-48 object-cover rounded-t-lg" />
                    <CardTitle>{itinerary.name}</CardTitle>
                    <CardDescription>{itinerary.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
                    <p><strong>Language:</strong> {itinerary.tourLanguage}</p>
                    <p><strong>Pickup Location:</strong> {itinerary.pickUpLocation}</p>
                    <p><strong>Dropoff Location:</strong> {itinerary.dropOffLocation}</p>
                    <p><strong>Price:</strong> {itinerary.price}</p>
                  </CardContent>
                </div>

                <CardFooter className="flex flex-col mt-auto space-y-2 p-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={itinerary.isBookingOpen}
                      onCheckedChange={() => toggleBookingStatus(itinerary._id,itinerary)}
                    />
                    <Label>{itinerary.isBookingOpen ? "Active" : "Inactive"}</Label>
                  </div>

                  <div className="flex justify-between space-x-2">
                    <ItineraryDialog
                      onRefresh={fetchItineraries}
                      itineraryData={itinerary} // The itinerary you want to edit
                      isEditing={true} // Pass `true` when editing
                      onClose={() => setDialogOpen(false)}
                    />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete this  itinerary?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        created itinerary and remove it from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => deleteItinerary(itinerary._id)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                  </div>
                </CardFooter>
                </Card>

                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="space-y-4">
              <h2 className="text-2xl font-bold">Sales Report</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                <CardTitle>Filter Sales Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Itinerary" />
                      </SelectTrigger>
                      <SelectContent>
                        {itineraries?.map((itinerary) => (
                          <SelectItem key={itinerary?._id} value={itinerary?._id?.toString()}>
                            {itinerary.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="date" className="w-[180px]" />
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        {/* Add more months */}
                      </SelectContent>
                    </Select>
                    <Button>Apply Filter</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tourists" className="space-y-4">
              <h2 className="text-2xl font-bold">Tourist Report</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Total Tourists per Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Filter Tourist Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Itinerary" />
                      </SelectTrigger>
                      <SelectContent>
                        {itineraries?.map((itinerary) => (
                          <SelectItem key={itinerary?._id} value={itinerary?._id?.toString()}>
                            {itinerary.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        {/* Add more months */}
                      </SelectContent>
                    </Select>
                    <Button>Apply Filter</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.map((notification) => (
                    <div key={notification.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                      <p>{notification.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TourGuideDashboard;