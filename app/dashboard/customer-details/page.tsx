"use client";

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, User, Phone, Mail, MapPin, FileText, X } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  remarks: string;
  totalPaid: number;
  gpayPaid: number;
  cashPaid: number;
  balance: number;
}

export function CustomerDetailsPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const loadCustomerDataFromEntries = () => {
    const savedBills = JSON.parse(localStorage.getItem('savedBillsList') || '[]');
    const customerMap: { [key: string]: CustomerRecord } = {};

    // Only load records that have proper customer name and mobile number
    savedBills.forEach((bill: any) => {
      const name = bill.customerName ? bill.customerName.trim() : '';
      const mobile = bill.mobile ? bill.mobile.trim() : '';

      // Skip entries without name or mobile, or generic Walk-in if preferred (keeping valid names/numbers)
      if (name && mobile && name.toLowerCase() !== 'walk-in') {
        const key = `${mobile}-${name.toLowerCase()}`;
        
        if (!customerMap[key]) {
          customerMap[key] = {
            id: 'CUST-' + Math.random(),
            name: name,
            mobile: mobile,
            email: 'Not provided',
            address: 'Not provided',
            remarks: 'Auto-added via Service Entry',
            totalPaid: 0,
            gpayPaid: 0,
            cashPaid: 0,
            balance: 0
          };
        }

        customerMap[key].balance -= Number(bill.totalAmount || 0);
      }
    });

    // Also check if any manually managed customers exist in localStorage
    const storedCustomers = localStorage.getItem('managedCustomers');
    if (storedCustomers) {
      try {
        const parsed = JSON.parse(storedCustomers);
        parsed.forEach((c: any) => {
          if (c.name && c.mobile && c.name.toLowerCase() !== 'walk-in') {
            const key = `${c.mobile}-${c.name.toLowerCase()}`;
            if (!customerMap[key]) {
              customerMap[key] = c;
            }
          }
        });
      } catch (e) {
        console.error("Error parsing managedCustomers", e);
      }
    }

    const finalCustomerList = Object.values(customerMap);
    setCustomers(finalCustomerList);
    localStorage.setItem('managedCustomers', JSON.stringify(finalCustomerList));
  };

  useEffect(() => {
    loadCustomerDataFromEntries();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.mobile.includes(searchQuery)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-slate-800 bg-[#f8fafc] min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wide">Customer Details</h1>
          <p className="text-xs text-emerald-100 mt-1">Manage customer profiles and track financial balances</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 flex items-center gap-2 w-full md:w-72">
            <Search size={16} className="text-emerald-100" />
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-transparent outline-none text-xs text-white placeholder:text-emerald-200 w-full font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={loadCustomerDataFromEntries}
            className="bg-white/10 hover:bg-white/20 border border-white/20 p-2.5 rounded-2xl transition text-white"
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Customer Roster Table Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-800 text-base">Customer Roster</h3>
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
            {customers.length} customers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Total Paid</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs font-medium">
                    No customers found. Add entries with name and mobile number from Service Entry.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const initialLetter = cust.name ? cust.name.charAt(0).toUpperCase() : 'C';
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition font-medium">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          {initialLetter}
                        </span>
                        <span className="text-slate-800 font-bold">{cust.name}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-mono text-xs">{cust.mobile}</td>
                      <td className="py-4 px-4 text-slate-400 text-xs">{cust.email || '-'}</td>
                      <td className="py-4 px-4 text-slate-400 text-xs">{cust.address || '-'}</td>
                      <td className="py-4 px-4 text-slate-700 font-bold">₹{cust.totalPaid.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cust.balance < 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                          ₹{cust.balance.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6 border border-slate-100 relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">Customer Profile</h3>
                  <p className="text-[11px] text-slate-400">Detailed overview and financial summary</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-xl transition">
                <X size={16} />
              </button>
            </div>

            <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 space-y-3">
              <h4 className="font-black text-slate-800 text-base">{selectedCustomer.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Mobile Number</p>
                    <p className="font-bold text-slate-700 font-mono">{selectedCustomer.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Email Address</p>
                    <p className="font-medium text-slate-700">{selectedCustomer.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Financial Summary</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-slate-200 rounded-2xl p-3 bg-white">
                  <p className="text-[9px] font-bold uppercase text-slate-400">Total Paid</p>
                  <p className="text-base font-black text-slate-800 mt-1">₹{selectedCustomer.totalPaid.toFixed(2)}</p>
                </div>
                <div className="border border-slate-200 rounded-2xl p-3 bg-white">
                  <p className="text-[9px] font-bold uppercase text-slate-400">GPay/UPI</p>
                  <p className="text-base font-black text-slate-800 mt-1">₹{selectedCustomer.gpayPaid.toFixed(2)}</p>
                </div>
                <div className="border border-slate-200 rounded-2xl p-3 bg-white">
                  <p className="text-[9px] font-bold uppercase text-slate-400">Cash</p>
                  <p className="text-base font-black text-slate-800 mt-1">₹{selectedCustomer.cashPaid.toFixed(2)}</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${selectedCustomer.balance < 0 ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">Balance</p>
                <p className={`text-xl font-black mt-0.5 ${selectedCustomer.balance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ₹{selectedCustomer.balance.toFixed(2)}
                </p>
              </div>
            </div>

            <button onClick={() => setSelectedCustomer(null)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition text-xs shadow-md">
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDetailsPage;