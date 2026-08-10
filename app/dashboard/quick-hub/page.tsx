"use client";

import React, { useState, useEffect } from 'react';
import { 
  Rocket, Megaphone, Plus, Trash2, Globe, ExternalLink, X, 
  FileText, Settings, Users, Wallet, Star, Shield, Check 
} from 'lucide-react';

interface QuickLink {
  id: number;
  name: string;
  url: string;
  bgColor: string;
  iconName: string;
}

interface Announcement {
  id: number;
  title: string;
  subtitle?: string;
  content?: string;
  date: string;
  unread: boolean;
  targetAll: boolean;
  selectedStaff: string[];
}

export default function QuickHub() {
  const [activeTab, setActiveTab] = useState('links');
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  // Main Lists State inside QuickHub
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Form states for External Tool
  const [toolName, setToolName] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [selectedBgColor, setSelectedBgColor] = useState('bg-blue-600');
  const [selectedIcon, setSelectedIcon] = useState('Globe');

  // Form states for Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annSubtitle, setAnnSubtitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [targetAllStaff, setTargetAllStaff] = useState(true);
  
  // Dynamic Staff list from localStorage (Staff Management)
  const [staffList, setStaffList] = useState<string[]>(['Admin User', 'Fasnil', 'Sumayya', 'Sheeja']);
  const [selectedStaffList, setSelectedStaffList] = useState<string[]>([]);

  // Load actual staff & saved quick links from localStorage on mount
  useEffect(() => {
    // Load Quick Links
    const savedLinks = localStorage.getItem("hub_quick_links");
    if (savedLinks) {
      try {
        setQuickLinks(JSON.parse(savedLinks));
      } catch (e) {
        console.error("Error loading quick links", e);
      }
    }

    // Load staff
    const savedStaff = localStorage.getItem("staff_members");
    if (savedStaff) {
      try {
        const parsed = JSON.parse(savedStaff);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const names = parsed
            .map((s: any) => s.name || s.username || s.firstName)
            .filter(Boolean);

          if (names.length > 0) {
            setStaffList(names);
          }
        }
      } catch (e) {
        console.error("Error parsing staff list", e);
      }
    }

    // Load announcements
    const savedAnnouncements = localStorage.getItem("hub_announcements");
    if (savedAnnouncements) {
      try {
        setAnnouncements(JSON.parse(savedAnnouncements));
      } catch (e) {
        console.error("Error loading announcements", e);
      }
    }
  }, []);

  const colors = [
    'bg-blue-600', 'bg-teal-600', 'bg-emerald-600', 'bg-purple-600', 
    'bg-pink-600', 'bg-rose-600', 'bg-amber-600', 'bg-indigo-600'
  ];

  const availableIcons = [
    { name: 'Globe', component: Globe },
    { name: 'Rocket', component: Rocket },
    { name: 'FileText', component: FileText },
    { name: 'Settings', component: Settings },
    { name: 'Users', component: Users },
    { name: 'Wallet', component: Wallet },
    { name: 'Star', component: Star },
    { name: 'Shield', component: Shield },
  ];

  const renderToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return <Rocket size={18} />;
      case 'FileText': return <FileText size={18} />;
      case 'Settings': return <Settings size={18} />;
      case 'Users': return <Users size={18} />;
      case 'Wallet': return <Wallet size={18} />;
      case 'Star': return <Star size={18} />;
      case 'Shield': return <Shield size={18} />;
      default: return <Globe size={18} />;
    }
  };

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName || !toolUrl) return;
    const newTool: QuickLink = {
      id: Date.now(),
      name: toolName,
      url: toolUrl,
      bgColor: selectedBgColor,
      iconName: selectedIcon
    };
    const updatedLinks = [newTool, ...quickLinks];
    setQuickLinks(updatedLinks);
    
    // Save to localStorage so it persists when changing pages
    localStorage.setItem('hub_quick_links', JSON.stringify(updatedLinks));

    setToolName('');
    setToolUrl('');
    setSelectedBgColor('bg-blue-600');
    setSelectedIcon('Globe');
    setIsToolModalOpen(false);
  };

  const handleDeleteTool = (id: number) => {
    const updatedLinks = quickLinks.filter(tool => tool.id !== id);
    setQuickLinks(updatedLinks);
    localStorage.setItem('hub_quick_links', JSON.stringify(updatedLinks));
  };

  const handleStaffToggle = (staffName: string) => {
    if (selectedStaffList.includes(staffName)) {
      setSelectedStaffList(selectedStaffList.filter(s => s !== staffName));
    } else {
      setSelectedStaffList([...selectedStaffList, staffName]);
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle) return;
    const newAnn: Announcement = {
      id: Date.now(),
      title: annTitle,
      subtitle: annSubtitle,
      content: annContent,
      date: new Date().toLocaleDateString(),
      unread: true,
      targetAll: targetAllStaff,
      selectedStaff: targetAllStaff ? ['All Staff'] : selectedStaffList
    };
    
    const updatedAnnouncements = [newAnn, ...announcements];
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('hub_announcements', JSON.stringify(updatedAnnouncements));

    setAnnTitle('');
    setAnnSubtitle('');
    setAnnContent('');
    setTargetAllStaff(true);
    setSelectedStaffList([]);
    setIsAnnouncementModalOpen(false);
  };

  const handleDeleteAnnouncement = (id: number) => {
    const updated = announcements.filter((ann) => ann.id !== id);
    setAnnouncements(updated);
    localStorage.setItem("hub_announcements", JSON.stringify(updated));

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("hidden_notifications_")) {
        try {
          const hidden = JSON.parse(localStorage.getItem(key) || "[]");
          const cleaned = hidden.filter((notificationId: number) => notificationId !== id);
          localStorage.setItem(key, JSON.stringify(cleaned));
        } catch (err) {
          console.error("Error updating hidden notifications", err);
        }
      }
    });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] space-y-5 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-4 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 text-white shadow-lg shadow-cyan-500/20">
          <Rocket size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Quick Hub</h1>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">Manage external tools & broadcast announcements to staff.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'links' 
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
              : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <Rocket size={18} />
          <span>Quick Links</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'announcements' 
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
              : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50'
          }`}
        >
          <Megaphone size={18} />
          <span>Announcements</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'links' ? (
        <div>
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-lg font-black tracking-tight text-slate-800">Configured Tools</h2>
            <button
              onClick={() => setIsToolModalOpen(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-slate-900 to-blue-950 px-4 py-2.5 text-xs font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Plus size={18} />
              <span>Add Tool</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs text-slate-400">
                  <th className="p-4 font-black">TOOL</th>
                  <th className="p-4 font-black">URL</th>
                  <th className="p-4 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {quickLinks.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">No tools added yet.</td>
                  </tr>
                ) : (
                  quickLinks.map((tool) => (
                    <tr key={tool.id} className="border-b border-slate-100 transition-all hover:bg-cyan-50/30">
                      <td className="p-4 flex items-center space-x-3">
                        <div className={`p-2 rounded-lg text-white ${tool.bgColor}`}>
                          {renderToolIcon(tool.iconName)}
                        </div>
                        <span className="font-black text-slate-800">{tool.name}</span>
                      </td>
                      <td className="max-w-md truncate p-4 font-medium text-cyan-700">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center space-x-1">
                          <span>{tool.url}</span>
                          <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteTool(tool.id)}
                          className="rounded-xl p-2 text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-lg font-black tracking-tight text-slate-800">Active Announcements</h2>
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-amber-500/15 transition-all hover:-translate-y-0.5"
            >
              <Plus size={18} />
              <span>New Announcement</span>
            </button>
          </div>

          {announcements.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/90 p-12 text-center shadow-sm">
              <Megaphone size={48} className="mx-auto mb-3 text-cyan-300" />
              <h3 className="text-lg font-black tracking-tight text-slate-800">No Active Announcements</h3>
              <p className="mb-4 text-sm text-slate-400">Broadcast updates or information to staff members.</p>
              <button
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
              >
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="flex items-start justify-between rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:border-cyan-200">
                  <div className="flex space-x-4">
                    <div className="h-fit rounded-2xl border border-amber-100 bg-amber-50 p-3 text-amber-600">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-black text-slate-800">{ann.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ann.targetAll ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                          {ann.targetAll ? 'All Staff' : `${ann.selectedStaff.length} Staff Selected`}
                        </span>
                      </div>
                      {ann.subtitle && <p className="mt-0.5 text-xs text-slate-500">{ann.subtitle}</p>}
                      <p className="mt-2 text-sm leading-6 text-slate-600">{ann.content}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <span>Published on: {ann.date}</span>
                        {!ann.targetAll && (
                          <span className="text-purple-600 font-medium">({ann.selectedStaff.join(', ')})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="rounded-xl p-2 text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Tool Modal */}
      {isToolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
            <button onClick={() => setIsToolModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="mb-4 text-lg font-black tracking-tight text-slate-800">Add External Tool</h3>
            <form onSubmit={handleAddTool} className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Tool Name</label>
                <input 
                  type="text" 
                  value={toolName} 
                  onChange={(e) => setToolName(e.target.value)} 
                  placeholder="e.g. ChatGPT" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  required 
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Visiting URL</label>
                <input 
                  type="url" 
                  value={toolUrl} 
                  onChange={(e) => setToolUrl(e.target.value)} 
                  placeholder="https://example.com" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  required 
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Select Icon</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {availableIcons.map((item) => {
                    const IconComponent = item.component;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setSelectedIcon(item.name)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${
                          selectedIcon === item.name 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-600' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent size={20} />
                        <span className="text-[10px] mt-1">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Background Color</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedBgColor(color)}
                      className={`w-8 h-8 rounded-full ${color} ${selectedBgColor === color ? 'ring-4 ring-offset-2 ring-emerald-500' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsToolModalOpen(false)} className="rounded-xl px-4 py-2.5 text-xs font-black text-slate-500 transition hover:bg-slate-100">Cancel</button>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5">Save Tool</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAnnouncementModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="mb-4 text-lg font-black tracking-tight text-slate-800">Create Announcement</h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Title</label>
                <input 
                  type="text" 
                  value={annTitle} 
                  onChange={(e) => setAnnTitle(e.target.value)} 
                  placeholder="e.g. Important Meeting" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                  required 
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Subtitle (Optional)</label>
                <input 
                  type="text" 
                  value={annSubtitle} 
                  onChange={(e) => setAnnSubtitle(e.target.value)} 
                  placeholder="e.g. Regarding new policy" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Points / Content</label>
                <textarea 
                  value={annContent} 
                  onChange={(e) => setAnnContent(e.target.value)} 
                  placeholder="Enter details here..." 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Target Staff Section */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Target Staff</label>
                
                <div 
                  onClick={() => setTargetAllStaff(!targetAllStaff)}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between mb-2 transition ${
                    targetAllStaff ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${targetAllStaff ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300'}`}>
                      {targetAllStaff && <Check size={14} />}
                    </div>
                    <span className="font-medium text-gray-800 text-sm flex items-center gap-2">
                      <Users size={16} className="text-blue-500" /> All Staff
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">Everyone</span>
                </div>

                {!targetAllStaff && (
                  <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/70 p-2">
                    <p className="text-[11px] font-semibold text-gray-500 px-2 py-1">Select Specific Staff Members:</p>
                    {staffList.map((staff) => {
                      const isChecked = selectedStaffList.includes(staff);
                      return (
                        <div 
                          key={staff}
                          onClick={() => handleStaffToggle(staff)}
                          className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition ${
                            isChecked ? 'bg-amber-50 border border-amber-300' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300 bg-white'}`}>
                            {isChecked && <Check size={12} />}
                          </div>
                          <span className="text-sm text-gray-700">{staff}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAnnouncementModalOpen(false)} className="rounded-xl px-4 py-2.5 text-xs font-black text-slate-500 transition hover:bg-slate-100">Cancel</button>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-amber-500/15 transition-all hover:-translate-y-0.5">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}