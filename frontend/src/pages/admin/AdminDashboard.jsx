import { Bell, ChevronDown, Filter, Search,X, Settings, ShoppingBag, Users } from 'lucide-react'
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { getAllUsers, deleteUser } from "@/pages/admin/services/adminDeleteServices.js";
import { Label } from "@/components/ui/label";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "@/pages/admin/services/productService.js";
import {getAllComplaints, updateComplaintStatusAndReply} from "@/pages/admin/services/complaintService.js";
import useRouter from "@/hooks/useRouter";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  createPreferenceTag,
  getAllPreferenceTags,
  updatePreferenceTag,
  deletePreferenceTag,
} from "@/pages/admin/services/preferenceTagService.js"; 
import { useLocation, useNavigate } from "react-router-dom";
import { ClearFilters } from "../tourist/components/filters/clear-filters";
import { DateFilter } from "../tourist/components/filters/date-filter";
import { PriceFilterTwo } from "../tourist/components/filters/PriceFilterTwo";
import ItineraryCard from "../../components/ItineraryCard/ItineraryCard";
import { SearchBar } from "../tourist/components/filters/search";
import { getItineraries } from "../tourist/api/apiService";
import { LanguageFilter } from "../tourist/components/itineraries/language-filter";
import { SortSelection } from "../tourist/components/filters/sort-selection";
import axios from "axios";
const getDeletionRequests = async () => {
    // Simulated API call
    return [
      { id: 1, username: "tourist1",userType: "Tourist", requestDate: "2024-03-15", reason: "No longer traveling" },
      { id: 2, username: "tourist2", userType: "Tourist",requestDate: "2024-03-16", reason: "Privacy concerns" },
      { id: 3, username: "tourist3", userType: "Advertiser",requestDate: "2024-03-17", reason: "Switching to a different service" },
    ]
  }
  
  const deleteAccount = async (id) => {
    // Simulated API call
    console.log(`Deleting account with ID: ${id}`)
    return true
  }
  
  const rejectDeletionRequest = async (id) => {
    // Simulated API call
    console.log(`Rejecting deletion request with ID: ${id}`)
    return true
  }
  


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserStatistics />
      case 'documents':
        return <DocumentReview />
      case 'accounts':
        return <AccountManagement />
      case 'categories':
        return <CategoryManagement />
      case 'tags':
        return <TagManagement />
      case 'sales':
        return <SalesReport />
      case 'events':
        return <EventManagement />
      
      case 'complaints':
        return <ComplaintManagement />
        case 'itinerary':
        return <ItineraryManagement />
      case 'products':
        return <ProductManagement />
      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toggle Button for Sidebar */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-white shadow-md rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 transform bg-white shadow-md w-64 p-4 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav className="mt-4">
          {['Users', 'Accounts', 'Categories', 'Tags', 'Sales', 'Events', 'Documents', 'Complaints','Itinerary', 'Products'].map((item) => (
            <button
              key={item}
              className={`w-full text-left p-4 hover:bg-gray-200 ${
                activeTab === item.toLowerCase() ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                setActiveTab(item.toLowerCase())
                setSidebarOpen(false) // close sidebar after selecting
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

    {/* Main Content */}
    <div className="flex flex-col h-full">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function DocumentReview() {
    const [userDocuments, setUserDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchUserDocuments();
    }, []);
  
    const fetchUserDocuments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/pending-user-documents",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
  
        const data = await response.json();
        setUserDocuments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    const handleReject = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/pending-users-documents/${userId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );
  
        if (response.ok) {
          setUserDocuments(
            userDocuments.filter((item) => item.user._id !== userId)
          );
        } else {
          throw new Error("Failed to delete the user and documents");
        }
      } catch (error) {
        console.error("Error rejecting user:", error);
        alert("There was an issue rejecting the user.");
      }
    };
  
    const handleApprove = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/approve-user/${userId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          }
        );
  
        if (response.ok) {
          setUserDocuments(
            userDocuments.filter((item) => item.user._id !== userId)
          );
          alert("User approved and moved to the main collection.");
        } else {
          throw new Error("Failed to approve the user");
        }
      } catch (error) {
        console.error("Error approving user:", error);
        alert("There was an issue approving the user.");
      }
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
  
    return (
      <div>
          <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Manage Pending User Documents
            </h2>
            {userDocuments.length === 0 ? (
              <p>No pending user documents found.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {userDocuments.map((item, index) => (
                  <Card key={index} className="shadow-lg rounded-lg">
                    <CardHeader className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">
                          {item.user.username}
                        </h3>
                        <p className="text-sm text-gray-500">{item.user.email}</p>
                        <p className="text-sm font-medium text-blue-600">
                          {item.user.type}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:bg-red-100"
                        onClick={() => handleReject(item.user._id)}
                      >
                        <X size={16} />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-md font-semibold mb-3">
                        Uploaded Documents
                      </h4>
                      <ul className="space-y-2">
                        {item.documents.image && (
                          <li>
                            <a
                              href={`http://localhost:5001/uploads/${item.documents.image}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Image
                            </a>
                          </li>
                        )}
                        {item.documents.idpdf && (
                          <li>
                            <a
                              href={`http://localhost:5001/uploads/${item.documents.idpdf}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View ID PDF
                            </a>
                          </li>
                        )}
                        {item.documents.taxpdf && (
                          <li>
                            <a
                              href={`http://localhost:5001/uploads/${item.documents.taxpdf}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Tax PDF
                            </a>
                          </li>
                        )}
                        {item.documents.certificatespdf && (
                          <li>
                            <a
                              href={`http://localhost:5001/uploads/${item.documents.certificatespdf}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Certificates PDF
                            </a>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        className="w-full mr-2 text-green-600"
                        onClick={() => handleApprove(item.user._id)}
                      >
                        <CheckCircle className="mr-2" size={16} /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-red-600"
                        onClick={() => handleReject(item.user._id)}
                      >
                        <X className="mr-2" size={16} /> Reject
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <Footer />
      </div>
    );
}
function ItineraryManagement(){
    const location = useLocation();
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState([]);
    const [currency, setCurrency] = useState("USD");
    const [exchangeRates, setExchangeRates] = useState({});
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  
    useEffect(() => {
      async function fetchExchangeRates() {
        try {
          const response = await axios.get(
            "https://api.exchangerate-api.com/v4/latest/USD"
          );
          setExchangeRates(response.data.rates);
        } catch (error) {
          console.error("Error fetching exchange rates:", error);
        }
      }
      fetchExchangeRates();
    }, []);
  
    // Modify the call to fetch all itineraries for the admin
    const fetchItineraries = useDebouncedCallback(async () => {
      const queryParams = new URLSearchParams(location.search);
  
      // Add the isAdmin flag to the query for admin users
      queryParams.set("isAdmin", true);
  
      // Convert prices to USD using exchange rate for server-side filtering
      const minPriceUSD = priceRange.min
        ? priceRange.min / (exchangeRates[currency] || 1)
        : "";
      const maxPriceUSD = priceRange.max
        ? priceRange.max / (exchangeRates[currency] || 1)
        : "";
  
      // Update queryParams with converted minPrice and maxPrice
      if (minPriceUSD) queryParams.set("minPrice", minPriceUSD);
      if (maxPriceUSD) queryParams.set("maxPrice", maxPriceUSD);
      queryParams.set("currency", currency);
  
      try {
        const fetchedItineraries = await getItineraries(
          `?${queryParams.toString()}`
        );
        setItineraries(fetchedItineraries);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    }, 200);
  
    useEffect(() => {
      fetchItineraries();
    }, [location.search, currency, priceRange]);
  
    const handleCurrencyChange = (e) => {
      const selectedCurrency = e.target.value;
      setCurrency(selectedCurrency);
  
      // Reset query params with new currency
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("currency", selectedCurrency);
      navigate(`${location.pathname}?${queryParams.toString()}`, {
        replace: true,
      });
  
      // Trigger a new fetch with the updated currency
      fetchItineraries();
    };
  
    const handlePriceChange = (min, max) => {
      setPriceRange({ min, max });
    };
  
    const resetFilters = () => {
      setPriceRange({ min: "", max: "" });
      setCurrency("USD");
      setItineraries([]);
      navigate(location.pathname, { replace: true });
      fetchItineraries();
    };
  
    return (
      <>
        <SearchBar categories={["Name", "Tag"]} />
        <div className="flex justify-between items-center mb-4">
          <label>
            Currency:
            <select value={currency} onChange={handleCurrencyChange}>
              {Object.keys(exchangeRates).map((cur) => (
                <option key={cur} value={cur}>
                  {`${cur}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <DateFilter />
            <Separator className="mt-7" />
            <PriceFilterTwo
              currency={currency}
              exchangeRate={exchangeRates[currency] || 1}
              onPriceChange={handlePriceChange}
            />
            <Separator className="mt-7" />
            <LanguageFilter />
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex h-5 items-center space-x-4 text-sm">
                <div>{itineraries.length} results</div>
                <ClearFilters onClick={resetFilters} />
              </div>
              <SortSelection />
            </div>
            {itineraries.length > 0 ? (
              <ItineraryCard
                itineraries={itineraries}
                isAdmin={true} // Enable flagging
                currency={currency}
                exchangeRate={exchangeRates[currency] || 1}
              />
            ) : (
              <p>No itineraries found. Try adjusting your filters.</p>
            )}
          </div>
        </div>
      </>
    );   
}
function AccountManagement() {
    const [sidebarState, setSidebarState] = useState(false);
    const [requests, setRequests] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const { toast } = useToast()
  
    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const fetchedRequests = await getDeletionRequests()
          setRequests(fetchedRequests)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load deletion requests.",
            variant: "destructive",
          })
        }
      }
  
      fetchRequests()
    }, [toast])

    const toggleSidebar = () => {
        setSidebarState(!sidebarState);
      };

    const handleDelete = async (id) => {
      try {
        await deleteAccount(id)
        setRequests(requests.filter(request => request.id !== id))
        toast({
          title: "Success",
          description: "Account deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete account.",
          variant: "destructive",
        })
      }
      setIsDeleteDialogOpen(false)
    }
  
    const handleReject = async (id) => {
      try {
        await rejectDeletionRequest(id)
        setRequests(requests.filter(request => request.id !== id))
        toast({
          title: "Success",
          description: "Deletion request rejected.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reject deletion request.",
          variant: "destructive",
        })
      }
    }
  
    return (
       <div> 
      <div className="container mx-auto p-6 bg-background shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-primary"> Account Deletion Requests</h1>
        <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold text-muted-foreground">Username</TableHead>
              <TableHead className="font-semibold text-muted-foreground">User Type</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Request Date</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Reason</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="border-t">
                <TableCell className="font-medium">{request.username}</TableCell>
                <TableCell>{request.userType}</TableCell>
                <TableCell>{request.requestDate}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Account</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this account?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the
                          account and remove the data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input
                            id="username"
                            value={selectedRequest ? selectedRequest.username : ''}
                            className="col-span-3"
                            readOnly
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => selectedRequest && handleDelete(selectedRequest.id)}
                        >
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Reject deletion request</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        {requests.length === 0 && (
          <p className="text-center text-muted-foreground mt-6 p-4 bg-muted rounded-lg">
            No deletion requests found.
          </p>
        )}
         </div>
         <Footer />
      </div>
     
    )
}

function CategoryManagement() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Category Management</h3>
      <div className="flex space-x-2">
        <Input placeholder="New category name" />
        <Button>Add Category</Button>
      </div>
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Food</td>
              <td className="p-2">
                <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                <Button size="sm" variant="destructive">Delete</Button>
              </td>
            </tr>
            {/* More categories */}
          </tbody>
        </table>
      </div>
    </div>
    
  )
}

function TagManagement() {
    const [sidebarState, setSidebarState] = useState(false);
    const [tags, setTags] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentTag, setCurrentTag] = useState(null);
    const [newTagName, setNewTagName] = useState("");
    const { toast } = useToast();
  
    useEffect(() => {
      const fetchTags = async () => {
        const fetchedTags = await getAllPreferenceTags();
        setTags(fetchedTags);
      };
  
      fetchTags();
    }, []);
  
    const toggleSidebar = () => {
      setSidebarState(!sidebarState);
    };
  
    const handleCreate = async () => {
      if (newTagName.trim() !== "") {
        const newTag = await createPreferenceTag(newTagName.trim());
        setTags((prevTags) => [...prevTags, newTag]);
        setNewTagName("");
        setIsOpen(false);
        toast({
          title: "Success",
          description: "Tag created successfully!",
          duration: 3000,
        });
      }
    };
  
    const handleUpdate = async () => {
      if (currentTag && newTagName.trim() !== "") {
        const updatedTag = await updatePreferenceTag(
          currentTag.name,
          newTagName.trim()
        );
        setTags((prevTags) =>
          prevTags.map((tag) => (tag.name === currentTag.name ? updatedTag : tag))
        );
        setNewTagName("");
        setCurrentTag(null);
        setIsOpen(false);
        toast({
          title: "Success",
          description: "Tag updated successfully!",
          duration: 3000,
        });
      }
    };
  
    const handleDelete = async (tagName) => {
      await deletePreferenceTag(tagName);
      setTags((prevTags) => prevTags.filter((tag) => tag.name !== tagName));
      toast({
        title: "Success",
        description: "Tag deleted successfully!",
        duration: 3000,
      });
    };
  
    const openEditModal = (tag) => {
      setCurrentTag(tag);
      setNewTagName(tag.name);
      setIsOpen(true);
    };
  
    return (
      <div>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Vacation Preference Tags</h1>
  
            {/* Dashboard Button */}
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => (window.location.href = "/dashboard")} // Change '/dashboard' to your actual dashboard route
                variant="outline"
              >
                Go to Dashboard
              </Button>
            </div>
  
            <div className="flex justify-between items-center mb-4">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setCurrentTag(null);
                      setNewTagName("");
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {currentTag ? "Edit Tag" : "Create New Tag"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tagName" className="text-right">
                        Tag Name
                      </Label>
                      <Input
                        id="tagName"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={currentTag ? handleUpdate : handleCreate}>
                      {currentTag ? "Update" : "Create"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
  
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => openEditModal(tag)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(tag.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {tags.length === 0 && (
              <p className="text-center text-muted-foreground mt-4">
                No tags found.
              </p>
            )}
          </div>
          <Footer />
        </div>
      
    );
}

function SalesReport() {
    return (
        <div className="space-y-4 h-screen w-full p-8 bg-gray-100">
          <h3 className="text-lg font-semibold">Sales Report</h3>
          
          {/* Filter and Search Section */}
          <div className="flex space-x-2 ">
            <Select>
              <SelectTrigger className="w-[980px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search..." />
            <Button>Apply Filter</Button>
          </div>
      
          {/* Sales Chart Section */}
          <div className="bg-white p-4 rounded shadow">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              Sales Chart Placeholder
            </div>
          </div>
      
          {/* Sales Table Section */}
          <div className="bg-white rounded shadow overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Product/Event</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">City Tour</td>
                  <td className="p-2">2023-06-01</td>
                  <td className="p-2">$500</td>
                </tr>
                {/* More sales data */}
              </tbody>
            </table>
          </div>
        </div>
      );
      
}

function EventManagement() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Event Management</h3>
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Event</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Summer Festival</td>
              <td className="p-2">2023-07-15</td>
              <td className="p-2">
                <Button size="sm" variant="destructive">Flag as Inappropriate</Button>
              </td>
            </tr>
            {/* More events */}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserStatistics() {
    const [sidebarState, setSidebarState] = useState(false);
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users.",
          duration: 3000,
        });
      }
    };

    fetchUsers();
  }, []);

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

  const handleDelete = async (username, userType) => {
    const confirmed = confirm(`Are you sure you want to delete user "${username}"?`);
    if (confirmed) {
      try {
        await deleteUser(username, userType); // Pass username and userType to delete service
        setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
        toast({
          title: "Success",
          description: `User "${username}" deleted successfully!`,
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user.",
          duration: 3000,
        });
      }
    }
  };

  
  return (
    <div >
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">User Management</h1>

          {/* Statistics Section */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold">User Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-medium">Total Users</h4>
                <p className="text-3xl font-bold">10,245</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-medium">New Users This Month</h4>
                <p className="text-3xl font-bold">342</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              {/* Placeholder for user growth chart */}
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                User Growth Chart Placeholder
              </div>
            </div>
          </div>

          {/* User List Section */}
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell className="text-right">
                    <button
                      className="flex items-center text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(user.username, user.type)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <p className="text-center text-muted-foreground mt-4">
              No users found.
            </p>
          )}
        </div>
        <Footer />
      </div>
   
  );
}

function ComplaintManagement() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log('No token found in local storage');
      return null;
    }
  
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const role = decodedPayload.role;
      if (role) {
        console.log('User Role:', role);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  
    const [sidebarState, setSidebarState] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const { toast } = useToast();
    const [selectedStatus, setSelectedStatus] = useState("");
    const [reply, setReply] = useState("");
    const { searchParams, navigate, location } = useRouter();
  
    const toggleSidebar = () => {
      setSidebarState(!sidebarState);
    };
  
    useEffect(() => {
      fetchComplaints();
    }, [token, toast, searchParams]);
  
    const fetchComplaints = async () => {
      try {
        const data = await getAllComplaints(token);
        let filteredAndSortedComplaints = [...data];
  
        const status = searchParams.get('status');
        if (status && status !== 'All') {
          filteredAndSortedComplaints = filteredAndSortedComplaints.filter(
            complaint => complaint.status === status
          );
        }
  
        const sortBy = searchParams.get('sortBy') || 'date';
        const order = searchParams.get('order') || 'desc';
        filteredAndSortedComplaints.sort((a, b) => {
          if (order === 'asc') {
            return new Date(a[sortBy]) - new Date(b[sortBy]);
          } else {
            return new Date(b[sortBy]) - new Date(a[sortBy]);
          }
        });
  
        setComplaints(filteredAndSortedComplaints);
        toast({
          title: "Success",
          description: "Success to load complaints.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast({
          title: "Error",
          description: "Failed to load complaints.",
          duration: 3000,
        });
      }
    };
  
    const handleFilter = (status) => {
      searchParams.set('status', status);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };
  
    const handleSort = (value) => {
      const [sortBy, order] = value.split('-');
      searchParams.set('sortBy', sortBy);
      searchParams.set('order', order);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };
  
    const getSortBy = () => {
      const sortBy = searchParams.get('sortBy') || 'date';
      const order = searchParams.get('order') || 'desc';
      return `${sortBy}-${order}`;
    };
  
    const getActiveFilter = () => searchParams.get('status') || 'All';
  
    const handleSubmit = async () => {
      if (selectedComplaint && selectedStatus) {
        try {
          await updateComplaintStatusAndReply(token, selectedComplaint._id, reply, selectedStatus);
          setComplaints(prevComplaints =>
            prevComplaints.map(complaint =>
              complaint._id === selectedComplaint._id
                ? { ...complaint, status: selectedStatus, reply: reply }
                : complaint
            )
          );
          toast({
            title: "Success",
            description: `Complaint status updated to ${selectedStatus}.`,
            duration: 10000,
          });
        } catch (error) {
          console.error("Error updating status:", error);
          toast({
            title: "Error",
            description: "Failed to update complaint status.",
            duration: 3000,
          });
        }
      }
    };
  
    return (
        
          
          <div>
           
            <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Complaints Management</h1>
              <div className="flex justify-start mb-4">
              <div className="flex items-center space-x-4">
                                <Select value={getActiveFilter()} onValueChange={handleFilter}>
                                    <SelectTrigger className="w-[200px] !ring-0">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">Show All</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-4 ml-4">
                                <Select value={getSortBy()} onValueChange={handleSort}>
                                    <SelectTrigger className="w-[200px] !ring-0">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date-desc">Date: Newest First</SelectItem>
                                        <SelectItem value="date-asc">Date: Oldest First</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={() => (window.location.href = "/dashboard")}
                                    variant="outline"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
              </div>
    
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell>{complaint.touristId?.username}</TableCell>  
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>
                        <span className={`${complaint.status === "Pending" ? "text-red-500" : "text-green-500"}`}>
                          {complaint.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(complaint.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(complaint.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                      <TableCell>
                      <Dialog>
          <DialogTrigger asChild>
          <Button onClick={() => { setSelectedComplaint(complaint);setSelectedStatus(complaint.status); }} variant="outline">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
                Complaint : {selectedComplaint?.title}
              </DialogTitle>
              <p></p>
              <Separator/>
              <p></p>
              <p><strong>Description : </strong></p>{selectedComplaint?.body}
              <p></p>
              <p><strong>Date Issued :</strong> {selectedComplaint ? new Date(selectedComplaint.date).toLocaleDateString() : ''}</p>
              <p></p>
              <p><strong>Reply to Complaint : </strong></p>
              <Textarea 
              value={reply} // Bind the Textarea value to reply state
              onChange={(e) => setReply(e.target.value)} // Update reply state on change
            />
              <p></p>
              <p></p>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </DialogHeader>
          <DialogClose asChild>
            <Button onClick={handleSubmit} className="mt-4" >
              Submit       
            </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
    
              {complaints.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">No complaints found.</p>
              )}
            </div>
            <Footer />
          </div>
          
        
      );
}

function ProductManagement() {
    
        const [products, setProducts] = useState([]);
        const { toast } = useToast();
        const [isOpen, setIsOpen] = useState(false);
        const [isCreateOpen, setIsCreateOpen] = useState(false);
        const [currentProduct, setCurrentProduct] = useState(null);
        const [updatedProductData, setUpdatedProductData] = useState({});
        const [newProductData, setNewProductData] = useState({});
        const [image, setImage] = useState();
      
        useEffect(() => {
          const fetchProducts = async () => {
            try {
              const response = await getAllProducts();
              if (response && response.success && Array.isArray(response.data)) {
                setProducts(response.data);
              } else {
                throw new Error("Fetched data is not valid.");
              }
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to fetch products.",
                duration: 3000,
              });
            }
          };
      
          fetchProducts();
        }, [toast]);
      
        const handleDeleteProduct = async (productId) => {
          try {
            const response = await deleteProduct(productId);
            toast({
              title: "Success",
              description: response.message,
              duration: 3000,
            });
      
            setProducts(products.filter((product) => product._id !== productId));
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to delete the product.",
              duration: 3000,
            });
          }
        };
      
        const handleImageChange = (e) => {
          const file = e.target.files[0];
          setImage(file);
          setNewProductData(prev => ({
            ...prev,
            image: file
          }));
          setUpdatedProductData(prev => ({
            ...prev,
            image: file
          }));
        };
      
        const openEditModal = (product) => {
          setCurrentProduct(product);
          setUpdatedProductData({
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: product.quantity,
            description: product.description,
          });
          setIsOpen(true);
        };
      
        const handleUpdateProduct = async () => {
          if (currentProduct) {
            try {
              const formData = new FormData();
              formData.append("name", updatedProductData.name);
              formData.append("image", updatedProductData.image);  
              formData.append("price", updatedProductData.price); 
              formData.append("quantity", updatedProductData.quantity); 
              formData.append("description", updatedProductData.description); 
        
              const response = await updateProduct(currentProduct._id, formData);
              toast({
                title: "Success",
                description: "Product updated successfully!",
                duration: 3000,
              });
              setProducts(products.map((product) => (product._id === currentProduct._id ? response : product)));
              setIsOpen(false);
              setCurrentProduct(null);
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to update the product.",
                duration: 3000,
              });
            }
          }
        };
      
        const toggleArchive = async (productId, isArchived) => {
          try {
            await fetch(`http://localhost:5001/api/products/${productId}/${isArchived ? 'unarchive' : 'archive'}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            setProducts((prev) => prev.map((product) => product._id === productId ? {...product, archived: !isArchived} : product));
          } catch (error) {
            console.error(`Error ${isArchived ? 'unarchive' : 'archive'} product:`, error);
          }
        };
      
        const handleCreateProduct = async () => {
          try {
            const formData = new FormData();
            formData.append("name", newProductData.name);
            formData.append("price", newProductData.price);
            formData.append("quantity", newProductData.quantity);
            formData.append("description", newProductData.description);
        
            if (image) {
              formData.append("image", image);
            }
            const response = await createProduct(formData);
        
            toast({
              title: "Success",
              description: "Product created successfully!",
              duration: 3000,
            });
        
            setProducts([...products, response]);
            setIsCreateOpen(false);
            setNewProductData({});
          } catch (error) {
            console.error(error.response);
            toast({
              title: "Error",
              description: error.response?.data?.message || "Failed to create the product.",
              duration: 3000,
            });
          }
        };
        const buttonStyles = "rounded-md bg-gray-200 text-gray-800 border border-gray-500 px-4 py-2 hover:bg-gray-300";

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Management</h3>
            <div className="flex space-x-2">
              <Input placeholder="Search products..." />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                  <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              <Button className={buttonStyles}>
                <Filter className="mr-2 h-4 w-4" />
                Sort by Rating
              </Button>
            </div>
            <Button className={buttonStyles} onClick={() => setIsCreateOpen(true)}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
      
            {/* Create Product Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newProductName" className="text-right">Product Name</Label>
                    <Input
                      id="newProductName"
                      value={newProductData.name || ''}
                      onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newProductImage" className="text-right">Image</Label>
                    <Input
                      name="image"
                      type="file"
                      accept="image/*"
                      id="newProductImage"
                      onChange={handleImageChange}
                      className="col-span-3"                  
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newProductPrice" className="text-right">Price</Label>
                    <Input
                      id="newProductPrice"
                      type="number"
                      value={newProductData.price || ''}
                      onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newProductQuantity" className="text-right">Quantity</Label>
                    <Input
                      id="newProductQuantity"
                      type="number"
                      value={newProductData.quantity || ''}
                      onChange={(e) => setNewProductData({ ...newProductData, quantity: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newProductDescription" className="text-right">Description</Label>
                    <Input
                      id="newProductDescription"
                      value={newProductData.description || ''}
                      onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreateProduct}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
      
            {/* Edit Product Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productName" className="text-right">Product Name</Label>
                    <Input
                      id="productName"
                      value={updatedProductData.name || ''}
                      onChange={(e) => setUpdatedProductData({ ...updatedProductData, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productImage" className="text-right">Image</Label>
                    <Input
                      name="image"
                      type="file"
                      accept="image/*"
                      id="productImage"
                      onChange={handleImageChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productPrice" className="text-right">Price</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      value={updatedProductData.price || ''}
                      onChange={(e) => setUpdatedProductData({ ...updatedProductData, price: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productQuantity" className="text-right">Quantity</Label>
                    <Input
                      id="productQuantity"
                      type="number"
                      value={updatedProductData.quantity || ''}
                      onChange={(e) => setUpdatedProductData({ ...updatedProductData, quantity: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productDescription" className="text-right">Description</Label>
                    <Input
                      id="productDescription"
                      value={updatedProductData.description || ''}
                      onChange={(e) => setUpdatedProductData({ ...updatedProductData, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className={buttonStyles} onClick={handleUpdateProduct}>Update</Button>
                </div>
              </DialogContent>
            </Dialog>
      
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell><img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} /></TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.sales}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                <Button onClick={() => toggleArchive(product._id, product.archived)} className={`${buttonStyles} mr-2`}>
                  {product.archived ? 'Unarchive' : 'Archive'}
                </Button>
                <Button onClick={() => openEditModal(product)} className={`${buttonStyles} mr-2`}>
                  Edit
                </Button>
                <Button onClick={() => handleDeleteProduct(product._id)} className={`${buttonStyles} bg-black-500 text-black`}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
            </Table>
          </div>
        );
      }
