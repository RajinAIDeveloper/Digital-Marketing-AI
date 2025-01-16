'use client'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSellerStore } from "@/store/seller-store";
import { useAdminStore } from "@/store/admin-store";
import { Search, DollarSign } from "lucide-react";

const formatDate = (date) => {
  const d = new Date(date);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export default function AdminCommissionsPage() {
  const { sellers } = useAdminStore();
  const { sales, products } = useSellerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Calculate commission summaries per seller
  const sellerCommissions = sellers.map(seller => {
    const sellerProducts = products.filter(p => p.sellerId === seller.id);
    const sellerSales = sales.filter(sale => 
      sellerProducts.some(p => p.id === sale.productId)
    );

    const totalCommission = sellerSales.reduce((sum, sale) => sum + sale.commission, 0);
    const paidCommission = 0; // This would come from your backend
    const pendingCommission = totalCommission - paidCommission;
    const totalSales = sellerSales.length;

    return {
      ...seller,
      totalCommission,
      paidCommission,
      pendingCommission,
      totalSales,
    };
  });

  const filteredSellers = sellerCommissions.filter(seller =>
    seller.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Commission Management</h2>
          <p className="text-muted-foreground">Manage and track seller commissions</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-2">
            <p className="text-sm text-muted-foreground">Total Pending Commissions</p>
            <p className="text-2xl font-bold">
              ${sellerCommissions.reduce((sum, seller) => sum + seller.pendingCommission, 0).toLocaleString()}
            </p>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Sellers Commission Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead className="text-right">Total Commission</TableHead>
                <TableHead className="text-right">Paid Commission</TableHead>
                <TableHead className="text-right">Pending Commission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{seller.companyName}</p>
                      <p className="text-sm text-muted-foreground">{seller.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{seller.totalSales}</TableCell>
                  <TableCell className="text-right">${seller.totalCommission.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${seller.paidCommission.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${seller.pendingCommission.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedSeller(seller)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Pay Commission
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pay Commission - {seller.companyName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Pending Commission</p>
                            <p className="text-2xl font-bold">${seller.pendingCommission.toLocaleString()}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Amount</label>
                            <Input type="number" max={seller.pendingCommission} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Method</label>
                            <select className="w-full border rounded-md h-10 px-3">
                              <option value="bank">Bank Transfer</option>
                              <option value="cash">Cash</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <Button className="w-full">Process Payment</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commission Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  No recent commission payments
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}