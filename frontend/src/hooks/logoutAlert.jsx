// AlertDialog.js
import React from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button.jsx"; // Adjust the import path accordingly

const LogoutAlertDialog = ({ isOpen, onClose}) => {
  if (!isOpen) return null; // Don't render the dialog if it's not open
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5001/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        localStorage.removeItem('token'); 
        navigate("/"); 
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-bold">Are you sure you want to sign out?</h2>
        <div className="mt-4 flex justify-end space-x-4">
          <Button
            onClick={() => {
              handleLogout();
              onClose(); 
            }}
            className="bg-red-500 text-white border-none focus:outline-none hover:bg-red-500"
          >
            Sign out
          </Button>
          <Button onClick={onClose} className="bg-white text-black border border-gray-300 focus:outline-none hover:bg-white hover:text-black">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutAlertDialog;
