'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSellerStore } from "@/store/seller-store";
import { useAdminStore } from "@/store/admin-store";
import { Search, Filter } from "lucide-react";

export default function AdminProductsPage() {
  const { sellers } = useAdminStore();
  const { products } = useSellerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBySeller, setFilterBySeller] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeller = filterBySeller === 'all' || product.sellerId === filterBySeller;
    return matchesSearch && matchesSeller;
  });

  const totalValue = filteredProducts.reduce(
    (sum, product) => sum + (product.quantity * product.sellingPrice),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Products Catalog</h2>
        <div className="flex gap-4">
          <Card className="p-2">
            <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </Card>
          <Card className="p-2">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="w-48">
          <select
            className="w-full border rounded-md h-10 px-3"
            value={filterBySeller}
            onChange={(e) => setFilterBySeller(e.target.value)}
          >
            <option value="all">All Sellers</option>
            {sellers.map(seller => (
              <option key={seller.id} value={seller.id}>
                {seller.companyName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const seller = sellers.find(s => s.id === product.sellerId);
                const totalValue = product.quantity * product.sellingPrice;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell>{seller?.companyName || 'Unknown'}</TableCell>
                    <TableCell className="text-right">${product.sellingPrice}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">${product.unitCommission}</TableCell>
                    <TableCell className="text-right">${totalValue.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}