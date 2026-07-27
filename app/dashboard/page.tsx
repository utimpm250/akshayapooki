"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import { 
  FileText, Wallet, FileSpreadsheet,
  Search, Calculator, Percent, Image, User, CheckCircle2,
  DollarSign, ArrowUpRight, Share2, Bell, Megaphone, X, Globe, ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState({ username: 'Admin User', role: 'admin' });
  
  // Notification dropdown state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Quick Launch Tools state (can sync with Quick Hub)
  const [quickLinks, setQuickLinks] = useState([
    { id: 1, name: 'Resume Studio', url: '#', bgColor: 'from-blue-500 to-blue-600', icon: 'FileText' },
    { id: 2, name: 'SSLC Percentage', url: '#', bgColor: 'from-purple-500 to-purple-600', icon: 'Percent' },
    { id: 3, name: 'Crop & Resize', url: '#', bgColor: 'from-pink-500 to-pink-600', icon: 'Image' },
    { id: 4, name: 'Passport Size', url: '#', bgColor: 'from-red-500 to-red-600', icon: 'User' },
    { id: 5, name: 'Calculator', url: '#', bgColor: 'from-amber-500 to-amber-600', icon: 'Calculator' },
    { id: 6, name: 'Cash Counter', url: '#', bgColor: 'from-emerald-500 to-emerald-600', icon: 'Wallet' },
    { id: 7, name: 'SSLC', url: 'https://sslcexam.kerala.gov.in', bgColor: 'from-teal-500 to-teal-600', icon: 'FileText' },
    { id: 8, name: 'ChatGPT', url: 'https://chatgpt.com', bgColor: 'from-fuchsia-500 to-fuchsia-600', icon: 'Share2' },
  ]);

  // Announcements / Notifications state
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    // Read logged-in user from localStorage on component mount
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
setCurrentUser({
  username: parsed.username || "Admin User",
  role: parsed.role || "staff",
});
const savedAnnouncements = localStorage.getItem("hub_announcements");

if (savedAnnouncements) {
  try {
    const parsedAnnouncements = JSON.parse(savedAnnouncements);

    const username = parsed.username || "Admin User";

    // ഈ user hide ചെയ്ത notification ids
    const hiddenKey = `hidden_notifications_${username}`;
    const hiddenIds = JSON.parse(
      localStorage.getItem(hiddenKey) || "[]"
    );

    const filtered = parsedAnnouncements.filter((item: any) => {
      // ഈ user hide ചെയ്ത notification ആണെങ്കിൽ കാണിക്കേണ്ട
      if (hiddenIds.includes(item.id)) return false;

      // എല്ലാവർക്കും ഉള്ള announcement
      if (item.targetAll) return true;

      // Specific staff announcement
      return item.selectedStaff?.includes(username);
    });

    setAnnouncements(filtered);
  } catch (err) {
    console.error("Error loading announcements", err);
  }
}
      } catch (err) {
        console.error("Error reading loggedInUser", err);
      }
    }

    // Close notification dropdown when clicked outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const handleClearAllNotifications = () => {
  const username = currentUser.username;

  const hiddenKey = `hidden_notifications_${username}`;

  const hiddenIds = announcements.map((item) => item.id);

  localStorage.setItem(hiddenKey, JSON.stringify(hiddenIds));

  setAnnouncements([]);
};

  // Determine display role title badge
  const isAdmin = currentUser.role.toLowerCase() === 'admin';
  const displayRoleTitle = isAdmin ? 'Admin User' : `${currentUser.username} User`;

  return (
   <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Header Row with Bell Notification Icon */}
      <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        </div>
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-700 transition"
          >
            <Bell size={20} />
            {announcements.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notification Popup Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                  <p className="text-xs text-slate-500">{announcements.length} unread message(s)</p>
                </div>
                {announcements.length > 0 && (
                  <button 
                    onClick={handleClearAllNotifications}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md transition"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {announcements.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No new notifications.
                  </div>
                ) : (
                  announcements.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50/80 transition flex items-start gap-3 relative">
                      <span className="absolute top-4 left-3 w-2 h-2 bg-emerald-500 rounded-full mt-1"></span>
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 ml-2">
                        <Megaphone size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.date}</span>
                        </div>
                        {item.subtitle && <p className="text-xs font-semibold text-slate-600 mt-0.5">{item.subtitle}</p>}
                        <p className="text-xs text-slate-500 mt-1">{item.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400 font-medium">Smart Akshaya Hub</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-2xl p-8 shadow-md flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase opacity-85 mb-1">Wednesday, 22 July 2026</p>
          <h3 className="text-3xl font-extrabold">Welcome back, {currentUser.username}!</h3>
        </div>
        <div className="hidden sm:block text-right bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
          <p className="text-xs opacity-80 uppercase font-semibold">Logged in as</p>
          <p className="text-sm font-bold">{displayRoleTitle}</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Today's Entries</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <FileText size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Completed Today</p>
            <p className="text-2xl font-bold mt-1">0</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total Cash Collection</p>
            <p className="text-2xl font-bold mt-1">₹0.00</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Net Wallet Balance</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">₹-1,600.00</p>
          </div>
          <div className="p-3 bg-fuchsia-50 text-fuchsia-600 rounded-lg">
            <Wallet size={22} />
          </div>
        </div>
      </div>

      {/* Quick Launch Tools Grid */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-slate-800">Quick Launch Tools</h4>
          <button className="text-xs font-semibold px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition">
            Customize Layout
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {quickLinks.map((tool) => (
            <a 
              key={tool.id} 
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col justify-between p-5 bg-gradient-to-br ${tool.bgColor} text-white rounded-2xl shadow-sm hover:opacity-95 transition h-28`}
            >
              <div className="flex justify-between items-start">
                <FileText size={22} />
                {tool.url !== '#' && <ExternalLink size={16} className="opacity-75" />}
              </div>
              <div>
                <span className="text-base font-bold block">{tool.name}</span>
                <span className="text-xs opacity-80">External Tool</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Access Services with Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-3">
          Service Directory
        </span>
        <h4 className="text-xl font-bold text-slate-800 mb-4">Quickly Access Any Service</h4>
        
        <div className="relative w-full max-w-lg mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for a service..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List of Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            { title: "Service Card 1", note: "No URL Provided" },
            { title: "Service Card 2", note: "No URL Provided" },
            { title: "Service Card 3", note: "No URL Provided" },
            { title: "Service Online Demo", note: "external.gov.in" },
            { title: "Online Document", note: "No URL Provided" },
            { title: "Service Printout", note: "No URL Provided" },
            { title: "Service PVC", note: "No URL Provided" },
            { title: "Agnipath/Agniveer", note: "No URL Provided" }
          ].map((service, index) => (
            <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:border-blue-200 transition text-left">
              <div>
                <p className="text-sm font-semibold text-slate-700">{service.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{service.note}</p>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}