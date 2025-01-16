'use client'
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const AdminOperationsPage = () => {
  const [operations] = useState([]);
  const [sellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

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
      case 'commission_paid':
        return '💸';
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
      case 'commission_paid':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date, format) => {
    const d = new Date(date);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (format === 'MMMM d, yyyy') {
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
    
    if (format === 'HH:mm') {
      return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    }
    
    return d.toISOString().split('T')[0]; // 'yyyy-MM-dd'
  };

  const filteredOperations = operations.filter(operation => {
    const matchesSearch = operation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || operation.type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Group operations by date
  const groupedOperations = filteredOperations.reduce((groups, operation) => {
    const date = formatDate(operation.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(operation);
    return groups;
  }, {});

  const operationTypes = [
    { value: 'all', label: 'All Operations' },
    { value: 'product_add', label: 'Product Addition' },
    { value: 'product_update', label: 'Product Update' },
    { value: 'product_delete', label: 'Product Deletion' },
    { value: 'sale_create', label: 'Sale Creation' },
    { value: 'commission_paid', label: 'Commission Payment' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Operations Log</h2>
        <p className="text-gray-600">Track all user activities and system operations</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 p-2 border rounded-md"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-48 p-2 border rounded-md bg-white"
        >
          {operationTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Operations Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedOperations).map(([date, dateOperations]) => (
          <div key={date} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">
              {formatDate(date, 'MMMM d, yyyy')}
            </h3>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 space-y-4">
                {dateOperations.map((operation) => {
                  const seller = sellers.find(s => s.id === operation.userId);
                  
                  return (
                    <div
                      key={operation.id}
                      className="flex items-start gap-4 border-b last:border-b-0 pb-4 last:pb-0"
                    >
                      <div className="text-2xl">{getOperationIcon(operation.type)}</div>
                      <div className="flex-1 space-y-1">
                        <p className={`font-medium ${getOperationColor(operation.type)}`}>
                          {operation.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {operation.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{seller?.companyName || 'Unknown Seller'}</span>
                          <span>•</span>
                          <span>{formatDate(operation.timestamp, 'HH:mm')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {filteredOperations.length === 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 text-center text-gray-600">
              No operations found matching your criteria
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-600">
              Total Operations Today
            </h3>
            <div className="text-2xl font-bold mt-2">
              {filteredOperations.filter(op => 
                formatDate(op.timestamp) === formatDate(new Date())
              ).length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-600">
              Most Active Seller
            </h3>
            <div className="text-2xl font-bold mt-2">
              {(() => {
                const sellerCounts = filteredOperations.reduce((acc, op) => {
                  acc[op.userId] = (acc[op.userId] || 0) + 1;
                  return acc;
                }, {});

                const mostActiveSellerId = Object.entries(sellerCounts)
                  .sort(([, a], [, b]) => b - a)[0]?.[0];

                const mostActiveSeller = sellers.find(s => s.id === mostActiveSellerId);

                return mostActiveSeller?.companyName || 'N/A';
              })()}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-600">
              Most Common Operation
            </h3>
            <div className="text-2xl font-bold mt-2">
              {(() => {
                const typeCounts = filteredOperations.reduce((acc, op) => {
                  acc[op.type] = (acc[op.type] || 0) + 1;
                  return acc;
                }, {});

                const mostCommonType = Object.entries(typeCounts)
                  .sort(([, a], [, b]) => b - a)[0]?.[0];

                return mostCommonType
                  ? mostCommonType.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                  : 'N/A';
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOperationsPage;