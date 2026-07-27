"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = false;
    let assignedRole = 'staff';
    let displayName = '';

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check for Super Admin Login
    if (cleanUsername === 'admin' && cleanPassword === 'admin') {
      isValid = true;
      assignedRole = 'admin';
      displayName = 'Admin User';
    } else {
      // 2. Check against stored staff list in LocalStorage (`smart_akshaya_staff`)
      const savedStaffData = localStorage.getItem('smart_akshaya_staff');
      if (savedStaffData) {
        try {
          const staffArray = JSON.parse(savedStaffData);
          if (Array.isArray(staffArray)) {
            const matchedStaff = staffArray.find((s: any) => {
              const sName = (s.name || s.staffName || s.username || '').trim().toLowerCase();
              const sPass = (s.password || s.pass || '').trim();
              
              // Default fallback password generated for staff (e.g., fasnilakshaya)
              const defaultPass = `${sName.split(' ')[0]}akshaya`.toLowerCase();

              const isNameMatch = sName === cleanUsername;
              // Password must match either the stored password or the default auto-generated password
              const isPassMatch = (sPass !== '' && sPass === cleanPassword) || (defaultPass === cleanPassword.toLowerCase());

              return isNameMatch && isPassMatch;
            });

            if (matchedStaff) {
              isValid = true;
              assignedRole = matchedStaff.role?.toLowerCase() === 'admin' ? 'admin' : 'staff';
              displayName = matchedStaff.name || matchedStaff.staffName || matchedStaff.username;
            }
          }
        } catch (err) {
          console.error("Error reading staff storage", err);
        }
      }
    }

    if (isValid) {
      // Store current logged-in user details properly so dashboard displays the exact staff name
      localStorage.setItem('loggedInUser', JSON.stringify({ username: displayName, role: assignedRole }));
      
      // Also record attendance log automatically upon successful login
      try {
        const existingLogs = JSON.parse(localStorage.getItem('staff_attendance_logs') || '[]');
        const todayStr = new Date().toISOString().split('T')[0];
        const alreadyLoggedToday = existingLogs.some((log: any) => 
          log.staffName?.toLowerCase() === displayName.toLowerCase() && 
          new Date(log.timestamp || log.date).toISOString().split('T')[0] === todayStr
        );

        if (!alreadyLoggedToday) {
          existingLogs.push({
            id: Date.now().toString(),
            staffName: displayName,
            role: assignedRole,
            timestamp: new Date().toISOString(),
            loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          localStorage.setItem('staff_attendance_logs', JSON.stringify(existingLogs));
        }
      } catch (err) {
        console.error("Error saving attendance log", err);
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      alert('Invalid Username or Password. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xl mb-3">
            SA
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to your Smart Akshaya Account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Staff Name / Username
            </label>
            <input 
              type="text" 
              placeholder="Enter your name (e.g. FASNIL)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition font-semibold text-slate-700"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition font-semibold text-slate-700"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-150"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
}