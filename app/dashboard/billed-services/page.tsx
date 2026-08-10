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
    <div className="mx-auto min-h-screen w-full max-w-[1500px] space-y-5 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-4 sm:p-5 lg:p-6">
      
      {/* Page Header */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:flex-row sm:items-center">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Billed Services</h1>
        <button onClick={loadBilledData} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700">
          <RefreshCw size={14} /> Sync Data
        </button>
      </div>

      {/* TOP BLUE BANNER */}
      <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-[0_22px_55px_rgba(15,23,42,0.2)] md:flex-row md:items-center md:p-8">
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">TOTAL REVENUE</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">₹{totalRevenue.toFixed(2)}</h2>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">RECEIVED</p>
            <p className="text-xl font-bold mt-1">₹{totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">PENDING</p>
            <p className="text-xl font-bold mt-1">₹{totalPending.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
          <div className="rounded-xl border border-white/10 bg-white/10 p-2.5">
            <Briefcase size={22} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-black leading-none">{completedCount}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-cyan-200">COMPLETED SERVICES</p>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-xl lg:flex-row lg:items-center">
        <h2 className="text-lg font-black tracking-tight text-slate-800">Service Entries</h2>

        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
          <div className="flex w-full items-center rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs shadow-sm transition-all focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10 sm:w-72">
            <Search size={16} className="text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search name, mobile, service..." 
              className="w-full bg-transparent font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500 shadow-sm">
            <Calendar size={14} className="text-slate-400" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="outline-none bg-transparent" />
            <span>→</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="outline-none bg-transparent" />
          </div>

          <button onClick={() => alert("Exporting...")} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50/40">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <div className="hidden grid-cols-12 border-b border-slate-200 bg-slate-50/80 px-6 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 md:grid">
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
                  <div className="grid grid-cols-1 items-center gap-2 px-5 py-4 text-xs text-slate-700 transition-all hover:bg-cyan-50/25 md:grid-cols-12 md:gap-0 md:px-6">
                    <div className="col-span-2 text-slate-500 font-medium">{item.dateTime}</div>
                    <div className="col-span-3">
                      <p className="font-black text-slate-800">{item.customerName}</p>
                      <p className="text-[11px] text-slate-400">📞 {item.customerPhone}</p>
                    </div>
                    <div className="col-span-3 font-medium text-slate-700">{item.quantity}x {item.serviceName}</div>
                    <div className="col-span-1 text-right font-black text-slate-800">₹{item.totalAmount.toFixed(2)}</div>
                    <div className="col-span-1 text-right font-black text-emerald-600">₹{item.receivedAmount.toFixed(2)}</div>
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                        {item.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-black text-slate-600 transition-all hover:bg-cyan-50 hover:text-cyan-700">
                        {isExpanded ? <>Hide <ChevronUp size={12} /></> : <>View <ChevronDown size={12} /></>}
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-xl p-1.5 text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-700">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mx-4 my-2 grid grid-cols-1 gap-6 rounded-2xl border border-cyan-100 bg-gradient-to-br from-slate-50 to-cyan-50/40 p-5 text-xs shadow-sm md:grid-cols-2">
                      <div className="space-y-2 border-r-0 md:border-r border-slate-200 pr-0 md:pr-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">TRANSACTION DETAILS</p>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Cash Received:</span>
                          <span className="font-black text-slate-800">₹{item.cashReceived.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">GPay/UPI:</span>
                          <span className="font-black text-slate-800">₹{item.gpayAmount.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                          <span className="text-slate-500">Pending Balance:</span>
                          <span className="font-bold text-emerald-600">₹{item.pendingAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SERVICE DESCRIPTION</p>
                        <div className="rounded-xl border border-slate-200 bg-white/80 p-3 font-semibold text-slate-700">{item.quantity}x {item.serviceName}</div>
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