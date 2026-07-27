"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, Search, Calendar, RefreshCw, Download, 
  User, Phone, ChevronDown, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface CreditBill {
  id: string;
  billNumber?: string;
  customerName: string;
  mobileNumber: string;
  date: string;
  staffName: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  owedAmount: number;
}

export default function CreditDetailsPage() {
  const router = useRouter();
  const [bills, setBills] = useState<CreditBill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Role-based filtering ഉൾപ്പെടുത്തിയ useEffect
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : { username: 'Admin User', role: 'admin' };

    const savedBills = localStorage.getItem('smart_akshaya_bills');
    if (savedBills) {
      const parsed = JSON.parse(savedBills);
      let creditOnly = parsed.filter((b: any) => Number(b.owedAmount || 0) > 0);

      // അഡ്മിൻ അല്ലെങ്കിൽ സ്റ്റാഫിന്റെ പേര് മാത്രം ഫിൽട്ടർ ചെയ്യുക[cite: 2]
      if (currentUser.role.toLowerCase() !== 'admin') {
        creditOnly = creditOnly.filter(
          (b: any) => (b.staffName || '').toLowerCase() === currentUser.username.toLowerCase()
        );
      }

      setBills(creditOnly);
    } else {
      const defaultData: CreditBill[] = [
        {
          id: '1',
          billNumber: 'BILL-1001',
          customerName: 'irfan',
          mobileNumber: '8589868773',
          date: '2026-07-10',
          staffName: 'SAHLA',
          status: 'Credit',
          totalAmount: 2150,
          paidAmount: 0,
          owedAmount: 2150
        },
        {
          id: '2',
          billNumber: 'BILL-1002',
          customerName: 'sajad yoosu',
          mobileNumber: '5646546546',
          date: '2026-07-09',
          staffName: 'sajad staff',
          status: 'Credit',
          totalAmount: 500,
          paidAmount: 400,
          owedAmount: 100
        }
      ];

      let filteredDefault = defaultData;
      if (currentUser.role.toLowerCase() !== 'admin') {
        filteredDefault = defaultData.filter(
          (b) => b.staffName.toLowerCase() === currentUser.username.toLowerCase()
        );
      }

      setBills(filteredDefault);
      localStorage.setItem('smart_akshaya_bills', JSON.stringify(defaultData));
    }
  }, []);

  // Filter Logic
  const filteredBills = bills.filter((bill) => {
    const matchesSearch = 
      bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.mobileNumber.includes(searchQuery) ||
      bill.staffName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = 
      (!startDate || bill.date >= startDate) &&
      (!endDate || bill.date <= endDate);

    return matchesSearch && matchesDate;
  });

  const totalBalanceOwed = filteredBills.reduce((acc, b) => acc + b.owedAmount, 0);
  const uniqueCustomers = new Set(filteredBills.map(b => b.customerName.toLowerCase())).size;
  const totalCreditBookings = filteredBills.length;

  const handleSettleBill = (bill: CreditBill) => {
    router.push(`/dashboard/service-entry?resume=${bill.id}`);
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">Credit Details</h1>
              <p className="text-sm text-white/80 font-medium">All staff credit & partial-payment bills</p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-2xl text-right border border-white/20 flex-1 md:flex-initial">
              <p className="text-xs uppercase tracking-wider text-white/80 font-semibold">Balance Owed</p>
              <p className="text-xl font-extrabold">₹ {totalBalanceOwed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-2xl text-center border border-white/20 min-w-[100px]">
              <p className="text-xs uppercase tracking-wider text-white/80 font-semibold">Bookings</p>
              <p className="text-xl font-extrabold">{totalCreditBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Balance Owed</p>
            <h3 className="text-2xl font-black text-slate-800">₹ {totalBalanceOwed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-500 font-bold text-lg">₹</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Unique Customers</p>
            <h3 className="text-2xl font-black text-slate-800">{uniqueCustomers}</h3>
            <p className="text-xs text-slate-400 font-medium">with pending balance</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-500">
            <User size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Credit Bookings</p>
            <h3 className="text-2xl font-black text-slate-800">{totalCreditBookings}</h3>
            <p className="text-xs text-slate-400 font-medium">unpaid / partial</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <CreditCard size={22} />
          </div>
        </div>
      </div>

      {/* Filter & Main Card Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-slate-800">Credit & Partial Bills</h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setSearchQuery(''); setStartDate(''); setEndDate(''); }}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
              title="Reset Filters"
            >
              <RefreshCw size={18} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search customer, mobile, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div className="relative">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="relative">
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-2">
            <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none">
              <option>Presets</option>
            </select>
            <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none">
              <option>All Staff</option>
            </select>
          </div>
        </div>

        {/* Bill List */}
        <div className="space-y-3">
          {filteredBills.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-medium">
              No credit bills found.
            </div>
          ) : (
            filteredBills.map((bill) => (
              <div 
                key={bill.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-300 transition gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500 text-white font-bold flex items-center justify-center uppercase text-sm shadow-sm shrink-0">
                    {bill.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{bill.customerName}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><Phone size={12} /> {bill.mobileNumber}</span>
                      <span>•</span>
                      <span>{bill.date}</span>
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{bill.staffName}</span>
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">{bill.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">OWED</span>
                    <span className="text-base font-black text-red-500">₹{bill.owedAmount.toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => handleSettleBill(bill)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1 cursor-pointer"
                  >
                    Settle Bill
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}