"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, Plus, Pencil, Trash2, Receipt, X } from "lucide-react";

interface ExpenseItem {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  description: string;
  amount: number;
}

const DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: "1",
    date: "2026-07-07",
    category: "a4",
    description: "-",
    amount: 750.0,
  },
  {
    id: "2",
    date: "2026-07-07",
    category: "IRFAN Q",
    description: "-",
    amount: 1500.0,
  },
  {
    id: "3",
    date: "2026-07-06",
    category: "electricity",
    description: "needed to reduce electricty",
    amount: 458.0,
  },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2026-07");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  // Form inputs
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("expensesData");
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch {
        setExpenses(DEFAULT_EXPENSES);
      }
    } else {
      setExpenses(DEFAULT_EXPENSES);
      localStorage.setItem("expensesData", JSON.stringify(DEFAULT_EXPENSES));
    }
  }, []);

  const saveExpensesToStorage = (data: ExpenseItem[]) => {
    setExpenses(data);
    localStorage.setItem("expensesData", JSON.stringify(data));
  };

  const resetForm = () => {
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormCategory("");
    setFormDescription("");
    setFormAmount("");
    setEditingExpense(null);
    setShowAddModal(false);
  };

  // Add / Edit Expense
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory.trim() || !formAmount) return;

    const parsedAmount = parseFloat(formAmount) || 0;

    if (editingExpense) {
      const updated = expenses.map((item) =>
        item.id === editingExpense.id
          ? {
              ...item,
              date: formDate,
              category: formCategory.trim(),
              description: formDescription.trim() || "-",
              amount: parsedAmount,
            }
          : item
      );
      saveExpensesToStorage(updated);
    } else {
      const newExpense: ExpenseItem = {
        id: "EXP-" + Date.now(),
        date: formDate,
        category: formCategory.trim(),
        description: formDescription.trim() || "-",
        amount: parsedAmount,
      };
      saveExpensesToStorage([newExpense, ...expenses]);
    }

    resetForm();
  };

  // Edit action
  const handleEdit = (item: ExpenseItem) => {
    setEditingExpense(item);
    setFormDate(item.date);
    setFormCategory(item.category);
    setFormDescription(item.description === "-" ? "" : item.description);
    setFormAmount(item.amount.toString());
    setShowAddModal(true);
  };

  // Delete action
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expense entry?")) {
      const updated = expenses.filter((item) => item.id !== id);
      saveExpensesToStorage(updated);
    }
  };

  // Filter Logic
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm);

    const matchesMonth = selectedMonth ? item.date.startsWith(selectedMonth) : true;

    return matchesSearch && matchesMonth;
  });

  // Calculate Total Amount
  const totalExpensesAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  if (!isMounted) return null;

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] select-none space-y-5 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-4 font-sans text-slate-700 sm:p-5 lg:p-6">
      
      {/* Top Header Label */}
      <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Expenses</h1>

      {/* Main Purple Banner */}
      <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-[0_22px_55px_rgba(15,23,42,0.2)] md:flex-row md:items-center sm:p-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
            TOTAL EXPENSES ({selectedMonth ? new Date(selectedMonth + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase() : 'ALL TIME'})
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            ₹{totalExpensesAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Records Count Badge */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
          <div className="rounded-xl border border-white/10 bg-white/10 p-2.5">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-extrabold leading-none block">
              {filteredExpenses.length}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-200">
              RECORDS FOUND
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col items-start justify-between gap-4 pt-1 md:flex-row md:items-center">
        <h3 className="self-start text-lg font-black tracking-tight text-slate-800 md:self-auto">
          Recent Transactions
        </h3>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Month Picker Input */}
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-cyan-200 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10">
            <Calendar className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="month"
              className="cursor-pointer bg-transparent text-xs font-semibold text-slate-600 outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by category, description, or date..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-8">DATE</th>
                <th className="py-4 px-6">CATEGORY</th>
                <th className="py-4 px-6">DESCRIPTION</th>
                <th className="py-4 px-6 text-right">AMOUNT</th>
                <th className="py-4 px-8 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    No expense records found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item) => (
                  <tr key={item.id} className="transition-all hover:bg-cyan-50/30">
                    <td className="py-5 px-8 font-medium text-slate-700">{item.date}</td>
                    <td className="py-5 px-6">
                      <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-slate-500 font-medium">{item.description}</td>
                    <td className="py-5 px-6 text-right font-black text-slate-800 text-sm">
                      ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-xl p-2 text-cyan-600 transition-all hover:bg-cyan-50 hover:text-cyan-700"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-xl p-2 text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-700"
                          title="Delete"
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

      {/* Floating Action Button (+ Add Expense) */}
      <button
        onClick={() => {
          resetForm();
          setShowAddModal(true);
        }}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-4 text-white shadow-[0_15px_35px_rgba(6,182,212,0.28)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(37,99,235,0.3)] active:scale-95"
      >
        <Plus size={26} />
      </button>

      {/* Add / Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black tracking-tight text-slate-800">
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Date *</label>
                <input
                  type="date"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. electricity, a4, rent"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Amount (₹) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional note or reason"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold outline-none transition-all focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl px-4 py-2 text-xs font-black text-slate-500 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {editingExpense ? "Update Expense" : "Save Expense"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}