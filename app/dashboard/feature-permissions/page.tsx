"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Check } from 'lucide-react';

interface PermissionItem {
  id: string;
  featureName: string;
  accountantAccess: boolean;
  staffAccess: boolean;
}

const initialPermissions: PermissionItem[] = [
{
  id: "1",
  featureName: "Dashboard",
  accountantAccess: true,
  staffAccess: true,
},
{
  id: "2",
  featureName: "Application Forms",
  accountantAccess: true,
  staffAccess: true,
},
{
  id: "3",
  featureName: "Service Entry",
  accountantAccess: true,
  staffAccess: true,
},
{
  id: "4",
  featureName: "Saved Bills",
  accountantAccess: true,
  staffAccess: true,
},
{
  id: "5",
  featureName: "Service Management",
  accountantAccess: false,
  staffAccess: false,
},
{
  id: "6",
  featureName: "Wallet Management",
  accountantAccess: true,
  staffAccess:false,
},
{
  id: "7",
  featureName: "Billed Services",
  accountantAccess: true,
  staffAccess:false,
},
{
  id: "8",
  featureName: "Transaction History",
  accountantAccess: true,
  staffAccess:false,
},
{
  id: "9",
  featureName: "Expenses",
  accountantAccess: true,
  staffAccess:false,
},
{
  id: "10",
  featureName: "Credit Details",
  accountantAccess: true,
  staffAccess:false,
},
{
  id: "11",
  featureName: "Staff Management",
  accountantAccess: false,
  staffAccess:false,
},
{
  id: "12",
  featureName: "Staff Performance",
  accountantAccess: false,
  staffAccess:false,
},
{
  id: "13",
  featureName: "Customer Details",
  accountantAccess: true,
  staffAccess:true,
},
{
  id: "14",
  featureName: "Quick Hub",
  accountantAccess: true,
  staffAccess:true,
},
{
  id: "15",
  featureName: "Feature Permissions",
  accountantAccess: false,
  staffAccess:false,
},
];

export default function FeaturePermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionItem[]>(initialPermissions);

  // Load saved permissions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('role_feature_permissions');
    if (saved) {
      try {
        setPermissions(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading permissions", e);
      }
    }
  }, []);

  const handleToggle = (id: string, roleType: 'accountantAccess' | 'staffAccess') => {
    const updated = permissions.map(item => {
      if (item.id === id) {
        return { ...item, [roleType]: !item[roleType] };
      }
      return item;
    });
    setPermissions(updated);
    localStorage.setItem('role_feature_permissions', JSON.stringify(updated));
  };

  const handleReset = () => {
    setPermissions(initialPermissions);
    localStorage.setItem('role_feature_permissions', JSON.stringify(initialPermissions));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Top Banner Box */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-6 text-white shadow-md flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Role Permissions</h1>
          <p className="text-teal-100 text-sm mt-1">Manage access to features for Staff and Accountants</p>
        </div>
        <button 
          onClick={handleReset}
          className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition flex items-center gap-2 text-sm font-medium backdrop-blur-sm cursor-pointer"
          title="Reset to default"
        >
          <RefreshCw size={18} />
          <span>Reset</span>
        </button>
      </div>

      {/* Permissions Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-800 text-base">Feature Access Control</h2>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {permissions.length} Features
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider bg-slate-50/30">
                <th className="p-4 font-semibold">Feature Name</th>
                <th className="p-4 font-semibold text-center w-48">Accountant Access</th>
                <th className="p-4 font-semibold text-center w-48">Staff Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 text-slate-700 font-medium text-sm">{item.featureName}</td>
                  
                  {/* Accountant Access Checkbox */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <div 
                        onClick={() => handleToggle(item.id, 'accountantAccess')}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                          item.accountantAccess 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {item.accountantAccess && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  </td>

                  {/* Staff Access Checkbox */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <div 
                        onClick={() => handleToggle(item.id, 'staffAccess')}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                          item.staffAccess 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                            : 'border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {item.staffAccess && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}