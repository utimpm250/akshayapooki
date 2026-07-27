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
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-sans">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Wallet Management</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and Track Your Wallets & Balances</p>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-emerald-100 font-bold">NET WALLET BALANCE</p>
          <h2 className="text-4xl font-black mt-1">₹{netWalletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="bg-emerald-700/60 backdrop-blur-md rounded-xl px-6 py-3 flex items-center gap-3 border border-emerald-500/30">
          <Wallet size={28} className="text-emerald-200" />
          <div>
            <p className="text-xl font-extrabold">{wallets.length}</p>
            <p className="text-[10px] uppercase font-bold text-emerald-200">ACTIVE WALLETS</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Wallet Balances <button onClick={loadWalletsAndTransactions} className="text-slate-400 hover:text-slate-600"><RotateCcw size={14} /></button>
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-50 w-64">
              <Search size={16} className="text-slate-400 mr-2" />
              <input type="text" placeholder="Search wallets..." className="bg-transparent outline-none text-xs w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowTransferModal(true)} className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"><ArrowRightLeft size={14} /> Transfer</button>
            <button onClick={() => setShowHistoryModal(true)} className="border text-slate-600 hover:bg-slate-50 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"><History size={14} /> History</button>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">WALLET NAME</th><th className="py-3 px-4 text-right">OPENING BALANCE</th><th className="py-3 px-4 text-right">CURRENT BALANCE</th><th className="py-3 px-4 text-center">LAST UPDATED</th><th className="py-3 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-slate-700">
              {filteredWallets.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="py-4 px-4 flex items-center gap-3"><Wallet size={16} className="text-slate-500" /><span className="font-bold text-slate-800">{w.name}</span></td>
                  <td className="py-4 px-4 text-right text-slate-500">₹{w.openingBalance.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right font-bold"><span className={w.currentBalance < 0 ? "text-rose-500" : "text-emerald-600"}>₹{w.currentBalance.toFixed(2)}</span></td>
                  <td className="py-4 px-4 text-center text-xs text-slate-400">{w.lastUpdated}</td>
                  <td className="py-4 px-4 text-center flex justify-center gap-2">
                    <button onClick={() => { setSelectedWallet(w); setShowAdjustBalanceModal(true); }} className="bg-emerald-50 text-emerald-600 font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"><Plus size={12} /> Add</button>
                    <button onClick={() => { setSelectedWallet(w); setEditWalletName(w.name); setShowEditModal(true); }} className="text-slate-400 hover:text-blue-600 p-1.5"><Pencil size={15} /></button>
                    <button onClick={() => handleDeleteWallet(w.id)} className="text-slate-400 hover:text-rose-600 p-1.5"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button onClick={() => setShowAddWalletModal(true)} className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl z-40"><Plus size={24} /></button>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><History size={18} /> Wallet Transaction History</h3>
              <button onClick={closeAllModals} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <p className="text-center py-6 text-slate-400">No transaction records found.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{tx.walletName} - <span className={tx.type === 'IN' ? 'text-emerald-600' : 'text-rose-500'}>{tx.type} (₹{tx.amount})</span></p>
                      <p className="text-slate-500">{tx.description} | Staff: {tx.staffName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{tx.date}</p>
                    </div>
                    <div className="text-right font-bold text-slate-700">
                      Balance: ₹{tx.balanceAfter !== undefined ? tx.balanceAfter.toFixed(2) : '-'}
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdateBalance} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-bold text-base">Adjust Balance</h3><button type="button" onClick={closeAllModals}><X size={18} /></button></div>
            <div className="bg-emerald-50 rounded-xl p-3 text-sm font-medium flex justify-between"><span>{selectedWallet.name}</span><span className="font-bold">₹{selectedWallet.currentBalance}</span></div>
            <div>
              <label className="text-xs font-bold text-slate-700">Amount (+/-)</label>
              <input type="number" step="any" required autoFocus className="w-full border rounded-xl p-2 mt-1 text-sm outline-none" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Note</label>
              <input type="text" className="w-full border rounded-xl p-2 mt-1 text-sm outline-none" value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={closeAllModals} className="px-4 py-2 text-xs font-bold">Cancel</button><button type="submit" className="px-4 py-2 text-xs font-bold bg-emerald-500 text-white rounded-xl">Update</button></div>
          </form>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleTransferMoney} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-bold text-base">Transfer Funds</h3><button type="button" onClick={closeAllModals}><X size={18} /></button></div>
            <div>
              <label className="text-xs font-bold text-slate-700">From Wallet</label>
              <select required className="w-full border rounded-xl p-2.5 mt-1 text-sm bg-white" value={fromWalletId} onChange={(e) => setFromWalletId(e.target.value)}>
                <option value="">-- Select Source --</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} (₹{w.currentBalance})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">To Wallet</label>
              <select required className="w-full border rounded-xl p-2.5 mt-1 text-sm bg-white" value={toWalletId} onChange={(e) => setToWalletId(e.target.value)}>
                <option value="">-- Select Destination --</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} (₹{w.currentBalance})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Amount (₹)</label>
              <input type="number" step="any" required className="w-full border rounded-xl p-2.5 mt-1 text-sm" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={closeAllModals} className="px-4 py-2 text-xs font-bold">Cancel</button><button type="submit" className="px-4 py-2 text-xs font-bold bg-emerald-500 text-white rounded-xl">Transfer</button></div>
          </form>
        </div>
      )}

      {/* Add Wallet Modal */}
      {showAddWalletModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateWallet} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3"><h3 className="font-bold text-slate-800">Add New Wallet</h3><button type="button" onClick={closeAllModals}><X size={18} /></button></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Wallet Name</label><input type="text" required autoFocus className="w-full border rounded-xl p-2.5 text-sm mt-1" value={newWalletName} onChange={(e) => setNewWalletName(e.target.value)} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Opening Balance (₹)</label><input type="number" step="any" className="w-full border rounded-xl p-2.5 text-sm mt-1" value={newOpeningBalance} onChange={(e) => setNewOpeningBalance(e.target.value)} /></div>
            <div className="flex justify-end gap-2 pt-3"><button type="button" onClick={closeAllModals} className="px-4 py-2 text-xs font-bold">Cancel</button><button type="submit" className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl">Save</button></div>
          </form>
        </div>
      )}

      {/* Edit Wallet Modal */}
      {showEditModal && selectedWallet && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdateWallet} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3"><h3 className="font-bold text-slate-800">Edit Wallet Name</h3><button type="button" onClick={closeAllModals}><X size={18} /></button></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Wallet Name</label><input type="text" required autoFocus className="w-full border rounded-xl p-2.5 text-sm mt-1" value={editWalletName} onChange={(e) => setEditWalletName(e.target.value)} /></div>
            <div className="flex justify-end gap-2 pt-3"><button type="button" onClick={closeAllModals} className="px-4 py-2 text-xs font-bold">Cancel</button><button type="submit" className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl">Update</button></div>
          </form>
        </div>
      )}
    </div>
  );
}