import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function SellerDashboard() {
  // This would be connected to your Zustand store
  const stats = {
    totalSales: "12,345",
    activeProducts: "48",
    pendingCommissions: "$1,234",
    monthlyGrowth: "12.5%"
  };

  const statCards = [
    {
      title: "Total Sales",
      value: stats.totalSales,
      icon: DollarSign,
      description: "Total sales this month"
    },
    {
      title: "Active Products",
      value: stats.activeProducts,
      icon: Package,
      description: "Products in your catalog"
    },
    {
      title: "Pending Commissions",
      value: stats.pendingCommissions,
      icon: ShoppingCart,
      description: "Commissions to be paid"
    },
    {
      title: "Monthly Growth",
      value: stats.monthlyGrowth,
      icon: TrendingUp,
      description: "Compared to last month"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* We'll add recent activities here */}
            <p className="text-sm text-muted-foreground">
              Your recent activities will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
