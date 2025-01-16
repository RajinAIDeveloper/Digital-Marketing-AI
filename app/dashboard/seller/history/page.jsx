'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSellerStore } from "@/store/seller-store";

export default function HistoryPage() {
  const { operations } = useSellerStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  };

  const getOperationIcon = (type) => {
    switch (type) {
      case 'product_add':
        return '➕';
      case 'product_update':
        return '📝';
      case 'product_delete':
        return '🗑️';
      case 'sale_create':
        return '💰';
      default:
        return '📋';
    }
  };

  const getOperationColor = (type) => {
    switch (type) {
      case 'product_add':
        return 'text-green-600';
      case 'product_update':
        return 'text-blue-600';
      case 'product_delete':
        return 'text-red-600';
      case 'sale_create':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Operation History</h2>
        <p className="text-muted-foreground">Track all your activities and operations.</p>
      </div>

      <div className="space-y-4">
        {operations.map((operation) => (
          <Card key={operation.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getOperationIcon(operation.type)}</span>
                  <CardTitle className={getOperationColor(operation.type)}>
                    {operation.type.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </CardTitle>
                </div>
                <CardDescription>
                  {formatDate(operation.timestamp)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{operation.description}</p>
            </CardContent>
          </Card>
        ))}

        {operations.length === 0 && (
          <Card>
            <CardContent className="text-center py-6 text-muted-foreground">
              No operations recorded yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}