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

  // Load actual staff from localStorage if available
useEffect(() => {
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
    setQuickLinks([newTool, ...quickLinks]);
    setToolName('');
    setToolUrl('');
    setSelectedBgColor('bg-blue-600');
    setSelectedIcon('Globe');
    setIsToolModalOpen(false);
  };

  const handleDeleteTool = (id: number) => {
    setQuickLinks(quickLinks.filter(tool => tool.id !== id));
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
    
    // Save to localStorage so respective staff login can read it as notifications
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

  // Update master announcement list
  localStorage.setItem(
    "hub_announcements",
    JSON.stringify(updated)
  );

  // Remove this announcement ID from every user's hidden list
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("hidden_notifications_")) {
      try {
        const hidden = JSON.parse(localStorage.getItem(key) || "[]");

        const cleaned = hidden.filter(
          (notificationId: number) => notificationId !== id
        );

        localStorage.setItem(key, JSON.stringify(cleaned));
      } catch (err) {
        console.error("Error updating hidden notifications", err);
      }
    }
  });
};

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-emerald-500 p-3 rounded-xl text-white">
          <Rocket size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quick Hub</h1>
          <p className="text-gray-500 text-sm">Manage external tools & broadcast announcements to staff.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'links' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Rocket size={18} />
          <span>Quick Links</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'announcements' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Megaphone size={18} />
          <span>Announcements</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'links' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Configured Tools</h2>
            <button
              onClick={() => setIsToolModalOpen(true)}
              className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Plus size={18} />
              <span>Add Tool</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">TOOL</th>
                  <th className="p-4 font-medium">URL</th>
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
                    <tr key={tool.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4 flex items-center space-x-3">
                        <div className={`p-2 rounded-lg text-white ${tool.bgColor}`}>
                          {renderToolIcon(tool.iconName)}
                        </div>
                        <span className="font-medium text-gray-800">{tool.name}</span>
                      </td>
                      <td className="p-4 text-blue-600 truncate max-w-md">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center space-x-1">
                          <span>{tool.url}</span>
                          <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteTool(tool.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded transition"
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Active Announcements</h2>
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
            >
              <Plus size={18} />
              <span>New Announcement</span>
            </button>
          </div>

          {announcements.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Megaphone size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">No Active Announcements</h3>
              <p className="text-gray-400 text-sm mb-4">Broadcast updates or information to staff members.</p>
              <button
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
              >
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                  <div className="flex space-x-4">
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-xl h-fit">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800 text-base">{ann.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ann.targetAll ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                          {ann.targetAll ? 'All Staff' : `${ann.selectedStaff.length} Staff Selected`}
                        </span>
                      </div>
                      {ann.subtitle && <p className="text-xs text-gray-500 mt-0.5">{ann.subtitle}</p>}
                      <p className="text-gray-600 text-sm mt-2">{ann.content}</p>
                      <div className="text-xs text-gray-400 mt-3 flex items-center gap-2">
                        <span>Published on: {ann.date}</span>
                        {!ann.targetAll && (
                          <span className="text-purple-600 font-medium">({ann.selectedStaff.join(', ')})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsToolModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add External Tool</h3>
            <form onSubmit={handleAddTool} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Tool Name</label>
                <input 
                  type="text" 
                  value={toolName} 
                  onChange={(e) => setToolName(e.target.value)} 
                  placeholder="e.g. ChatGPT" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Visiting URL</label>
                <input 
                  type="url" 
                  value={toolUrl} 
                  onChange={(e) => setToolUrl(e.target.value)} 
                  placeholder="https://example.com" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  required 
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Select Icon</label>
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
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Background Color</label>
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
                <button type="button" onClick={() => setIsToolModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">Save Tool</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAnnouncementModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create Announcement</h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Title</label>
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
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Subtitle (Optional)</label>
                <input 
                  type="text" 
                  value={annSubtitle} 
                  onChange={(e) => setAnnSubtitle(e.target.value)} 
                  placeholder="e.g. Regarding new policy" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Points / Content</label>
                <textarea 
                  value={annContent} 
                  onChange={(e) => setAnnContent(e.target.value)} 
                  placeholder="Enter details here..." 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Target Staff Section with Dynamic Staff List */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Target Staff</label>
                
                {/* All Staff Option */}
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

                {/* Individual Staff Selection List (Dynamic from Staff Management / localStorage) */}
                {!targetAllStaff && (
                  <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto bg-gray-50/50 p-2 space-y-1">
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
                <button type="button" onClick={() => setIsAnnouncementModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow transition">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}