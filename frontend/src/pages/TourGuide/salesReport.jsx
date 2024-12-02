import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import * as tourGuideServices from "@/pages/TourGuide/api/apiService.js";
import * as advertiserServices from "@/pages/Advertiser/api/apiService.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SalesReport() {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [role, setRole] = useState("");
  const dateInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const getRoleFromToken = () => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.role;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint =
        role === "TourGuide"
          ? "http://localhost:5001/api/itinerariesReport"
          : "http://localhost:5001/api/activitiesReport";
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year, month, day },
      });
      setReportData(response.data?.data || []); // Ensure it's always an array
    } catch (err) {
      console.error(
        `Error fetching ${
          role === "TourGuide" ? "itineraries" : "activities"
        } report:`,
        err
      );
      setError(err.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userRole = getRoleFromToken();
    setRole(userRole);
    if (!token || !userRole) {
      navigate("/");
      return;
    }
    fetchItems(userRole);
  }, [token, navigate]);

  useEffect(() => {
    if (role) {
      fetchReport();
    }
  }, [role, year, month, day]);

  const fetchItems = async (userRole) => {
    try {
      const response =
        userRole === "TourGuide"
          ? await tourGuideServices.getMyItineraries(token)
          : await advertiserServices.getMyActivities(token);
      setItems(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(
        `Error fetching ${
          userRole === "TourGuide" ? "itineraries" : "activities"
        }:`,
        error
      );
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setDay(selectedDate.getDate());
    setMonth(selectedDate.getMonth() + 1); // Month is zero-indexed, so add 1
    setYear(selectedDate.getFullYear());
  };

  const handleMonthChange = (e) => {
    const selectedMonth = new Date(e.target.value);
    setMonth(selectedMonth.getMonth() + 1); // Month is zero-indexed
    setYear(selectedMonth.getFullYear());
    setDay(""); // Clear the day when filtering by month only
  };

  const clearFilters = () => {
    setYear("");
    setMonth("");
    setDay("");
    setSelectedItem("");
    if (dateInputRef.current) {
      dateInputRef.current.value = ""; // Clear the date input field
    }
  };

  const filteredReportData = Array.isArray(reportData)
    ? reportData.filter((item) =>
        selectedItem ? item.name === selectedItem : true
      )
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-3 space-y-4">
        <Card className="w-full md:w-[1100px]">
          <CardHeader>
            <CardTitle>Filter Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={`Select ${
                      role === "TourGuide" ? "Itinerary" : "Activity"
                    }`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {items?.map((item) => (
                    <SelectItem
                      key={item?._id}
                      value={role === "TourGuide" ? item.name : item.title}
                    >
                      {role === "TourGuide" ? item.name : item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                className="w-[180px]"
                onChange={handleDateChange}
                ref={dateInputRef}
              />
             <Select value={month} onValueChange={setMonth}>
    <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Month" />
    </SelectTrigger>
    <SelectContent>
    
        <SelectItem value="1">January</SelectItem>
        <SelectItem value="2">February</SelectItem>
        <SelectItem value="3">March</SelectItem>
        <SelectItem value="4">April</SelectItem>
        <SelectItem value="5">May</SelectItem>
        <SelectItem value="6">June</SelectItem>
        <SelectItem value="7">July</SelectItem>
        <SelectItem value="8">August</SelectItem>
        <SelectItem value="9">September</SelectItem>
        <SelectItem value="10">October</SelectItem>
        <SelectItem value="11">November</SelectItem>
        <SelectItem value="12">December</SelectItem>
    </SelectContent>
</Select>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Revenue performance</CardDescription>
        </CardHeader>
        <CardContent className="w-full md:h-[550px] flex justify-center">
          <ResponsiveContainer width="90%" height={500}>
            <BarChart data={filteredReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 13 }}
              />
              <YAxis
                tickFormatter={(tick) => {
                  if (tick > 1000000000) {
                    return `${(tick / 1000000000).toFixed(1)}B`;
                  } else if (tick >= 1000000) {
                    return `${(tick / 1000000).toFixed(1)}M`;
                  } else if (tick >= 1000) {
                    return `${(tick / 1000).toFixed(1)}K`;
                  }
                  return tick;
                }}
                tickCount={7}
              />
              <Tooltip
                formatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`;
                  }
                  return value;
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#8884d8"
                barSize={50}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
  <CardHeader>
    <CardTitle>Total Revenue</CardTitle>
    <CardDescription>{`The revenue of each ${
      role === "TourGuide" ? "itinerary" : "activity"
    }`}</CardDescription>
  </CardHeader>
  <CardContent>
    {loading ? (
      <div>Loading...</div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xl">{`${
              role === "TourGuide" ? "Itinerary" : "Activity"
            } Name`}</TableHead>
            <TableHead className="text-xl">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(filteredReportData) && filteredReportData.length > 0 ? (
            <>
              {filteredReportData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-lg">{item.name}</TableCell>
                  <TableCell className="text-base">
                    ${item.revenue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Revenue Row */}
              <TableRow>
                <TableCell className="text-lg font-bold">Total Revenue</TableCell>
                <TableCell className="text-base font-bold">
                  $
                  {filteredReportData
                    .reduce((total, item) => total + item.revenue, 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </>
          ) : (
            <>
           
              {/* Show total revenue as 0 if no data */}
              <TableRow>
                <TableCell className="text-lg font-bold">Total Revenue</TableCell>
                <TableCell className="text-base font-bold">$0.00</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    )}
  </CardContent>
</Card>


    </div>
  );
}