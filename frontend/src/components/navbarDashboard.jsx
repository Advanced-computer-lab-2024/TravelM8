// Header.js
import React from "react";
import {useState} from "react";
import { Button } from "@/components/ui/button.jsx"; // Adjust the import path accordingly
import { Bell, ChevronDown } from "lucide-react"; // Adjust based on your icon setup
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import Logout from "@/hooks/logOut.jsx";
import LogoutAlertDialog from "../hooks/logoutAlert";

const Header = ({ name = "Jane Doe", editProfile }) => {
    const [isAlertOpen, setAlertOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setAlertOpen(true); // Open the alert dialog when "Logout" is clicked
    };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-7 py-3">
        {/* Title and Notifications */}
        <h1 className="text-2xl font-semibold text-gray-800">Tour Guide Dashboard</h1>

        <div className="flex items-center">
          {/* Borderless Notification Button */}
          <Button
            variant="link" // Borderless button style
            size="icon"
            className="p-0 mr-4 flex items-center"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* "Hi, {name}" Greeting */}
          <span className="text-gray-700 mr-2">Hi, {name}</span>

          {/* Dropdown Menu at the right */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="link" 
                className="p-0 flex items-center"
              >
                <ChevronDown className="h-4 w-4 text-gray-500" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(editProfile)}>Edit Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogoutClick} >Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <LogoutAlertDialog
        isOpen={isAlertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </header>
  );
};

export default Header;
