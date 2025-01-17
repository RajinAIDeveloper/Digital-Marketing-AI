'use client';

import React from 'react';
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  History,
  DollarSign,
  Settings
} from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function DashboardShell({ 
  children,
  userType: initialUserType // Get initial userType from props
}) {
  const pathname = usePathname();
  const user = useAuthStore(state => state.user);
  console.log('user client from authstore', user);
  
  // Use either the store user type or initial user type
  const isAdmin = user?.userType === 'admin' || initialUserType === 'admin';

  
  const sellerNavItems = [
    {
      title: "Overview",
      href: "/dashboard/seller",
      icon: LayoutDashboard
    },
    {
      title: "Products",
      href: "/dashboard/seller/products",
      icon: ShoppingCart
    },
    {
      title: "Sales",
      href: "/dashboard/seller/sales",
      icon: FileText
    },
    {
      title: "History",
      href: "/dashboard/seller/history",
      icon: History
    },
    {
      title: "Commissions",
      href: "/dashboard/seller/commissions",
      icon: DollarSign
    }
  ];

  const adminNavItems = [
    {
      title: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard
    },
    {
      title: "All Products",
      href: "/dashboard/admin/products",
      icon: ShoppingCart
    },
    {
      title: "All Sales",
      href: "/dashboard/admin/sales",
      icon: FileText
    },
    {
      title: "User Operations",
      href: "/dashboard/admin/operations",
      icon: History
    },
    {
      title: "Commission Management",
      href: "/dashboard/admin/commissions",
      icon: DollarSign
    },
    {
      title: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings
    }
  ];

  const navItems = isAdmin ? adminNavItems : sellerNavItems;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white border-r shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b">
            <span className="text-xl font-bold">Devmira</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                        pathname === item.href ? "bg-gray-100 text-gray-900" : ""
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <UserButton afterSignOutUrl="/" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.fullName || 'Loading...'}</span>
                <span className="text-xs text-gray-500">{user?.companyName || ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            {isAdmin ? 'Admin Dashboard' : 'Seller Dashboard'}
          </h1>
          <div className="text-sm text-gray-500">
            Welcome back, {user?.fullName || 'User'}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}