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
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 font-sans select-none text-slate-700 bg-slate-50/30 min-h-screen">
      
      {/* Top Header Label */}
      <h1 className="text-xl font-bold text-slate-800">Expenses</h1>

      {/* Main Purple Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-indigo-200 font-bold">
            TOTAL EXPENSES ({selectedMonth ? new Date(selectedMonth + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase() : 'ALL TIME'})
          </p>
          <h2 className="text-4xl md:text-5xl font-black mt-2 tracking-tight">
            ₹{totalExpensesAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Records Count Badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 border border-white/20">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-extrabold leading-none block">
              {filteredExpenses.length}
            </span>
            <span className="text-[10px] uppercase font-bold text-indigo-100 tracking-wider">
              RECORDS FOUND
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        <h3 className="text-base font-bold text-slate-800 self-start md:self-auto">
          Recent Transactions
        </h3>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Month Picker Input */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xs hover:border-slate-300 transition focus-within:ring-2 focus-within:ring-indigo-500/20">
            <Calendar className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="month"
              className="bg-transparent outline-none text-xs font-semibold text-slate-600 cursor-pointer"
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
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
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
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-5 px-8 font-medium text-slate-700">{item.date}</td>
                    <td className="py-5 px-6">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[11px] font-bold border border-slate-200/60">
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
                          className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition cursor-pointer"
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
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl shadow-indigo-300 transition-transform hover:scale-105 flex items-center justify-center cursor-pointer z-40"
      >
        <Plus size={26} />
      </button>

      {/* Add / Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
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
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs mt-1 outline-none focus:border-indigo-500 font-medium"
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
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs mt-1 outline-none focus:border-indigo-500 font-medium"
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
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs mt-1 outline-none focus:border-indigo-500 font-medium"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional note or reason"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs mt-1 outline-none focus:border-indigo-500 font-medium"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer"
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