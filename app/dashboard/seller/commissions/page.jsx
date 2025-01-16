'use client';

import React from 'react';
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
import { useSellerStore } from "@/store/seller-store";

export default function CommissionsPage() {
  const { sales, products } = useSellerStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };

  const totalCommission = sales.reduce((acc, sale) => acc + sale.commission, 0);
  const paidCommission = 0; // This would come from your backend
  const pendingCommission = totalCommission - paidCommission;

  const commissionByProduct = products.map(product => {
    const productSales = sales.filter(sale => sale.productId === product.id);
    const totalCommission = productSales.reduce((acc, sale) => acc + sale.commission, 0);
    const totalSales = productSales.length;
    
    return {
      productId: product.id,
      productName: product.name,
      totalSales,
      totalCommission,
    };
  }).filter(item => item.totalSales > 0);

  // Get recent commission transactions
  const recentTransactions = sales.map(sale => {
    const product = products.find(p => p.id === sale.productId);
    return {
      id: sale.id,
      date: sale.date,
      productName: product?.name || 'Unknown Product',
      commission: sale.commission,
      status: 'Pending' // This would normally come from your backend
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Commissions</h2>
        <p className="text-muted-foreground">Track your commission earnings and payments.</p>
      </div>

      {/* Commission Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommission.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${paidCommission.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingCommission.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Commission by Product */}
      <Card>
        <CardHeader>
          <CardTitle>Commission by Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Total Sales</TableHead>
                <TableHead className="text-right">Total Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionByProduct.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-center">{item.totalSales}</TableCell>
                  <TableCell className="text-right">${item.totalCommission.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {commissionByProduct.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No commission data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Commission Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.productName}</TableCell>
                  <TableCell className="text-right">${transaction.commission.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {recentTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No recent transactions
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