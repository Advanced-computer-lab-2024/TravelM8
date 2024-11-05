import React, { useState, useEffect } from 'react'
import { Bell, ChevronDown, Eye, EyeOff, User, X, CreditCard, Tag, Star, Shield, Layout, List, Settings, Map, TagsIcon, DollarSign } from 'lucide-react'
import {Input} from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {DatePickerWithRange} from "@/components/ui/date-picker-with-range.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { fetchProfileInfo, updateProfile } from '../api/apiService';

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
      const fullMobileNumber = countryCode +" "+ mobileNumber;   
      const updatedProfile = {
        ...changes,
        mobileNumber: fullMobileNumber,
      }
        const response = await updateProfile(updatedProfile, token);
        console.log(changes);
        alert("Profile updated successfully", response);
        window.location.reload();
      }
      else {
        const response = await updateProfile(changes, token);
        console.log(changes);
        alert("Profile updated successfully", response);
        window.location.reload();
      }
    } catch (error) {
      console.log(changes);
      alert("Error updating");
      console.error('Error updating:', error);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault()
    setError('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }
    console.log('Password change requested')
    
    // Close the modal and reset fields
    setIsPasswordModalOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  useEffect(() => {
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
  }, [token]);

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
                        onValueChange={(value) => handleInputChange({ target: { name: 'nationality', value }})}
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
                        onValueChange={(value) => handleInputChange({ target: { name: 'occupation', value }})}
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
                    value = {new Date(profile ? profile.dob : '-').toISOString().split("T")[0]} className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  </div>
                </div>
              </section>
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Sign-in details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <Input 
                    name="password"
                    type="password" 
                    value="********" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" readOnly />
                  </div>
                  <div>
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </section>
              <div className="flex justify-end">
                <button 
                  onClick={handleFormSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
      case 'tags':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Tags</h1>
            {/* Tags content */}
          </div>
        );
      case 'itineraries':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Itineraries</h1>
            {/* Itineraries content */}
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            {/* Settings content */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">TravelM8</div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <Bell className="h-6 w-6" />
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <User className="h-6 w-6 mr-2" />
              <span>John Doe</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 ">
        <Card className="bg-background border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Amount in Wallet</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${profile ? profile.wallet : '0'}</div>
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
              onClick={() => setActiveView('tags')}
            >
              <Tag className="mr-3" />
              Tags
            </button>
            <button
              className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
              onClick={() => setActiveView('itineraries')}
            >
              <List className="mr-3" />
              Itineraries
            </button>
            <button
              className="w-full flex items-center px-4 py-2 mb-4 rounded-lg shadow-md text-gray-600 bg-white hover:bg-gray-100 transition-all"
              onClick={() => setActiveView('settings')}
            >
              <Settings className="mr-3" />
              Settings
            </button>
            </nav>
    </aside>

        {/* Main Content */}
        <div className="w-full md:w-3/4">{renderContent()}</div>
      </div>
    </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">About us</a></li>
                <li><a href="#" className="hover:text-gray-300">Careers</a></li>
                <li><a href="#" className="hover:text-gray-300">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-300">Safety Information</a></li>
                <li><a href="#" className="hover:text-gray-300">Cancellation Options</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-300">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0  2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-sm">&copy; 2023 Expedia, Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Site Map</a>
            </div>
          </div>
        </div>
      </footer>

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
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
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
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TouristProfilePage;