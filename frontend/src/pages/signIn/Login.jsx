import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username,
        password
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id || decodedToken.userId;

      console.log("User ID:", userId);
      localStorage.setItem('userId', userId);

      console.log("Login successful. Role:", role);
      console.log("token:", token);

      switch (role) {
        case 'Tourist':
          navigate('/tourist-page');
          break;
        case 'Seller':
          navigate('/Sellerdashboard');
          break;
        case 'TourGuide':
          navigate('/tourGuideDashboard');
          break;
        case 'TourismGovernor':
          navigate('/TourismGovernorDashboard');
          break;
        case 'Admin':
          navigate('/AdminDashboard');
          break;
        case 'Advertiser':
          navigate('/advertiserDashboard');
          break;
        default:
          navigate('/default-page');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')"}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <Card className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Your Journey</CardTitle>
          <CardDescription className="text-center">Sign in to explore amazing destinations</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50 backdrop-blur-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Start Your Adventure</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}