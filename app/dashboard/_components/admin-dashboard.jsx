import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Package, ActivitySquare } from "lucide-react";

export default function AdminDashboard() {
  // This would be connected to your Zustand store
  const stats = {
    totalSellers: "156",
    totalCommissions: "$45,678",
    totalProducts: "1,234",
    activeOperations: "89"
  };

  const statCards = [
    {
      title: "Total Sellers",
      value: stats.totalSellers,
      icon: Users,
      description: "Active sellers on platform"
    },
    {
      title: "Total Commissions",
      value: stats.totalCommissions,
      icon: DollarSign,
      description: "Earned this month"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Products across all sellers"
    },
    {
      title: "Active Operations",
      value: stats.activeOperations,
      icon: ActivitySquare,
      description: "Operations today"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      
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

      {/* Recent Seller Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Seller Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* We'll add recent activities here */}
            <p className="text-sm text-muted-foreground">
              Recent seller activities will appear here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Commission Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* We'll add commission overview here */}
            <p className="text-sm text-muted-foreground">
              Commission statistics and overview will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}