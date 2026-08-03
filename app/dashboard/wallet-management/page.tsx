"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  Search,
  ArrowRightLeft,
  History,
  Plus,
  Pencil,
  Trash2,
  X,
  RotateCcw,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

interface WalletItem {
  id: string;
  name: string;
  openingBalance: number;
  currentBalance: number;
  lastUpdated: string;
}

interface TransactionItem {
  id: string;
  walletId: string;
  walletName: string;
  type: "IN" | "OUT" | "UPDATE";
  amount: number;
  balanceAfter?: number;
  description: string;
  date: string;
  staffName?: string;
}

const DEFAULT_WALLETS: WalletItem[] = [
  { id: "1", name: "Cash", openingBalance: 0, currentBalance: 0, lastUpdated: "10 Jul 2026 12:39" },
  { id: "2", name: "BANK", openingBalance: 50717.21, currentBalance: 0, lastUpdated: "11 Jul 2026 15:57" },
  { id: "3", name: "Edistrict", openingBalance: 1767.0, currentBalance: 0, lastUpdated: "10 Jul 2026 12:40" },
  { id: "4", name: "CSC", openingBalance: 70.0, currentBalance: 0, lastUpdated: "10 Jul 2026 12:40" },
];

export default function WalletManagementPage() {
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showAdjustBalanceModal, setShowAdjustBalanceModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedWallet, setSelectedWallet] = useState<WalletItem | null>(null);
  const [newWalletName, setNewWalletName] = useState("");
  const [newOpeningBalance, setNewOpeningBalance] = useState("");

  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [editWalletName, setEditWalletName] = useState("");

  const [fromWalletId, setFromWalletId] = useState("");
  const [toWalletId, setToWalletId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  useEffect(() => {
    setIsMounted(true);
    loadWalletsAndTransactions();

    const handleStorage = () => {
      loadWalletsAndTransactions();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadWalletsAndTransactions = () => {
    const saved = localStorage.getItem("managedWallets");
    if (saved) {
      try { setWallets(JSON.parse(saved)); } catch { setWallets(DEFAULT_WALLETS); }
    } else {
      setWallets(DEFAULT_WALLETS);
      localStorage.setItem("managedWallets", JSON.stringify(DEFAULT_WALLETS));
    }

    const savedTx = localStorage.getItem("walletTransactions");
    if (savedTx) {
      try { setTransactions(JSON.parse(savedTx)); } catch { setTransactions([]); }
    }
  };

  const saveWalletsToStorage = (updatedWallets: WalletItem[]) => {
    setWallets(updatedWallets);
    localStorage.setItem("managedWallets", JSON.stringify(updatedWallets));
  };

  const saveTransactionToHistory = (newTx: TransactionItem) => {
    const existingTxJson = localStorage.getItem("walletTransactions");
    let txList: any[] = [];
    if (existingTxJson) { try { txList = JSON.parse(existingTxJson); } catch { txList = []; } }

    const formattedTx = {
      ...newTx,
      dateTime: newTx.date,
      staffName: newTx.staffName || "System",
      wallet: newTx.walletName,
    };

    txList.unshift(formattedTx);
    localStorage.setItem("walletTransactions", JSON.stringify(txList));
    setTransactions(txList);
  };

  const getFormattedTimestamp = () => {
    return new Date().toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  const closeAllModals = () => {
    setShowAddWalletModal(false);
    setShowAdjustBalanceModal(false);
    setShowTransferModal(false);
    setShowEditModal(false);
    setShowHistoryModal(false);
    setSelectedWallet(null);
    setNewWalletName("");
    setNewOpeningBalance("");
    setAdjustAmount("");
    setAdjustNote("");
    setEditWalletName("");
    setFromWalletId("");
    setToWalletId("");
    setTransferAmount("");
  };

  const handleCreateWallet = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newWalletName.trim()) return;

    const initialBal = Number(newOpeningBalance) || 0;
    const timestamp = getFormattedTimestamp();

    const newWallet: WalletItem = {
      id: Date.now().toString(),
      name: newWalletName.trim(),
      openingBalance: initialBal,
      currentBalance: initialBal,
      lastUpdated: timestamp,
    };

    saveWalletsToStorage([...wallets, newWallet]);
    closeAllModals();
  };

  const handleUpdateBalance = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedWallet || !adjustAmount) return;

    const addVal = Number(adjustAmount);
    if (isNaN(addVal) || addVal === 0) return;

    const timestamp = getFormattedTimestamp();
    const updatedBalance = Number((selectedWallet.currentBalance + addVal).toFixed(2));

    const updated = wallets.map((w) => w.id === selectedWallet.id ? { ...w, currentBalance: updatedBalance, lastUpdated: timestamp } : w);
    saveWalletsToStorage(updated);

    saveTransactionToHistory({
      id: "TX-" + Date.now(),
      walletId: selectedWallet.id,
      walletName: selectedWallet.name,
      type: addVal > 0 ? "IN" : "OUT",
      amount: Math.abs(addVal),
      balanceAfter: updatedBalance,
      description: adjustNote.trim() || "Manual Balance Update",
      date: timestamp,
      staffName: "System",
    });
    closeAllModals();
  };

  const handleUpdateWallet = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedWallet || !editWalletName.trim()) return;

    const updated = wallets.map((w) => w.id === selectedWallet.id ? { ...w, name: editWalletName.trim(), lastUpdated: getFormattedTimestamp() } : w);
    saveWalletsToStorage(updated);
    closeAllModals();
  };

  const handleTransferMoney = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fromWalletId || !toWalletId || !transferAmount || fromWalletId === toWalletId) {
      alert("Please check source/destination wallets and amount!");
      return;
    }

    const tAmount = Number(transferAmount);
    const timestamp = getFormattedTimestamp();
    const fromWallet = wallets.find((w) => w.id === fromWalletId);
    const toWallet = wallets.find((w) => w.id === toWalletId);
    if (!fromWallet || !toWallet) return;

    const updatedFromBalance = Number((fromWallet.currentBalance - tAmount).toFixed(2));
    const updatedToBalance = Number((toWallet.currentBalance + tAmount).toFixed(2));

    const updated = wallets.map((w) => {
      if (w.id === fromWalletId) return { ...w, currentBalance: updatedFromBalance, lastUpdated: timestamp };
      if (w.id === toWalletId) return { ...w, currentBalance: updatedToBalance, lastUpdated: timestamp };
      return w;
    });

    saveWalletsToStorage(updated);
    closeAllModals();
  };

  const handleDeleteWallet = (id: string) => {
    if (confirm("Are you sure you want to delete this wallet?")) {
      saveWalletsToStorage(wallets.filter((w) => w.id !== id));
    }
  };

  const netWalletBalance = wallets.reduce((acc, curr) => acc + curr.currentBalance, 0);
  const filteredWallets = wallets.filter((w) => w.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isMounted) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none font-sans bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Wallet Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Track, transfer, and manage all your digital & physical balances seamlessly.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100">
          <ShieldCheck size={16} /> Secure Ledger System
        </div>
      </div>

      {/* Hero Banner / Net Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-8 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold tracking-widest uppercase">
            <TrendingUp size={14} /> NET WALLET BALANCE
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mt-2 tracking-tight">
            ₹{netWalletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-emerald-100/80 text-xs mt-2 font-medium">Combined balance across all active accounts & cash drawers.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 border border-white/20 shadow-inner">
          <div className="p-3 bg-white/20 rounded-xl">
            <Wallet size={28} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-black">{wallets.length}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">ACTIVE WALLETS</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-800">Wallet Balances</h2>
            <button 
              onClick={loadWalletsAndTransactions} 
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" 
              title="Refresh Data"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center border border-slate-200 rounded-2xl px-4 py-2.5 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 transition-all w-full sm:w-72">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search wallets..." 
                className="bg-transparent outline-none text-xs w-full text-slate-700 font-medium placeholder:text-slate-400" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <button 
              onClick={() => setShowTransferModal(true)} 
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xs"
            >
              <ArrowRightLeft size={14} /> Transfer Funds
            </button>
            <button 
              onClick={() => setShowHistoryModal(true)} 
              className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs px-4 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xs"
            >
              <History size={14} /> History
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">WALLET NAME</th>
                <th className="py-4 px-6 text-right">OPENING BALANCE</th>
                <th className="py-4 px-6 text-right">CURRENT BALANCE</th>
                <th className="py-4 px-6 text-center">LAST UPDATED</th>
                <th className="py-4 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredWallets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-xs">No wallets found matching your search.</td>
                </tr>
              ) : (
                filteredWallets.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3.5">
                      <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
                        <Wallet size={16} />
                      </div>
                      <span className="font-bold text-slate-900">{w.name}</span>
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500 font-semibold">₹{w.openingBalance.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right font-black">
                      <span className={w.currentBalance < 0 ? "text-rose-500" : "text-emerald-600"}>
                        ₹{w.currentBalance.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-slate-400 font-medium">{w.lastUpdated}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setSelectedWallet(w); setShowAdjustBalanceModal(true); }} 
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1 transition-all"
                        >
                          <Plus size={12} /> Add
                        </button>
                        <button 
                          onClick={() => { setSelectedWallet(w); setEditWalletName(w.name); setShowEditModal(true); }} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit Wallet"
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteWallet(w.id)} 
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Wallet"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowAddWalletModal(true)} 
        className="fixed bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl shadow-emerald-600/40 z-40 transition-all hover:scale-105 flex items-center justify-center"
        title="Add New Wallet"
      >
        <Plus size={26} />
      </button>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2.5 text-lg">
                <History size={20} className="text-emerald-600" /> Wallet Transaction History
              </h3>
              <button onClick={closeAllModals} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No transaction records found.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-sm">
                        {tx.walletName} - <span className={tx.type === 'IN' ? 'text-emerald-600 font-black' : 'text-rose-500 font-black'}>{tx.type} (₹{tx.amount})</span>
                      </p>
                      <p className="text-slate-500 font-medium">{tx.description} | Staff: <span className="text-slate-700 font-bold">{tx.staffName}</span></p>
                      <p className="text-[10px] text-slate-400 font-semibold">{tx.date}</p>
                    </div>
                    <div className="text-right font-black text-slate-800 text-sm bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-xs">
                      Bal: ₹{tx.balanceAfter !== undefined ? tx.balanceAfter.toFixed(2) : '-'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {showAdjustBalanceModal && selectedWallet && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdateBalance} className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Adjust Balance</h3>
              <button type="button" onClick={closeAllModals} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 text-sm font-medium flex justify-between items-center border border-emerald-100 text-emerald-900">
              <span className="font-bold">{selectedWallet.name}</span>
              <span className="font-black text-base">₹{selectedWallet.currentBalance.toFixed(2)}</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Amount (+/-)</label>
              <input 
                type="number" 
                step="any" 
                required 
                autoFocus 
                placeholder="e.g. 500 or -200" 
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-emerald-500 bg-slate-50/50 font-medium" 
                value={adjustAmount} 
                onChange={(e) => setAdjustAmount(e.target.value)} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Note / Description</label>
              <input 
                type="text" 
                placeholder="Reason for adjustment..." 
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-emerald-500 bg-slate-50/50 font-medium" 
                value={adjustNote} 
                onChange={(e) => setAdjustNote(e.target.value)} 
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={closeAllModals} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/30 transition-all">Update Balance</button>
            </div>
          </form>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleTransferMoney} className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Transfer Funds</h3>
              <button type="button" onClick={closeAllModals} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">From Wallet</label>
              <select required className="w-full border border-slate-200 rounded-2xl p-3 text-sm bg-slate-50/50 font-medium outline-none focus:border-emerald-500" value={fromWalletId} onChange={(e) => setFromWalletId(e.target.value)}>
                <option value="">-- Select Source --</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} (₹{w.currentBalance.toFixed(2)})</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">To Wallet</label>
              <select required className="w-full border border-slate-200 rounded-2xl p-3 text-sm bg-slate-50/50 font-medium outline-none focus:border-emerald-500" value={toWalletId} onChange={(e) => setToWalletId(e.target.value)}>
                <option value="">-- Select Destination --</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} (₹{w.currentBalance.toFixed(2)})</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Amount (₹)</label>
              <input 
                type="number" 
                step="any" 
                required 
                placeholder="Enter amount" 
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm bg-slate-50/50 font-medium outline-none focus:border-emerald-500" 
                value={transferAmount} 
                onChange={(e) => setTransferAmount(e.target.value)} 
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={closeAllModals} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/30 transition-all">Transfer Now</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Wallet Modal */}
      {showAddWalletModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateWallet} className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Add New Wallet</h3>
              <button type="button" onClick={closeAllModals} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Wallet Name</label>
              <input
  type="text"
  required
  autoFocus
  placeholder="e.g. PhonePe / GooglePay"
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm mt-1 bg-slate-50/50 font-medium outline-none focus:border-emerald-500" 
                value={newWalletName} 
                onChange={(e) => setNewWalletName(e.target.value)} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Opening Balance (₹)</label>
              <input 
                type="number" 
                step="any" 
                placeholder="0.00" 
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm mt-1 bg-slate-50/50 font-medium outline-none focus:border-emerald-500" 
                value={newOpeningBalance} 
                onChange={(e) => setNewOpeningBalance(e.target.value)} 
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={closeAllModals} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/30 transition-all">Save Wallet</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Wallet Modal */}
      {showEditModal && selectedWallet && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdateWallet} className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Edit Wallet Name</h3>
              <button type="button" onClick={closeAllModals} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Wallet Name</label>
              <input 
                type="text" 
                required 
                autoFocus 
                className="w-full border border-slate-200 rounded-2xl p-3 text-sm mt-1 bg-slate-50/50 font-medium outline-none focus:border-blue-500" 
                value={editWalletName} 
                onChange={(e) => setEditWalletName(e.target.value)} 
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={closeAllModals} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all">Update Name</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}