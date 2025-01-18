'use client'

import React, { useEffect, useState } from 'react';
import { useSellerStore } from '@/store/seller-store';
import { useAuthStore } from '@/store/auth-store';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react'


const ProductsPage = () => {
  const { isSignedIn, user, isLoaded } = useUser()

  if(!isLoaded){
    return <div>Loading...</div>
  }
  console.log('user da', user)

  
  const { products, setProducts, addProduct, updateProduct, deleteProduct } = useSellerStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    sellingPrice: '',
    quantity: '',
    unitCommission: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', { user });
      const data = await response.json();
      console.log('data: ', data)
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p>Loading products...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Show not authenticated state
  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Please sign in to view your products.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      sellerId: user.userId,
      price: parseInt(formData.price * 100), // Convert to cents
      sellingPrice: parseInt(formData.sellingPrice * 100),
      unitCommission: parseInt(formData.unitCommission * 100),
      quantity: parseInt(formData.quantity)
    };

    try {
      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const updatedProduct = await response.json();
        updateProduct(editingProduct.id, updatedProduct);
      } else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const newProduct = await response.json();
        addProduct(newProduct);
      }

      setIsAddDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        image: '',
        price: '',
        sellingPrice: '',
        quantity: '',
        unitCommission: ''
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      image: product.image || '',
      price: (product.price / 100).toString(),
      sellingPrice: (product.sellingPrice / 100).toString(),
      quantity: product.quantity.toString(),
      unitCommission: (product.unitCommission / 100).toString()
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });
        deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
              )}
              <div className="space-y-2">
                <p>Price: ${product.price / 100}</p>
                <p>Selling Price: ${product.sellingPrice / 100}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Commission: ${product.unitCommission / 100}/unit</p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Cost Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price ($)</Label>
              <Input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitCommission">Commission per Unit ($)</Label>
              <Input
                id="unitCommission"
                name="unitCommission"
                type="number"
                step="0.01"
                value={formData.unitCommission}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;