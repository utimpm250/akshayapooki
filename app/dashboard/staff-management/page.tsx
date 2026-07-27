"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Plus, Edit2, Trash2, Mail, Phone, RefreshCw, Eye, Shield, Key 
} from "lucide-react";

interface Staff {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
}

const INITIAL_STAFF: Staff[] = [
  { id: '1', staffId: '#1', name: 'Admin User', email: 'admin@gmail.com', phone: '8589868773', role: 'Admin', salary: 10000 },
  { id: '2', staffId: '#2', name: 'FASNIL', email: 'fasnil@gmail.com', phone: '9544739520', role: 'Accountant', salary: 10000 },
  { id: '3', staffId: '#3', name: 'SUMAYYA', email: 'sumayya@gmail.com', phone: '7025400130', role: 'Staff', salary: 10000 },
  { id: '4', staffId: '#4', name: 'SHEEJA', email: 'sheeja@gmail.com', phone: '8907428080', role: 'Staff', salary: 10000 },
  { id: '5', staffId: '#5', name: 'SAHLA', email: 'sahla@gmail.com', phone: '9037977659', role: 'Staff', salary: 10000 },
  { id: '6', staffId: '#6', name: 'test', email: 'test@gmail.com', phone: '9876543210', role: 'Staff', salary: 10000 },
];

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // New Staff Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Staff');
  const [newSalary, setNewSalary] = useState(10000);
  const [newPassword, setNewPassword] = useState('');

  // Edit Staff Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editSalary, setEditSalary] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('smart_akshaya_staff');
    if (saved) {
      try {
        setStaffList(JSON.parse(saved));
      } catch (e) {
        setStaffList(INITIAL_STAFF);
      }
    } else {
      setStaffList(INITIAL_STAFF);
      localStorage.setItem('smart_akshaya_staff', JSON.stringify(INITIAL_STAFF));
    }
  }, []);

  const handleAutoGeneratePassword = (isEdit: boolean = false) => {
    const nameVal = isEdit ? editName : newName;
    const firstName = nameVal.trim().split(' ')[0].toLowerCase() || 'staff';
    const generated = `${firstName}akshaya`;
    if (isEdit) {
      // Handle edit password if needed
    } else {
      setNewPassword(generated);
    }
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStaffMember: Staff = {
      id: Date.now().toString(),
      staffId: `#${staffList.length + 1}`,
      name: newName,
      email: newEmail || 'N/A',
      phone: newPhone || 'N/A',
      role: newRole,
      salary: Number(newSalary) || 0
    };

    const updatedList = [newStaffMember, ...staffList];
    setStaffList(updatedList);
    localStorage.setItem('smart_akshaya_staff', JSON.stringify(updatedList));

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('Staff');
    setNewSalary(10000);
    setNewPassword('');
    setShowAddModal(false);
  };

  const handleOpenEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setEditName(staff.name);
    setEditEmail(staff.email);
    setEditPhone(staff.phone);
    setEditRole(staff.role);
    setEditSalary(staff.salary);
    setShowEditModal(true);
  };

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const updatedList = staffList.map(s => {
      if (s.id === selectedStaff.id) {
        return {
          ...s,
          name: editName,
          email: editEmail,
          phone: editPhone,
          role: editRole,
          salary: Number(editSalary)
        };
      }
      return s;
    });

    setStaffList(updatedList);
    localStorage.setItem('smart_akshaya_staff', JSON.stringify(updatedList));
    setShowEditModal(false);
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      const updatedList = staffList.filter(s => s.id !== id);
      setStaffList(updatedList);
      localStorage.setItem('smart_akshaya_staff', JSON.stringify(updatedList));
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.staffId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative min-h-screen pb-20">
      
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Staff Management</h1>
      </div>

      {/* Top Gradient Banner Card */}
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-orange-100">Staff Profiles</p>
          <h2 className="text-5xl font-black mt-1">{staffList.length}</h2>
        </div>
        <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/20">
          <Users size={24} className="text-white" />
          <div>
            <p className="text-[10px] tracking-wider uppercase text-orange-100 font-bold">Active Accounts</p>
            <p className="text-sm font-black">{staffList.length}</p>
          </div>
        </div>
      </div>

      {/* Staff Directory Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 text-base">Staff Directory</h3>
          <button 
            onClick={() => window.location.reload()} 
            className="text-slate-400 hover:text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID or email..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Staff Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-6 font-bold">Staff ID</th>
                <th className="py-4 px-6 font-bold">Name</th>
                <th className="py-4 px-6 font-bold">Contact</th>
                <th className="py-4 px-6 font-bold">Role</th>
                <th className="py-4 px-6 font-bold">Salary</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-medium">
                    No staff members found.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition text-slate-700">
                    <td className="py-4 px-6 font-bold text-slate-500">{staff.staffId}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail size={12} className="text-slate-400" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone size={12} className="text-slate-400" />
                        <span>{staff.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        staff.role.toLowerCase() === 'admin' 
                          ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                          : staff.role.toLowerCase() === 'accountant'
                          ? 'bg-purple-50 text-purple-600 border border-purple-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">₹{staff.salary}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(staff)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition inline-flex items-center justify-center"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition inline-flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-50"
        title="Add Staff"
      >
        <Plus size={24} />
      </button>

      {/* Add New Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-rose-500" />
                <h3 className="font-bold text-slate-800 text-base">Add New Staff</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Full Name *</label>
                <div className="relative mt-1.5">
                  <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Mobile *</label>
                  <div className="relative mt-1.5">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="10-digit number"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Email *</label>
                  <div className="relative mt-1.5">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@mail.com"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">User Role</label>
                  <div className="relative mt-1.5">
                    <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none bg-white appearance-none"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="Staff">Staff</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Basic Salary</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                    value={newSalary}
                    onChange={(e) => setNewSalary(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mt-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Password</label>
                  <button 
                    type="button" 
                    onClick={() => handleAutoGeneratePassword(false)} 
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Auto Generate
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Leave empty for default: [firstname]akshaya"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Eye size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-rose-500" />
                <h3 className="font-bold text-slate-800 text-base">Edit Staff Profile</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Full Name *</label>
                <div className="relative mt-1.5">
                  <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Mobile *</label>
                  <div className="relative mt-1.5">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Email *</label>
                  <div className="relative mt-1.5">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">User Role</label>
                  <div className="relative mt-1.5">
                    <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none bg-white appearance-none"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="Staff">Staff</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Basic Salary</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 mt-1.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                    value={editSalary}
                    onChange={(e) => setEditSalary(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mt-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Password</label>
                  <button type="button" onClick={() => alert("Password auto-generated!")} className="text-xs text-blue-600 font-semibold hover:underline">
                    Auto Generate
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Leave empty to keep current"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <Eye size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}