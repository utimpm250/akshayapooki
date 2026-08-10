"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Search, RotateCcw, ArrowUpRight, ArrowDownLeft, Calendar, RefreshCw, Trash2 } from 'lucide-react';

interface TransactionItem {
  id: string;
  dateTime: string; // e.g., "10-07-2026 12:40" or ISO format
  walletName: string;
  type: 'IN' | 'OUT' | 'UPDATE';
  amount: number;
  balanceAfter: number;
  description: string;
  staffName: string;
  billId?: string;
}

function TransactionHistoryContent() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // LocalStorage-ൽ നിന്ന് ഇടപാടുകൾ ലോഡ് ചെയ്യുക
  const loadTransactions = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('walletTransactions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setTransactions(parsed);
            return;
          }
        } catch (e) {
          console.error("Failed to parse transactions", e);
        }
      }
      setTransactions([]);
    }
  };

  // പഴയ എല്ലാ ഹിസ്റ്ററിയും ക്ലിയർ ചെയ്യാനുള്ള ഫങ്ഷൻ
  const clearAllHistory = () => {
    if (window.confirm("നിങ്ങൾക്ക് പഴയ എല്ലാ ട്രാൻസാക്ഷൻ ഹിസ്റ്ററിയും മായ്ച്ചു കളയണമോ?")) {
      localStorage.removeItem('walletTransactions');
      setTransactions([]);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    loadTransactions();
  }, []);

  // Search & Date Filter Logic
  const filteredTransactions = transactions.filter((tx) => {
    const query = searchQuery.toLowerCase();
    
    // Null-safe String Search
    const matchesSearch = 
      (tx.walletName || '').toLowerCase().includes(query) ||
      (tx.description || '').toLowerCase().includes(query) ||
      (tx.staffName || '').toLowerCase().includes(query) ||
      (tx.billId || '').toLowerCase().includes(query);

    let matchesDate = true;

    if (fromDate || toDate) {
      try {
        // Date String parsing guard
        const datePart = tx.dateTime ? tx.dateTime.split(' ')[0] : '';
        if (datePart) {
          const dateComponents = datePart.includes('-') ? datePart.split('-') : datePart.split('/');
          
          let year = 0, month = 0, day = 0;
          if (dateComponents[0].length === 4) {
            // YYYY-MM-DD
            [year, month, day] = dateComponents.map(Number);
          } else {
            // DD-MM-YYYY
            [day, month, year] = dateComponents.map(Number);
          }

          const txDate = new Date(year, month - 1, day);

          if (fromDate) {
            const start = new Date(fromDate);
            start.setHours(0, 0, 0, 0);
            if (txDate < start) matchesDate = false;
          }

          if (toDate) {
            const end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
            if (txDate > end) matchesDate = false;
          }
        }
      } catch (err) {
        console.error("Date parse error", err);
      }
    }

    return matchesSearch && matchesDate;
  });

  // Calculate Totals
  const totalIn = filteredTransactions
    .filter(t => t.type === 'IN')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalOut = filteredTransactions
    .filter(t => t.type === 'OUT')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  if (!isMounted) return null;

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] select-none space-y-5 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-4 font-sans sm:p-5 lg:p-6">
      
      {/* Green Header Banner */}
      <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-[0_22px_55px_rgba(15,23,42,0.18)] md:flex-row md:items-center sm:p-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Transaction History</h1>
          <p className="mt-1 text-xs font-medium text-cyan-100/75 sm:text-sm">
            Track all incoming and outgoing wallet transactions
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl md:flex-initial">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">TOTAL IN</p>
            <p className="text-2xl font-black mt-0.5">₹{totalIn.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl md:flex-initial">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">TOTAL OUT</p>
            <p className="text-2xl font-black mt-0.5">₹{totalOut.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl md:flex-row">
        
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by wallet, staff, description, or bill ID..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm font-semibold outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Inputs & Clear Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="date"
              className="cursor-pointer bg-transparent text-xs font-semibold text-slate-600 outline-none"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              className="cursor-pointer bg-transparent text-xs font-semibold text-slate-600 outline-none"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Reset Filters Button */}
          <button 
            onClick={() => {
              setSearchQuery('');
              setFromDate('');
              setToDate('');
              loadTransactions();
            }}
            title="Reset Filters & Refresh"
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50"
          >
            <RotateCcw size={18} />
          </button>

          {/* Clear All History Button */}
          <button 
            onClick={clearAllHistory}
            title="Clear All History"
            className="flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-xs font-black text-rose-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-rose-50"
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>

      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-4">Wallet</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Staff & Bill ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const dateParts = tx.dateTime ? tx.dateTime.split(' ') : ['-', ''];
                  const dateStr = dateParts[0];
                  const timeStr = dateParts.slice(1).join(' ');

                  return (
                    <tr key={tx.id} className="transition-all hover:bg-cyan-50/30">
                      <td className="px-6 py-4 font-black text-slate-800">
                        <div className="font-bold text-xs">{dateStr}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{timeStr}</div>
                      </td>

                      <td className="px-4 py-4 font-black text-slate-700">
                        {tx.walletName}
                      </td>

                      <td className="py-4 px-4">
                        {tx.type === 'OUT' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-black text-rose-600">
                            <ArrowUpRight size={13} /> OUT
                          </span>
                        )}
                        {tx.type === 'IN' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                            <ArrowDownLeft size={13} /> IN
                          </span>
                        )}
                        {tx.type === 'UPDATE' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">
                            <RefreshCw size={12} /> UPDATE
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-black text-slate-800">
                          ₹{(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Bal: ₹{(tx.balanceAfter || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      <td className="max-w-xs px-6 py-4 text-xs font-medium leading-relaxed text-slate-600">
                        {tx.description || '-'}
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <div className="font-bold text-slate-700">{tx.staffName || '-'}</div>
                        <div className="text-slate-400 mt-0.5">{tx.billId || '-'}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default function TransactionHistoryPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Loading history...</div>}>
      <TransactionHistoryContent />
    </Suspense>
  );
}