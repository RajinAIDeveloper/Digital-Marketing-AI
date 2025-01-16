import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { ShoppingCart, BarChart, FileText, DollarSign } from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      title: "Product Management",
      description: "Easily upload and manage your products with Facebook image integration, track inventory, and set pricing.",
      icon: <ShoppingCart className="h-6 w-6 text-primary" />
    },
    {
      title: "Sales Analytics",
      description: "Monitor your sales performance with real-time analytics and insights to grow your business.",
      icon: <BarChart className="h-6 w-6 text-primary" />
    },
    {
      title: "Automated Invoicing",
      description: "Generate professional invoices automatically for every sale with detailed tracking.",
      icon: <FileText className="h-6 w-6 text-primary" />
    },
    {
      title: "Commission Management",
      description: "Transparent commission tracking and automated calculations for hassle-free payments.",
      icon: <DollarSign className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Grow Your Business with Devmira's Seller Dashboard
              <UserButton/>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A powerful platform for local sellers to manage products, track sales, and grow their business with automated tools.
            </p>
            <SignInButton mode="modal">
              <Button size="lg" className="font-semibold">
                Get Started
              </Button>
            </SignInButton>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Devmira today and get access to powerful tools designed to help you sell more effectively.
          </p>
          <SignInButton mode="modal">
            <Button size="lg" className="font-semibold">
              Start Selling Now
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;