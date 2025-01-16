'use client';

import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FileText } from "lucide-react";
import { useSellerStore } from "@/store/seller-store";

export default function SalesPage() {
  const { products, sales, addSale } = useSellerStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newSale, setNewSale] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    quantity: 1,
    paymentMethod: 'Bkash',
  });

  const handleAddSale = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const sale = {
      productId: selectedProduct,
      customerName: newSale.customerName,
      customerPhone: newSale.customerPhone,
      customerAddress: newSale.customerAddress,
      quantity: newSale.quantity,
      totalAmount: product.sellingPrice * newSale.quantity,
      commission: product.unitCommission * newSale.quantity,
      date: new Date().toISOString(),
      paymentMethod: newSale.paymentMethod,
    };

    addSale(sale);
    setIsAddDialogOpen(false);
    setNewSale({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      quantity: 1,
      paymentMethod: 'Bkash',
    });
    setSelectedProduct('');
  };

  const generateInvoice = (sale) => {
    const product = products.find(p => p.id === sale.productId);
    const invoiceData = {
      orderNo: `DEVM${sale.id}`,
      customerName: sale.customerName,
      address: sale.customerAddress,
      contactNumber: sale.customerPhone,
      items: [{
        name: product?.name,
        quantity: sale.quantity,
        price: product?.sellingPrice,
        total: sale.totalAmount
      }],
      paymentMethod: sale.paymentMethod,
      deliveryDetails: `Expected within 3-5 business days`
    };
    
    // You would typically generate a PDF here
    console.log('Invoice Data:', invoiceData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Sale</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.sellingPrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={newSale.customerName}
                  onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={newSale.customerPhone}
                  onChange={(e) => setNewSale({ ...newSale, customerPhone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={newSale.customerAddress}
                  onChange={(e) => setNewSale({ ...newSale, customerAddress: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newSale.quantity}
                    onChange={(e) => setNewSale({ ...newSale, quantity: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    value={newSale.paymentMethod}
                    onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bkash">Bkash</SelectItem>
                      <SelectItem value="Nagad">Nagad</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full">Create Sale</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sales.map((sale) => {
          const product = products.find(p => p.id === sale.productId);
          return (
            <Card key={sale.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order #{sale.id.slice(0, 8)}</CardTitle>
                <Button variant="outline" onClick={() => generateInvoice(sale)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Customer Details</p>
                    <p className="text-sm text-muted-foreground">{sale.customerName}</p>
                    <p className="text-sm text-muted-foreground">{sale.customerPhone}</p>
                    <p className="text-sm text-muted-foreground">{sale.customerAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order Details</p>
                    <p className="text-sm text-muted-foreground">Product: {product?.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {sale.quantity}</p>
                    <p className="text-sm text-muted-foreground">Total: ${sale.totalAmount}</p>
                    <p className="text-sm text-muted-foreground">Payment: {sale.paymentMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}