"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, RefreshCw, ChevronDown, 
  User, Clock, Smartphone, Calendar 
} from 'lucide-react';

interface SavedBill {
  id: string;
  customerName: string;
  mobile: string;
  date: string;
  staffName: string;
  pendingCount: string;
  amount: number;
}

export default function SavedBillsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedBills, setSavedBills] = useState<SavedBill[]>([]);

  // LocalStorage-ൽ നിന്ന് ഡാറ്റ എടുക്കുന്ന ഫങ്ക്ഷൻ (Role-based filtering ഉൾപ്പെടുത്തി)
  const fetchBills = () => {
    if (typeof window !== 'undefined') {
      // നിലവിൽ ലോഗിൻ ചെയ്ത യൂസറെ കണ്ടെത്തുക
      const storedUser = localStorage.getItem('loggedInUser');
      const currentUser = storedUser ? JSON.parse(storedUser) : { username: 'Admin User', role: 'admin' };

      const data = localStorage.getItem('savedBills');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            let billsList = parsed.map((item: any, index: number) => ({
              id: item.id || `bill-${index}-${Date.now()}`,
              customerName: item.customerName || item.name || 'Customer',
              mobile: item.mobile || item.customerPhone || 'N/A',
              date: item.date || item.dateTime || new Date().toLocaleDateString(),
              staffName: item.staffName || item.staff || 'Admin User',
              pendingCount: item.pendingCount || 'Pending',
              amount: Number(item.amount || item.totalAmount || 0)
            }));

            // അഡ്മിൻ അല്ലെങ്കില്‍, സ്റ്റാഫിന്റെ പേര് വെച്ച് മാത്രം ഫിൽട്ടർ ചെയ്യുക
            if (currentUser.role.toLowerCase() !== 'admin') {
              billsList = billsList.filter(
                (bill: SavedBill) => bill.staffName.toLowerCase() === currentUser.username.toLowerCase()
              );
            }

            setSavedBills(billsList);
          } else {
            setSavedBills([]);
          }
        } catch (e) {
          console.error("Error parsing saved bills", e);
          setSavedBills([]);
        }
      } else {
        setSavedBills([]);
      }
    }
  };

  // പേജ് ലോഡ് ആകുമ്പോൾ ഡാറ്റ ഫെച്ച് ചെയ്യുന്നു
  useEffect(() => {
    fetchBills();
  }, []);

  // റിഫ്രഷ് ബട്ടൺ ലോജിക്
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBills();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // ഫിൽറ്റർ ലോജിക്
  const filteredBills = savedBills.filter(bill => 
    bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.mobile.includes(searchQuery) ||
    bill.staffName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-4 sm:p-5 lg:p-6">
      
      <div className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-5 text-white shadow-[0_20px_55px_rgba(15,23,42,0.18)] sm:flex-row sm:items-center sm:p-6">
        <div>
          <h3 className="text-2xl font-black tracking-tight sm:text-3xl">Saved Bills</h3>
          <p className="mt-1.5 text-xs font-medium tracking-wide text-cyan-100/80">
            Bills waiting for final processing
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-black backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/15 active:scale-95"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pt-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black tracking-tight text-slate-800">Pending Bills</span>
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-black text-cyan-700">
            {filteredBills.length}
          </span>
        </div>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search customer, mobile..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs font-semibold text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredBills.length > 0 ? (
          filteredBills.map((bill) => (
            <div 
              key={bill.id}
              className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_8px_28px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_16px_38px_rgba(15,23,42,0.09)] md:flex-row md:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black uppercase text-white shadow-lg shadow-cyan-500/20">
                  {bill.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-black capitalize tracking-tight text-slate-800">{bill.customerName}</h4>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Smartphone size={12} className="text-cyan-300" /> {bill.mobile}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-cyan-300" /> {bill.date}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-slate-500">
                      {bill.staffName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 md:justify-end md:border-t-0 md:pt-0">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">
                  {bill.pendingCount}
                </span>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => router.push(`/dashboard/service-entry?resume=${bill.id}`)}
                    className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/15 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
                  >
                    Complete Bill
                  </button>

                  <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-1.5 text-slate-700">
                    <span className="text-xs font-black text-slate-700">₹{bill.amount.toLocaleString('en-IN')}.00</span>
                    <button className="rounded-md p-0.5 text-slate-400 transition hover:bg-white hover:text-cyan-600">
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-12 text-center text-slate-400 shadow-sm">
            <Clock size={32} className="mx-auto mb-2 text-cyan-300" />
            <p className="text-xs font-semibold text-slate-500">No pending draft bills found.</p>
          </div>
        )}
      </div>
    </div>
  );
}