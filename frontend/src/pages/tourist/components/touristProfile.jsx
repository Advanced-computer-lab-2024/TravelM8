import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, X, ThumbsDown, BookCheck, Settings, Map, DollarSign, HeartCrack, Heart } from 'lucide-react'
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchProfileInfo, updateProfile, changePassword } from '../api/apiService';
import Logout from "@/hooks/logOut.jsx";
import { MyComplaintsPage } from "@/pages/tourist/components/complaints/myComplaints.jsx";
import Footer from "@/components/Footer.jsx";
import BookingHistory from "@/pages/tourist/components/bookings/BookingHistory.jsx";
import Navbar from "@/components/Navbar.jsx";

const TouristProfilePage = () => {

  const amount = 45231.89,
    percentageChange = 20.1,
    timeframe = "from last month";
  const isPositive = percentageChange > 0;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [activeView, setActiveView] = useState('dashboard');
  const token = localStorage.getItem('token');
  const [profile, setProfile] = useState(null);
  const [changes, setChanges] = useState([]);
  const [countryCode, setCountryCode] = useState(profile ? profile.mobileNumber.slice(0, 2) : '+1'); // Default to '+1'
  const [mobileNumber, setMobileNumber] = useState(profile ? profile.mobileNumber.slice(2) : ''); // Default to empty
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobileNumber')
      setMobileNumber(value);
    setProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setChanges((prevChanges) => ({
      ...prevChanges,
      [name]: value,
    }));
  };

  const handleCountryCodeChange = (value) => {
    setCountryCode(value);
  };

  const handleFormSubmit = async () => {
    try {
      if ("mobileNumber" in changes) {
        const fullMobileNumber = countryCode + " " + mobileNumber;
        const updatedProfile = {
          ...changes,
          mobileNumber: fullMobileNumber,
        }
        const response = await updateProfile(updatedProfile, token);
        console.log(changes);
        alert("Profile updated successfully", response);
      }
      else {
        const response = await updateProfile(changes, token);
        console.log(changes);
        alert("Profile updated successfully", response);
      }
    } catch (error) {
      console.log(changes);
      alert("Error updating profile");
      console.error('Error updating:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return
    }
    if (newPassword !== confirmPassword) {

      setError('New password and confirm password do not match')
      return
    }
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long");
      setError('New password must be at least 8 characters long')
      return
    }
    try {
      const passwordData = {
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      };
      console.log(passwordData);
      const response = await changePassword(passwordData, token);
      alert('Password changed successfully');
      console.log("success");
      setIsPasswordModalOpen(false);
      setCurrentPassword(null);
      setNewPassword(null);
      setConfirmPassword(null);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display the specific error message
      } else {
        setError('An unexpected error occurred');
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/");
      return;
    }
    const getProfileInfo = async () => {
      try {
        const data = await fetchProfileInfo(token);
        console.log(data.dob);
        setProfile(data);
      } catch (err) {
        setError('Failed to fetch profile information.');
      }
    };

    getProfileInfo();
  }, [navigate, token]);

  const handleYesClick = async () => {
    console.log("Yes button clicked");

    try {

      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Authorization token is required");
        return;
      }

      const response = await fetch('http://localhost:5001/api/deleteRequests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });
      console.log(token);

      const data = await response.json();

      if (response.ok) {
        alert('Deletion request created successfully:');
        setShowDialog(false);
        console.log('Deletion request created successfully:');
      } else {
        alert(data.msg);
        setShowDialog(false);
        console.error('Error creating deletion request:', data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const renderContent = () => {
    if (!profile) {
      return <div>Loading...</div>;
    }
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Account info</h1>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-2xl text-white">
                  JD
                </div>
                <div>
                  <h3 className="font-semibold">{profile ? profile.name : 'null'}</h3>
                  <p className="text-gray-600">{profile ? profile.email : 'null'}</p>
                </div>
              </div>
            </section>
            {/* Display User Preferences */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div>
                {profile && profile.preferences && profile.preferences.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {profile.preferences.map((pref, index) => (
                      <li key={index} className="text-lg text-gray-700">{pref}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No preferences available.</p>
                )}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Personal info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    name="name"
                    onChange={handleInputChange}
                    type="text"
                    value={profile ? profile.name : ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email address</label>
                  <Input
                    name="email"
                    onChange={handleInputChange}
                    type="email"
                    value={profile ? profile.email : ''}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationality</label>
                  <Select
                    onValueChange={(value) => handleInputChange({ target: { name: 'nationality', value } })}
                    className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <SelectTrigger>
                      <SelectValue placeholder={profile ? profile.nationality : ''} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Egyptian">Egyptian</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Canadian">Canadian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <Select
                    onValueChange={(value) => handleInputChange({ target: { name: 'occupation', value } })}
                    className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <SelectTrigger>
                      <SelectValue placeholder={profile ? profile.occupation : ''} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employed">Employed</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone number</label>
                  <div className="flex items-center space-x-2">
                    <Select
                      onValueChange={(value) => {
                        handleCountryCodeChange(value);
                        // handleInputChange({ target: { name: 'mobileNumber', value: mobileNumber } }); // Keep mobile number intact
                      }}
                    >
                      <SelectTrigger className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                        <SelectValue placeholder={profile ? profile.mobileNumber.split(" ")[0] : ''} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+91">+91</SelectItem>
                        <SelectItem value="+20">+20</SelectItem>
                        <SelectItem value="+33">+33</SelectItem>
                        <SelectItem value="+34">+34</SelectItem>
                        <SelectItem value="+39">+39</SelectItem>
                        <SelectItem value="+49">+49</SelectItem>
                        <SelectItem value="+55">+55</SelectItem>
                        <SelectItem value="+61">+61</SelectItem>
                        <SelectItem value="+81">+81</SelectItem>
                        <SelectItem value="+86">+86</SelectItem>
                        <SelectItem value="+971">+971</SelectItem>
                        <SelectItem value="+353">+353</SelectItem>
                        <SelectItem value="+358">+358</SelectItem>
                        <SelectItem value="+64">+64</SelectItem>
                        <SelectItem value="+7">+7</SelectItem>
                        <SelectItem value="+82">+82</SelectItem>
                        <SelectItem value="+47">+47</SelectItem>
                        <SelectItem value="+46">+46</SelectItem>
                        <SelectItem value="+27">+27</SelectItem>
                        <SelectItem value="+34">+34</SelectItem>
                        <SelectItem value="+31">+31</SelectItem>
                        <SelectItem value="+63">+63</SelectItem>
                        <SelectItem value="+62">+62</SelectItem>
                        <SelectItem value="+52">+52</SelectItem>
                        <SelectItem value="+60">+60</SelectItem>
                        <SelectItem value="+234">+234</SelectItem>
                        <SelectItem value="+92">+92</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      name="mobileNumber"
                      onChange={handleInputChange}
                      type="tel"
                      value={profile ? profile.mobileNumber.split(" ")[1] : ''} // Controlled input
                      placeholder="Enter mobile number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <Input
                    type="date"
                    value={new Date(profile ? profile.dob : '-').toISOString().split("T")[0]} className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
              </div>
            </section>
            <div className="flex justify-end">
              <button
                onClick={handleFormSubmit}
                className="rounded-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white">
                Save changes
              </button>
            </div>
          </div>
        );
      case 'locations':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Locations</h1>
            {/* Locations content */}
          </div>
        );
      case 'complaints':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <MyComplaintsPage />
          </div>
        );
      case 'bookings':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <BookingHistory />
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Security & Settings</h1>
            {/* Settings content */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Sign-in details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <Input
                    readOnly
                    value={profile ? profile.username : 'null'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Input
                    name="password"
                    type="password"
                    value={profile ? profile.password : 'null'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" readOnly />
                </div>
              </div>
            </section>
            <div className="flex justify-end">
              <button
                className="rounded-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <Navbar profilePageString={"/tourist-profile"} />


      {/* Main Content */}
      <main className="container  mx-auto px-4 py-8 mt-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-64 ">
            <Card className="bg-background border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground">Amount in Wallet</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${profile ? profile.wallet.toFixed(2) : '0'}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={isPositive ? "text-green-500" : "text-red-500"}>
                    {isPositive ? '+' : ''}{percentageChange}%
                  </span>
                  {' '}{timeframe}
                </p>
              </CardContent>
            </Card>
            <nav className="mt-6">

              <button
                className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
                onClick={() => setActiveView('dashboard')}
              >
                <User className="mr-3" />
                Account Info
              </button>
              <button
                className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
                onClick={() => setActiveView('locations')}
              >
                <Map className="mr-3" />
                Locations
              </button>
              <button
                className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
                onClick={() => setActiveView('complaints')}
              >
                <ThumbsDown className="mr-3" />
                My complaints
              </button>
              <button
                className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
                onClick={() => setActiveView('bookings')}
              >
                <BookCheck className="mr-3" />
                My bookings
              </button>
              <button
                className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
                onClick={() => setActiveView('wishlist')}
              >
                <Heart className="mr-3" />
                My wishlist
              </button>
              <button
                className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
                onClick={() => setActiveView('settings')}
              >
                <Settings className="mr-3" />
                Security & Settings
              </button>
              <button
                className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
                onClick={() => setShowDialog(true)}
              >
                <HeartCrack className="mr-3" />
                Delete My account
              </button>
              {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                    {/* Close button */}
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                      onClick={() => setShowDialog(false)}
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="sr-only">Close</span>
                    </button>

                    <p className="text-lg">Are you sure you want to delete your account?</p>
                    <div className="flex justify-end mt-4">

                      <button className="bg-black text-white px-6 py-3 rounded mr-4"
                        onClick={handleYesClick}  >
                        Yes
                      </button>

                      <button
                        className="bg-gray-300 px-6 py-3 rounded"
                        onClick={() => setShowDialog(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>

              )}
              <Logout />
            </nav>
          </aside>

          {/* Main Content */}
          <div className="w-full md:w-3/4">{renderContent()}</div>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-16">
        <Footer />
      </div>
      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Change Password</h2>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TouristProfilePage;