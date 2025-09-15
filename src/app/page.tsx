'use client';

import React, { useState, useEffect } from 'react';
import { SheetClient } from '../lib/sheet-client';

interface SheetRow {
  Name: string;
  Email: string;
  Status: string;
  Created Date: string;
  _id: string;
  _rowIndex: number;
}

export default function App() {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [newRow, setNewRow] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const client = new SheetClient();
      const result = await client.getAllData();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async () => {
    try {
      const client = new SheetClient();
      const result = await client.addRow(newRow);

      if (result.success) {
        setNewRow({});
        await loadData(); // Refresh data
      } else {
        setError(result.error || 'Failed to add row');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add row');
    }
  };

  const handleUpdateField = async (rowId: string, field: string, newValue: string) => {
    try {
      const client = new SheetClient();
      const result = await client.updateField({
        identifier: rowId,
        field: field,
        newValue: newValue
      });

      if (result.success) {
        await loadData(); // Refresh data
      } else {
        setError(result.error || 'Failed to update field');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update field');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Test Contact Manager...</h2>
          <p className="text-gray-600">Connecting to Google Sheets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Test Contact Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A test contact management app for Render deployment
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>📊 {data.length} records</span>
            <span>🔄 Live sync enabled</span>
            <span>🚀 Powered by SheetApps</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Add New Row Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newRow['Name'] || ''}
                onChange={(e) => setNewRow(prev => ({ ...prev, 'Name': e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                value={newRow['Email'] || ''}
                onChange={(e) => setNewRow(prev => ({ ...prev, 'Email': e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <input
                type="text"
                value={newRow['Status'] || ''}
                onChange={(e) => setNewRow(prev => ({ ...prev, 'Status': e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter status"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created Date
              </label>
              <input
                type="text"
                value={newRow['Created Date'] || ''}
                onChange={(e) => setNewRow(prev => ({ ...prev, 'Created Date': e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter created date"
              />
            </div>
            
          </div>
          <button
            onClick={handleAddRow}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Add Record
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Data Records</h2>
          </div>

          {data.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
              <p className="text-gray-600">Add your first record using the form above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={row._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || '';
                            if (newValue !== row['Name']) {
                              handleUpdateField(row._id, 'Name', newValue);
                            }
                          }}
                          className="hover:bg-blue-50 px-2 py-1 rounded cursor-text"
                        >
                          {row['Name']}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || '';
                            if (newValue !== row['Email']) {
                              handleUpdateField(row._id, 'Email', newValue);
                            }
                          }}
                          className="hover:bg-blue-50 px-2 py-1 rounded cursor-text"
                        >
                          {row['Email']}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || '';
                            if (newValue !== row['Status']) {
                              handleUpdateField(row._id, 'Status', newValue);
                            }
                          }}
                          className="hover:bg-blue-50 px-2 py-1 rounded cursor-text"
                        >
                          {row['Status']}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || '';
                            if (newValue !== row['Created Date']) {
                              handleUpdateField(row._id, 'Created Date', newValue);
                            }
                          }}
                          className="hover:bg-blue-50 px-2 py-1 rounded cursor-text"
                        >
                          {row['Created Date']}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Row {row._rowIndex}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Built with ❤️ by <strong>SheetApps</strong> •
            <a href="https://sheetapps.com" className="text-blue-600 hover:text-blue-800 ml-1">
              Create your own app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}