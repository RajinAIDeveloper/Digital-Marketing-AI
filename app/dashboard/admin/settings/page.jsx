'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Save, Trash, Mail, Edit, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    newSales: true,
    newProducts: false,
    commissionPayments: true,
    lowStock: true,
  });

  const [companySettings, setCompanySettings] = useState({
    companyName: 'Devmira',
    email: 'admin@devmira.com',
    phone: '+1234567890',
    address: '123 Business St',
    invoicePrefix: 'DEVM',
  });

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Staff',
    password: '',
  });

  const users = [
    { id: 1, name: 'Admin User', email: 'admin@devmira.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Staff Member', email: 'staff@devmira.com', role: 'Staff', status: 'Active' },
  ];

  const handleAddUser = (e) => {
    e.preventDefault();
    // Add user logic here
    setIsAddUserDialogOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'Staff',
      password: '',
    });
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Saving settings...', { companySettings, notificationSettings });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Company Settings</CardTitle>
            <CardDescription>
              Update your company information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings(prev => ({
                  ...prev,
                  companyName: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={companySettings.phone}
                onChange={(e) => setCompanySettings(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={companySettings.address}
                onChange={(e) => setCompanySettings(prev => ({
                  ...prev,
                  address: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Invoice Prefix</Label>
              <Input
                value={companySettings.invoicePrefix}
                onChange={(e) => setCompanySettings(prev => ({
                  ...prev,
                  invoicePrefix: e.target.value
                }))}
              />
            </div>
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure when you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Sales</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when a new sale is made
                </p>
              </div>
              <Switch
                checked={notificationSettings.newSales}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  newSales: checked
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Products</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when a seller adds new products
                </p>
              </div>
              <Switch
                checked={notificationSettings.newProducts}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  newProducts: checked
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Commission Payments</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about commission-related activities
                </p>
              </div>
              <Switch
                checked={notificationSettings.commissionPayments}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  commissionPayments: checked
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when products are running low
                </p>
              </div>
              <Switch
                checked={notificationSettings.lowStock}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  lowStock: checked
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage admin and staff accounts
                </CardDescription>
              </div>
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <select
                        className="w-full border rounded-md h-10 px-3"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Add User</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Lock className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        {user.role !== 'Admin' && (
                          <Button variant="ghost" size="sm">
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}