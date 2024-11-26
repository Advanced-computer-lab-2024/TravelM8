import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import DashboardsNavBar from "../../components/DashboardsNavBar.jsx";
import ActivityCard from "../../components/ActivityCard/ActivityCard.jsx";
import ActivityFormDialog from "./ActivityForm.jsx";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Calendar,
  ChevronDown,
  DollarSign,
  Layout,
  Map,
  Trash2,
  Plus,
  Settings,
  Tag,
  User,
  Users,
  MapPin
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Logout from "@/hooks/logOut.jsx";
import Header from "@/components/navbarDashboard.jsx";



const AdvertiserDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogArgs, setDialogArgs] = useState(null);
  const [activeTab, setActiveTab] = useState("activities"); // Manage active tab

  // Function to open the dialog, set the trigger source, and pass arguments
  const openDialog = (args) => {
    if (args) setDialogArgs(args.activity);
    else setDialogArgs(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogArgs(null);
  };

  const fetchActivities = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token available. Redirecting to login.");
      // Optionally redirect to the login page
      // window.location.href = "/login";
      return;
    }

    try {
      console.log("Token before fetch:", token); // Simple console log for debugging

      const response = await fetch("http://localhost:5001/api/myActivities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorText = await response.text();
          errorMessage += ` - ${errorText}`;
        } catch (parseError) {
          console.error("Error parsing response text:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Fetched activities:", data); // Log fetched data

      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        console.error("Unexpected data format:", data);
        throw new Error("Invalid data format received from the server.");
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error.message || error);
    }
  };

  // Debounced version (only for subsequent use if needed)
  const getActivities = useDebouncedCallback(fetchActivities, 200);

  useEffect(() => {
    // Initial fetch without debounce
    fetchActivities();

    // Cleanup if using debounce
    return () => getActivities.cancel();
  }, []);

  return (
    <>
      <div className="flex h-screen bg-gray-100 ">
        {/* Sidebar */}
        <aside className="w-64 h-full bg-white drop-shadow-xl flex flex-col justify-between">
          <div>
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-800">TravelM8</h2>
            </div>
            <nav className="mt-6">
              <button className={`flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left ${
                  activeTab === "activities" ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveTab("activities")}>
                <Map className="mr-3" />
                Activities
              </button>
              <button className={`flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left ${
                  activeTab === "sales" ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveTab("sales")}>
                <DollarSign className="mr-3" />
                Sales Reports
              </button>
              <button className={`flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left ${
                  activeTab === "tourists" ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveTab("tourists")}>
                <Users className="mr-3" />
                Tourist Reports
              </button>
              <button
                className={`flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200 w-full text-left ${
                  activeTab === "notifications" ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveTab("notifications")}
              >
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
          <Header name={"samla121212"} type="Advertiser" editProfile="/advertiserProfile" />
          {/* Dashboard Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Activities
                  </CardTitle>
                  <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activities.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active activities
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activities.filter((activity) => activity.isBookingOpen).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,500</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tourists
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                </CardContent>
              </Card>
            </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 ">
            <TabsList>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="sales">Sales Report</TabsTrigger>
              <TabsTrigger value="tourists">Tourist Report</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="activities" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Activities</h2>
                <Button onClick={() => openDialog(null)} variant = "primary" className="">
                  <Plus className="mr-2 h-4 w-4" /> Create Activity
              </Button>
              </div>
              <ActivityCard
                onRefresh={getActivities}
                activities={activities}
                isAdvertiser={true}
                openDialog={openDialog}
              />
              <ActivityFormDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                dialogArgs={dialogArgs}
                onRefresh={getActivities}
              />
            </TabsContent>
          </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdvertiserDashboard;
