"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "@/pages/admin/services/productService.js"; // Import the product service
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleLeft, ToggleRightIcon } from "lucide-react";
import axios from "axios";

const ProductPage = () => {
  const [sidebarState, setSidebarState] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarState(!sidebarState);
  };

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
    console.log("imageeee",file)
    console.Conso
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
  
        const response = await updateProduct(currentProduct._id, formData);  // Pass FormData
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
    try{
      await fetch(`http://localhost:5001/api/products/${productId}/${isArchived? 'unarchive' : 'archive'}`,{
        method: 'PUT',
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts((prev) => prev.map((product) => product._id === productId ? {...product, archived: !isArchived}: product));
    }catch (error){
      console.error(`Error ${isArchived? 'unarchive' : 'archive'} product:` , error);
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
  

  return (
    <div style={{ display: "flex" }}>
      <Sidebar state={sidebarState} toggleSidebar={toggleSidebar} />
      <div
        style={{
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarState ? "250px" : "0",
          width: "100%",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Product Management</h1>

          <Button onClick={() => setIsCreateOpen(true)} className="mb-4">
            Create Product
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
                    type="number"
                    value={newProductData.description || ''}
                    onChange={(e) => setNewProductData({ ...newProductData, quantity: e.target.value })}
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
                    type="number"
                    value={updatedProductData.description || ''}
                    onChange={(e) => setUpdatedProductData({ ...updatedProductData, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleUpdateProduct}>Update</Button>
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
                    {/* //toggle to archive / unarchive a p */}
                  <Button onClick={() => toggleArchive(product._id, product.archived )} className="mr-2 ml-2">{product.archived ? 'Unarchive' : 'Archive'}</Button>
                    <Button onClick={() => openEditModal(product)} className="mr-2 ml-2 ">Edit</Button>
                    <Button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white ml-2">Delete</Button>
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductPage;
