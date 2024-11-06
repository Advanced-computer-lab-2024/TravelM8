import React, { useState, useEffect } from "react";
import { Eye, X, CheckCircle, ArrowRight } from "lucide-react"; // Icons for styling
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";

const PendingUserDocuments = () => {
  const [userDocuments, setUserDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/pending-user-documents",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
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

    fetchUserDocuments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Navbar />
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
                    >
                      <CheckCircle className="mr-2" size={16} /> Approve
                    </Button>
                    <Button variant="outline" className="w-full text-red-600">
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
    </div>
  );
};

export default PendingUserDocuments;
