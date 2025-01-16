'use client'
import React, { useState } from 'react';
import { Search, Download, CalendarIcon, Eye } from 'lucide-react';

const AdminSalesPage = () => {
  const [sellers] = useState([]);
  const [sales] = useState([]);
  const [products] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [selectedSale, setSelectedSale] = useState(null);

  const formatDate = (dateString, format = 'short') => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (format === 'ISO') {
      return date.toISOString().split('T')[0];
    }
    
    if (format === 'full') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const filteredSales = sales.filter(sale => {
    const product = products.find(p => p.id === sale.productId);
    const seller = sellers.find(s => s.id === product?.sellerId);
    
    const matchesSearch = 
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const withinDateRange = 
      (!dateRange.start || new Date(sale.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(sale.date) <= new Date(dateRange.end));
      
    return matchesSearch && withinDateRange;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalCommissions = filteredSales.reduce((sum, sale) => sum + sale.commission, 0);

  const exportSales = () => {
    const csvContent = [
      ['Date', 'Order ID', 'Customer', 'Product', 'Seller', 'Amount', 'Commission', 'Status'],
      ...filteredSales.map(sale => {
        const product = products.find(p => p.id === sale.productId);
        const seller = sellers.find(s => s.id === product?.sellerId);
        return [
          formatDate(sale.date, 'ISO'),
          sale.id,
          sale.customerName,
          product?.name,
          seller?.companyName,
          sale.totalAmount,
          sale.commission,
          sale.status
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${formatDate(new Date(), 'ISO')}.csv`;
    a.click();
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Sales Overview</h2>
        <div className="flex gap-4">
          <div className="p-2 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-white rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Commissions</p>
            <p className="text-2xl font-bold">${totalCommissions.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 p-2 border rounded-md"
          />
        </div>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          className="w-40 p-2 border rounded-md"
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          className="w-40 p-2 border rounded-md"
        />
        <button
          onClick={exportSales}
          className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">All Sales</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Order ID</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Seller</th>
                  <th className="text-right p-4">Amount</th>
                  <th className="text-right p-4">Commission</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => {
                  const product = products.find(p => p.id === sale.productId);
                  const seller = sellers.find(s => s.id === product?.sellerId);

                  return (
                    <tr key={sale.id} className="border-b">
                      <td className="p-4">{formatDate(sale.date)}</td>
                      <td className="p-4">#{sale.id.slice(0, 8)}</td>
                      <td className="p-4">{sale.customerName}</td>
                      <td className="p-4">{product?.name}</td>
                      <td className="p-4">{seller?.companyName}</td>
                      <td className="p-4 text-right">${sale.totalAmount}</td>
                      <td className="p-4 text-right">${sale.commission}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClassName(sale.status)}`}>
                          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedSale({ ...sale, product, seller })}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredSales.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-500 py-10">
                      No sales found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sale Details</h3>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Customer Details</h4>
                  <p className="text-sm text-gray-600">
                    {selectedSale.customerName}<br />
                    {selectedSale.customerPhone}<br />
                    {selectedSale.customerAddress}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Order Details</h4>
                  <p className="text-sm text-gray-600">
                    Order #{selectedSale.id.slice(0, 8)}<br />
                    {formatDate(selectedSale.date, 'full')}<br />
                    Status: {selectedSale.status}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Product Details</h4>
                <p className="text-sm text-gray-600">
                  {selectedSale.product?.name}<br />
                  Quantity: {selectedSale.quantity}<br />
                  Price: ${selectedSale.product?.sellingPrice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSalesPage;