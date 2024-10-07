import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'; 
import { Button } from '../../components/ui/button'; 
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from '../../components/ui/label'; 
import { Input } from '../../components/ui/input'; 
import { useToast } from "./components/useToast";
import { SearchBar } from './components/filters/search';
import { PriceFilter } from "./components/filters/price-filter";
import { getProducts } from './api/apiService'; // Import the getProducts function

const token = localStorage.getItem('token');

export default function SellerProducts() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const { toast } = useToast();

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const savedProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, savedProduct]);
      setIsAddProductModalOpen(false);
    } catch (error) {
      console.error('Error adding new product:', error);
    }
  };

  // Fetch products for the seller using getProducts
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading state
      try {
        const response = await getProducts(); // Fetch products from the API
        setProducts(response.data); // Update products state
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message); // Handle error state
      } finally {
        setLoading(false); // Clear loading state
      }
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting product');
      }

      setProducts(products.filter((product) => product._id !== productId));
      toast({
        title: "Deleted Product",
        description: "Your product has been successfully deleted.",
      });
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle product editing
  const handleEdit = (product) => {
    setEditProductData(product);
    setIsEditProductModalOpen(true);
  };

  // Function to update the product
  const updateProduct = async (productData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/products/${editProductData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Error updating product');
      }

      const savedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product._id === savedProduct._id ? savedProduct : product))
      );

      toast({
        title: "Product Updated",
        description: "Your product has been successfully updated.",
      });
      setIsEditProductModalOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Your Products</h1>
      <SearchBar />
      <PriceFilter />
      <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4">Add Product</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <AddProductForm onSubmit={handleAddProduct} />
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditProductModalOpen} onOpenChange={setIsEditProductModalOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4" style={{ display: 'none' }}>Edit Product</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <AddProductForm onSubmit={updateProduct} initialData={editProductData} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? ( // Show loading state
          <p>Loading products...</p>
        ) : products.length === 0 ? ( // Show empty state
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <Card key={product._id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2"
                />
                <p className="font-bold">{`Price: EGP ${product.price.toFixed(2)}`}</p>
                <p className="mb-2">{product.description}</p>
                <p className="font-semibold">{`Seller ID: ${product.sellerId}`}</p>
                <Button className="mt-2" onClick={() => handleEdit(product)}>
                  Edit
                </Button>
                <Button
                  className="mt-2 ml-2"
                  variant="destructive"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// AddProductForm component
function AddProductForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData ? initialData.name : "",
    description: initialData ? initialData.description : "",
    price: initialData ? initialData.price : "",
    quantity: initialData ? initialData.quantity : "",
    image: initialData ? initialData.image : "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      image: formData.image,
    };

    console.log("Submitting product data:", productData);

    await onSubmit(productData);

    setIsSubmitting(false);

    if (!initialData) {
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        image: "",
      });
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        quantity: initialData.quantity,
        image: initialData.image,
      });
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="price">Price (EGP)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          type="text"
          value={formData.image}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}