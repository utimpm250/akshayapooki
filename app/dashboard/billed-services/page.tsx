"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Briefcase, ChevronDown, ChevronUp, 
  Pencil, Trash2, Calendar, RefreshCw
} from "lucide-react";

interface BilledServiceItem {
  id: string;
  dateTime: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  quantity: number;
  totalAmount: number;
  receivedAmount: number;
  cashReceived: number;
  gpayAmount: number;
  pendingAmount: number;
  staffName: string;
  status: 'completed' | 'pending';
}

export default function BilledServicesPage() {
  const [services, setServices] = useState<BilledServiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // localStorage-ൽ നിന്ന് ലൈവ് ഡാറ്റ വായിക്കുന്നു
  const loadBilledData = () => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('serviceEntries') || 
                        localStorage.getItem('savedBills') || 
                        localStorage.getItem('billedServicesData');

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed)) {
            const formattedEntries = parsed.map((item: any, index: number) => ({
              id: item.id || `entry-${index}-${Date.now()}`,
              dateTime: item.dateTime || item.date || new Date().toLocaleString(),
              customerName: item.customerName || item.name || 'Customer',
              customerPhone: item.customerPhone || item.phone || item.mobile || 'N/A',
              serviceName: item.serviceName || item.service || 'Service',
              quantity: Number(item.quantity) || 1,
              totalAmount: Number(item.totalAmount) || Number(item.total) || 0,
              receivedAmount: Number(item.receivedAmount) || Number(item.received) || 0,
              cashReceived: Number(item.cashReceived) || 0,
              gpayAmount: Number(item.gpayAmount) || Number(item.gpay) || 0,
              pendingAmount: Number(item.pendingAmount) || Number(item.balance) || 0,
              staffName: item.staffName || item.staff || 'Admin',
              status: item.status || 'completed'
            }));
            setServices(formattedEntries);
          } else {
            setServices([]);
          }
        } catch (e) {
          console.error("Error parsing entries", e);
          setServices([]);
        }
      } else {
        setServices([]);
      }
    }
  };

  useEffect(() => {
    loadBilledData();
  }, []);

  // ഡിലീറ്റ് ഫങ്ക്ഷൻ
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);

      if (typeof window !== 'undefined') {
        const jsonVal = JSON.stringify(updated);
        localStorage.setItem('serviceEntries', jsonVal);
        localStorage.setItem('savedBills', jsonVal);
        localStorage.setItem('billedServicesData', jsonVal);
      }
    }
  };

  // Summary Calculations
  const totalRevenue = services.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalReceived = services.reduce((sum, s) => sum + Math.abs(s.receivedAmount), 0);
  const totalPending = services.reduce((sum, s) => sum + s.pendingAmount, 0);
  const completedCount = services.filter(s => s.status === 'completed').length;

  const filteredServices = services.filter(s => {
    return s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.customerPhone.includes(searchTerm) ||
           s.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Billed Services</h1>
        <button onClick={loadBilledData} className="text-slate-500 hover:text-slate-700 transition flex items-center gap-1.5 text-xs font-semibold bg-white border px-3 py-1.5 rounded-lg shadow-xs">
          <RefreshCw size={14} /> Sync Data
        </button>
      </div>

      {/* TOP BLUE BANNER */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">TOTAL REVENUE</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">₹{totalRevenue.toFixed(2)}</h2>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">RECEIVED</p>
            <p className="text-xl font-bold mt-1">₹{totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">PENDING</p>
            <p className="text-xl font-bold mt-1">₹{totalPending.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-blue-500/50 border border-blue-400/30 rounded-xl px-5 py-3 flex items-center gap-3">
          <div className="p-2 bg-blue-400/30 rounded-lg">
            <Briefcase size={22} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-black leading-none">{completedCount}</p>
            <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider mt-1">COMPLETED SERVICES</p>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-800">Service Entries</h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 bg-white text-xs w-full sm:w-64 focus-within:ring-2 focus-within:ring-blue-500 shadow-xs">
            <Search size={16} className="text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search name, mobile, service..." 
              className="bg-transparent outline-none w-full text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-xs text-slate-500 shadow-xs">
            <Calendar size={14} className="text-slate-400" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="outline-none bg-transparent" />
            <span>→</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="outline-none bg-transparent" />
          </div>

          <button onClick={() => alert("Exporting...")} className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="hidden md:grid grid-cols-12 bg-slate-50/80 border-b border-slate-200 py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">DATE / TIME</div>
          <div className="col-span-3">CUSTOMER</div>
          <div className="col-span-3">SERVICES</div>
          <div className="col-span-1 text-right">TOTAL</div>
          <div className="col-span-1 text-right">RECEIVED</div>
          <div className="col-span-1 text-center">STATUS</div>
          <div className="col-span-1 text-right">ACTIONS</div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No billed services found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredServices.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <div key={item.id} className="transition">
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center py-4 px-6 text-xs text-slate-700 gap-2 md:gap-0">
                    <div className="col-span-2 text-slate-500 font-medium">{item.dateTime}</div>
                    <div className="col-span-3">
                      <p className="font-bold text-slate-800">{item.customerName}</p>
                      <p className="text-[11px] text-slate-400">📞 {item.customerPhone}</p>
                    </div>
                    <div className="col-span-3 font-medium text-slate-700">{item.quantity}x {item.serviceName}</div>
                    <div className="col-span-1 text-right font-bold text-slate-800">₹{item.totalAmount.toFixed(2)}</div>
                    <div className="col-span-1 text-right font-bold text-emerald-600">₹{item.receivedAmount.toFixed(2)}</div>
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {item.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-2.5 py-1 rounded-lg transition flex items-center gap-1 text-[11px]">
                        {isExpanded ? <>Hide <ChevronUp size={12} /></> : <>View <ChevronDown size={12} /></>}
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-slate-50/50 border-t border-b border-slate-100 p-5 mx-4 my-2 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-2 border-r-0 md:border-r border-slate-200 pr-0 md:pr-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">TRANSACTION DETAILS</p>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Cash Received:</span>
                          <span className="font-bold text-slate-800">₹{item.cashReceived.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">GPay/UPI:</span>
                          <span className="font-bold text-slate-800">₹{item.gpayAmount.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                          <span className="text-slate-500">Pending Balance:</span>
                          <span className="font-bold text-emerald-600">₹{item.pendingAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SERVICE DESCRIPTION</p>
                        <div className="bg-slate-100/70 rounded-lg p-3 text-slate-700 font-medium">{item.quantity}x {item.serviceName}</div>
                        <div className="flex items-center gap-6 text-slate-500 text-[11px] pt-1">
                          <span>Staff: <strong className="text-slate-700">{item.staffName}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}