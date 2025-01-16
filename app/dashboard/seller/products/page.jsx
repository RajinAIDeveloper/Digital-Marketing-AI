// app/dashboard/seller/products/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash } from "lucide-react";
import { useSellerStore } from "@/store/seller-store";

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useSellerStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    imageUrl: '',
    price: 0,
    quantity: 0,
    sellingPrice: 0,
    unitCommission: 0,
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    addProduct(newProduct);
    setIsAddDialogOpen(false);
    setNewProduct({
      name: '',
      imageUrl: '',
      price: 0,
      quantity: 0,
      sellingPrice: 0,
      unitCommission: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (from Facebook)</Label>
                <Input
                  id="imageUrl"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Cost Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitCommission">Unit Commission</Label>
                  <Input
                    id="unitCommission"
                    type="number"
                    value={newProduct.unitCommission}
                    onChange={(e) => setNewProduct({ ...newProduct, unitCommission: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Add Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <CardTitle>{product.name}</CardTitle>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-2">${product.price}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Selling:</span>
                    <span className="ml-2">${product.sellingPrice}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock:</span>
                    <span className="ml-2">{product.quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Commission:</span>
                    <span className="ml-2">${product.unitCommission}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}