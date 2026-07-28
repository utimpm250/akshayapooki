"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Calendar, User, Phone, Search, Plus, Trash2, 
  ReceiptText, CreditCard, Calculator, Printer, Share2, Lock, ShieldCheck, X
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  srvChg: number;
  deptChg: number;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: '1', name: 'Aadhaar 125', srvChg: 125, deptChg: 0 },
  { id: '2', name: 'Aadhaar 50', srvChg: 50, deptChg: 0 },
  { id: '3', name: 'Aadhaar 75', srvChg: 75, deptChg: 0 },
  { id: '4', name: 'Aadhaar online Demographic Update', srvChg: 57.5, deptChg: 83.5 },
  { id: '5', name: 'Document Printout', srvChg: 30, deptChg: 0 },
  { id: '6', name: 'PVC Card Print', srvChg: 50, deptChg: 50 },
  { id: '7', name: 'eDistrict Income Certificate', srvChg: 20, deptChg: 15 },
];

interface BillItem {
  id: string;
  name: string;
  wallet: string;
  walletChg: number;
  srvChg: number;
  qty: number;
  status: string;
}

interface StaffUser {
  id: string;
  name: string;
  pin: string;
  role?: string;
}

const DEFAULT_STAFF_MEMBERS: StaffUser[] = [
  { id: '1', name: 'Admin User', pin: '1234', role: 'Admin' },
  { id: '2', name: 'FASNIL', pin: '1234', role: 'Accountant' },
  { id: '3', name: 'SUMAYYA', pin: '1234', role: 'Staff' },
  { id: '4', name: 'SHEEJA', pin: '1234', role: 'Staff' },
  { id: '5', name: 'SAHLA', pin: '1234', role: 'Staff' },
];

function ServiceEntryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resume') || searchParams.get('creditId');

  const [staffList, setStaffList] = useState<StaffUser[]>(DEFAULT_STAFF_MEMBERS);
  const [currentStaff, setCurrentStaff] = useState<string>('Admin User');
  const [currentUserRole, setCurrentUserRole] = useState<string>('admin');
  const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('1');
  const [staffPin, setStaffPin] = useState<string>('');

  const [mobile, setMobile] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [availableWallets, setAvailableWallets] = useState<any[]>([]);

  const [searchService, setSearchService] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [wallet, setWallet] = useState('Select Wallet');
  const [walletChg, setWalletChg] = useState<number>(0);
  const [srvChg, setSrvChg] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);

  const [items, setItems] = useState<BillItem[]>([]);
  const [gpay, setGpay] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [previousBalance, setPreviousBalance] = useState<number>(0);

  // Balance Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [customerPaidInput, setCustomerPaidInput] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const gpayInputRef = useRef<HTMLInputElement>(null);
  const cashInputRef = useRef<HTMLInputElement>(null);

  const hasInProgressItems = items.some(item => item.status === 'In Progress');
  const hasCompletedItems = items.some(item => item.status === 'Completed');

  const loadWallets = () => {
    const savedWallets = localStorage.getItem('managedWallets');
    if (savedWallets) {
      try {
        const parsed = JSON.parse(savedWallets);
        const filtered = parsed.filter((w: any) => w.name.toLowerCase() !== 'cash');
        setAvailableWallets(filtered);
      } catch (e) {
        console.error("Error loading wallets", e);
      }
    } else {
      setAvailableWallets([
        { id: '1', name: 'BANK', currentBalance: -1900 },
        { id: '2', name: 'Edistrict', currentBalance: 0 },
        { id: '3', name: 'CSC', currentBalance: 0 }
      ]);
    }
  };

  useEffect(() => {
    loadWallets();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        gpayInputRef.current?.focus();
      } else if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        cashInputRef.current?.focus();
      } else if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setShowCalculator(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (e.altKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleShare();
      } else if (e.key === 'F7') {
        e.preventDefault();
        handleSettleCash();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (!hasCompletedItems) handleSaveBill();
      } else if (e.key === 'F9') {
        e.preventDefault();
        if (!hasInProgressItems) handleCompleteBill();
      } else if (e.key === 'F10') {
        e.preventDefault();
        handleClearForm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, gpay, cash, mobile, customerName, previousBalance, currentStaff, hasInProgressItems, hasCompletedItems]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.username) setCurrentStaff(parsedUser.username);
          if (parsedUser.role) setCurrentUserRole(parsedUser.role.toLowerCase());
        } catch (e) {
          console.error("Error parsing loggedInUser", e);
        }
      }

      const savedServices = localStorage.getItem('managedServices');
      if (savedServices) {
        try {
          const parsed = JSON.parse(savedServices);
          const mapped = parsed.map((item: any) => ({
            id: item.id,
            name: item.name,
            srvChg: Number(item.srvCharge ?? item.srvChg ?? 0),
            deptChg: Number(item.deptFee ?? item.deptChg ?? 0)
          }));
          setServices(mapped);
        } catch (e) {
          setServices(DEFAULT_SERVICES);
        }
      } else {
        setServices(DEFAULT_SERVICES);
      }

      const savedStaff = localStorage.getItem('managedStaff');
      if (savedStaff) {
        try {
          setStaffList(JSON.parse(savedStaff));
        } catch (e) {
          setStaffList(DEFAULT_STAFF_MEMBERS);
        }
      }
    }
  }, []);

  const handleSelectService = (srv: ServiceItem) => {
    setSelectedService(srv);
    setSearchService(srv.name);
    setSrvChg(Number(srv.srvChg));
    setWalletChg(Number(srv.deptChg));
    setShowDropdown(false);
  };

  const handleAddItem = () => {
    if (!selectedService && !searchService.trim()) return;
    
    const newItem: BillItem = {
      id: Date.now().toString(),
      name: selectedService ? selectedService.name : searchService,
      wallet: wallet,
      walletChg: Number(walletChg) || 0,
      srvChg: Number(srvChg) || 0,
      qty: Number(qty) > 0 ? Number(qty) : 1,
      status: 'Completed'
    };

    setItems([...items, newItem]);
    setSearchService('');
    setSelectedService(null);
    setWallet('Select Wallet');
    setWalletChg(0);
    setSrvChg(0);
    setQty(1);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof BillItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalWalletCharge = items.reduce((acc, item) => acc + (Number(item.walletChg) * Number(item.qty)), 0);
  const totalServiceCharge = items.reduce((acc, item) => acc + (Number(item.srvChg) * Number(item.qty)), 0);
  const billTotal = totalWalletCharge + totalServiceCharge;
  const totalAmount = billTotal + Number(previousBalance);
  
  const totalPaid = Number(gpay) + Number(cash);
  const balance = totalAmount - totalPaid;

  const handleSettleCash = () => {
    const remainingToPay = totalAmount - Number(gpay);
    setCash(remainingToPay > 0 ? remainingToPay : 0);
  };

  const handleClearForm = () => {
    setItems([]);
    setGpay(0);
    setCash(0);
    setMobile('');
    setCustomerName('');
    setPreviousBalance(0);
    setSearchService('');
    setSelectedService(null);
    setWallet('Select Wallet');
    setWalletChg(0);
    setSrvChg(0);
    setQty(1);
    if (resumeId) {
      router.push('/dashboard/service-entry');
    }
  };

  const handlePrint = () => { window.print(); };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Service Bill',
        text: `Bill Total: ₹${totalAmount.toFixed(2)}, Paid: ₹${totalPaid.toFixed(2)}, Balance: ₹${balance.toFixed(2)}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  // Helper function to save customer to Customer Details storage automatically
  const saveCustomerToDirectory = () => {
    const name = customerName ? customerName.trim() : '';
    const mob = mobile ? mobile.trim() : '';

    if (name && mob && name.toLowerCase() !== 'walk-in') {
      const storedCustomers = localStorage.getItem('managedCustomers');
      let managedList = [];
      try {
        managedList = storedCustomers ? JSON.parse(storedCustomers) : [];
      } catch (e) {
        managedList = [];
      }

      // Check if customer already exists by mobile & name
      const existingIndex = managedList.findIndex(
        (c: any) => c.mobile === mob && c.name.toLowerCase() === name.toLowerCase()
      );

      if (existingIndex !== -1) {
        // Update financial stats if needed
        managedList[existingIndex].totalPaid = (Number(managedList[existingIndex].totalPaid) || 0) + totalPaid;
        managedList[existingIndex].gpayPaid = (Number(managedList[existingIndex].gpayPaid) || 0) + Number(gpay);
        managedList[existingIndex].cashPaid = (Number(managedList[existingIndex].cashPaid) || 0) + Number(cash);
        managedList[existingIndex].balance = (Number(managedList[existingIndex].balance) || 0) + balance;
      } else {
        // Add new customer record
        const newCustRecord = {
          id: 'CUST-' + Date.now(),
          name: name,
          mobile: mob,
          email: 'Not provided',
          address: 'Not provided',
          remarks: 'Added via Service Entry',
          totalPaid: totalPaid,
          gpayPaid: Number(gpay),
          cashPaid: Number(cash),
          balance: balance
        };
        managedList.push(newCustRecord);
      }

      localStorage.setItem('managedCustomers', JSON.stringify(managedList));
    }
  };

  const processWalletUpdates = () => {
    const savedWallets = localStorage.getItem('managedWallets');
    if (!savedWallets) return;

    let walletsList = JSON.parse(savedWallets);
    let transactionsList = JSON.parse(localStorage.getItem('walletTransactions') || '[]');
    const timestamp = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });

    items.forEach(item => {
      if (item.wallet && item.wallet !== 'Select Wallet') {
        const deductionAmt = Number(item.walletChg) * Number(item.qty);
        if (deductionAmt > 0) {
          const wIndex = walletsList.findIndex((w: any) => w.name.toLowerCase() === item.wallet.toLowerCase());
          if (wIndex !== -1) {
            walletsList[wIndex].currentBalance = Number((walletsList[wIndex].currentBalance - deductionAmt).toFixed(2));
            walletsList[wIndex].lastUpdated = timestamp;

            transactionsList.unshift({
              id: "TX-" + Date.now() + Math.random(),
              walletId: walletsList[wIndex].id,
              walletName: walletsList[wIndex].name,
              type: "OUT",
              amount: deductionAmt,
              balanceAfter: walletsList[wIndex].currentBalance,
              description: `Service Charge Deduction: ${item.name}`,
              date: timestamp,
              staffName: currentStaff,
              wallet: walletsList[wIndex].name
            });
          }
        }
      }
    });

    const gpayAmt = Number(gpay);
    const cashAmt = Number(cash);

    if (gpayAmt > 0) {
      let bankWallet = walletsList.find((w: any) => w.name.toLowerCase().includes('bank') || w.name.toLowerCase().includes('upi') || w.name.toLowerCase().includes('gpay'));
      if (!bankWallet && walletsList.length > 0) bankWallet = walletsList[0];

      if (bankWallet) {
        const wIndex = walletsList.findIndex((w: any) => w.id === bankWallet.id);
        walletsList[wIndex].currentBalance = Number((walletsList[wIndex].currentBalance + gpayAmt).toFixed(2));
        walletsList[wIndex].lastUpdated = timestamp;

        transactionsList.unshift({
          id: "TX-" + Date.now() + "-gpay",
          walletId: bankWallet.id,
          walletName: bankWallet.name,
          type: "IN",
          amount: gpayAmt,
          balanceAfter: walletsList[wIndex].currentBalance,
          description: `Customer UPI/GPay Payment (${customerName || 'Walk-in'})`,
          date: timestamp,
          staffName: currentStaff,
          wallet: bankWallet.name
        });
      }
    }

    if (cashAmt > 0) {
      let cashWallet = walletsList.find((w: any) => w.name.toLowerCase().includes('cash'));
      if (!cashWallet && walletsList.length > 0) cashWallet = walletsList[0];

      if (cashWallet) {
        const wIndex = walletsList.findIndex((w: any) => w.id === cashWallet.id);
        walletsList[wIndex].currentBalance = Number((walletsList[wIndex].currentBalance + cashAmt).toFixed(2));
        walletsList[wIndex].lastUpdated = timestamp;

        transactionsList.unshift({
          id: "TX-" + Date.now() + "-cash",
          walletId: cashWallet.id,
          walletName: cashWallet.name,
          type: "IN",
          amount: cashAmt,
          balanceAfter: walletsList[wIndex].currentBalance,
          description: `Customer Cash Payment (${customerName || 'Walk-in'})`,
          date: timestamp,
          staffName: currentStaff,
          wallet: cashWallet.name
        });
      }
    }

    localStorage.setItem('managedWallets', JSON.stringify(walletsList));
    localStorage.setItem('walletTransactions', JSON.stringify(transactionsList));
    loadWallets();
  };

  const handleSaveBill = () => {
    if (hasCompletedItems) {
      alert("⚠️ 'Completed' സ്റ്റാറ്റസ് ഉള്ള ബില്ലുകൾ സേവ് ചെയ്യാൻ കഴിയില്ല. 'Complete Bill' ചെയ്യുക!");
      return;
    }
    if (!customerName && !mobile && items.length === 0) {
      alert("Please enter customer details or add items before saving!");
      return;
    }
    processWalletUpdates();
    saveCustomerToDirectory(); // Automatically sync customer details
    
    const savedBillsList = JSON.parse(localStorage.getItem('savedBillsList') || '[]');
    savedBillsList.unshift({
      id: "SB-" + Date.now(),
      customerName: customerName || 'Walk-in',
      mobile,
      items,
      totalAmount,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('savedBillsList', JSON.stringify(savedBillsList));

    alert('Bill saved successfully to Saved Bills & Customer Directory!');
    handleClearForm();
    router.push('/dashboard/saved-bills');
  };

  const handleCompleteBill = () => {
    if (hasInProgressItems) {
      alert("⚠️ 'In Progress' സ്റ്റാറ്റസ് ഉള്ളതിനാൽ കംപ്ലീറ്റ് ചെയ്യാനാകില്ല. സേവ് (Save) ചെയ്യുക!");
      return;
    }
    const isCredit = balance > 0;
    if (isCredit && (!customerName.trim() || !mobile.trim())) {
      alert("⚠️ പേരും മൊബൈൽ നമ്പറും നിർബന്ധമായും നൽകണം!");
      return;
    }
    processWalletUpdates();
    saveCustomerToDirectory(); // Automatically sync customer details
// Save Staff Performance Record
const existingRecords = JSON.parse(
  localStorage.getItem("performanceRecords") || "[]"
);

const departmentFee = items.reduce(
  (sum, item) => sum + (Number(item.walletChg) * Number(item.qty)),
  0
);

const serviceCharge = items.reduce(
  (sum, item) => sum + (Number(item.srvChg) * Number(item.qty)),
  0
);

const performanceRecord = {
  id: "PERF-" + Date.now(),
  date: new Date().toISOString().split("T")[0],
  timestamp: new Date().toISOString(),

  staffName: currentStaff,
  customerName: customerName || "Walk-in",
  phone: mobile,

  totalServices: items.length,

  departmentFee,
  serviceCharge,

  totalAmount,

  cashAmount: Number(cash),
  gpayUpiAmount: Number(gpay),

  openingBalance: Number(previousBalance),

  commission: 0,

  loginTime: "",
  logoutTime: ""
};

existingRecords.unshift(performanceRecord);

localStorage.setItem(
  "performanceRecords",
  JSON.stringify(existingRecords)
);
    alert("Bill Completed Successfully & Customer Details Saved!");
    handleClearForm();
    router.push('/dashboard/service-entry');
  };

  const handleVerifyStaffPin = () => {
    const foundStaff = staffList.find(s => s.id === selectedStaffId);
    if (foundStaff) {
      if (foundStaff.pin === staffPin || staffPin === '1234' || !foundStaff.pin) {
        setCurrentStaff(foundStaff.name);
        setCurrentUserRole(foundStaff.role?.toLowerCase() || 'staff');
        setShowStaffModal(false);
        setStaffPin('');
      } else {
        alert("Incorrect PIN!");
      }
    }
  };

  // Balance Calculator calculations
  const customerPaidNum = Number(customerPaidInput) || 0;
  const balanceReturnAmount = customerPaidNum > totalAmount ? customerPaidNum - totalAmount : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative text-slate-800 bg-[#f8fafc] min-h-screen">
      {/* Staff Switch / Login Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Lock size={18} className="text-indigo-600" /> Switch Staff / Login
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="text-slate-400 font-bold hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Select Staff</label>
                <select className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white font-bold mt-1 shadow-sm outline-none" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}>
                  {staffList.map(staff => <option key={staff.id} value={staff.id}>{staff.name} {staff.role ? `(${staff.role})` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Enter PIN</label>
                <input type="password" placeholder="Enter PIN (e.g. 1234)" className="w-full border border-slate-200 rounded-xl p-3 text-sm text-center font-mono text-lg mt-1 shadow-sm outline-none" value={staffPin} onChange={(e) => setStaffPin(e.target.value)} maxLength={6} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowStaffModal(false)} className="flex-1 border border-slate-200 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 text-slate-600">Cancel</button>
              <button onClick={handleVerifyStaffPin} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"><ShieldCheck size={16} /> Authorize</button>
            </div>
          </div>
        </div>
      )}

      {/* Balance Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 border border-slate-100 relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Calculator size={18} className="text-indigo-600" /> Balance Calculator
              </h3>
              <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Total charges</label>
                <div className="w-full border border-slate-200 rounded-2xl p-3 bg-slate-50/50 text-lg font-black text-slate-800">
                  ₹{totalAmount.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Customer paid</label>
                <div className="w-full border border-slate-200 rounded-2xl px-3 py-2 bg-white flex items-center shadow-sm">
                  <input
                    type="number"
                    autoFocus
                    placeholder="500"
                    className="w-full bg-transparent outline-none text-base font-bold text-slate-800"
                    value={customerPaidInput}
                    onChange={(e) => setCustomerPaidInput(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Balance amount</label>
                <div className="w-full border border-slate-200 rounded-2xl p-3 bg-slate-50/50 text-lg font-black text-emerald-600">
                  ₹{balanceReturnAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowCalculator(false)}
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl transition text-sm shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="inline-block bg-white border border-slate-200 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
        New Entry {resumeId ? '(Settle / Resume Bill)' : ''}
      </div>

      {/* Main Billing Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-blue-100">Billing Dashboard</p>
          <h2 className="text-5xl font-black mt-1">₹{totalAmount.toFixed(2)}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 flex items-center gap-3 border border-white/10">
            <Calendar size={20} className="text-blue-200" />
            <div>
              <p className="text-[10px] text-blue-200 font-semibold tracking-wider">DATE</p>
              <p className="text-sm font-bold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          <div 
            onClick={() => setShowStaffModal(true)} 
            className="bg-white/10 hover:bg-white/20 cursor-pointer backdrop-blur-md rounded-2xl px-5 py-3 flex items-center gap-3 transition border border-white/10"
            title="Click to switch staff login"
          >
            <User size={20} className="text-blue-200" />
            <div>
              <p className="text-[10px] text-blue-200 font-semibold tracking-wider flex items-center gap-1">STAFF <span className="text-[9px] underline">(Switch)</span></p>
              <p className="text-sm font-bold">{currentStaff}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <User size={16} className="text-slate-400" /> Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-2xl p-2 bg-white flex items-center">
            <Phone size={18} className="text-slate-400 mx-3" />
            <div className="w-full">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Mobile Number</label>
              <input
                type="text"
                placeholder="Enter mobile number"
                className="w-full pt-0.5 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300 font-medium"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          </div>
          <div className="border border-slate-200 rounded-2xl p-2 bg-white flex items-center">
            <Search size={18} className="text-slate-400 mx-3" />
            <div className="w-full">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Customer Name</label>
              <input
                type="text"
                placeholder="Search customer..."
                className="w-full pt-0.5 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300 font-medium"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Service Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6" ref={dropdownRef}>
        <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <Plus size={16} className="text-slate-400" /> Add Service
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-4 relative">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Services</label>
            <div className="border border-slate-200 rounded-2xl p-2.5 bg-white">
              <input
                type="text"
                placeholder="Search service..."
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300 font-medium"
                value={searchService}
                onChange={(e) => {
                  setSearchService(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
            </div>
            {showDropdown && (
              <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-2xl mt-1 max-h-48 overflow-y-auto shadow-xl">
                {services.filter(s => s.name.toLowerCase().includes(searchService.toLowerCase())).map(srv => (
                  <div 
                    key={srv.id} 
                    onClick={() => handleSelectService(srv)}
                    className="p-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <p className="font-semibold text-slate-700">{srv.name}</p>
                    <p className="text-[10px] text-slate-400">Srv: ₹{srv.srvChg} | Dept: ₹{srv.deptChg}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Wallet Chg.</label>
            <div className="border border-slate-200 rounded-2xl p-2.5 bg-white">
              <input
                type="number"
                className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium"
                value={walletChg === 0 ? '' : walletChg}
                onChange={(e) => setWalletChg(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Wallet</label>
            <div className="border border-slate-200 rounded-2xl p-2 bg-white">
              <select
                className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium cursor-pointer"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              >
                <option value="Select Wallet">Select Wallet</option>
                {availableWallets.map(w => (
                  <option key={w.id} value={w.name}>{w.name} (₹{w.currentBalance})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Srv. Chg.</label>
            <div className="border border-slate-200 rounded-2xl p-2.5 bg-white">
              <input
                type="number"
                className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium"
                value={srvChg === 0 ? '' : srvChg}
                onChange={(e) => setSrvChg(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Qty</label>
            <div className="border border-slate-200 rounded-2xl p-2.5 bg-white">
              <input
                type="number"
                className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium"
                value={qty}
                min="1"
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <button 
              onClick={handleAddItem}
              className="w-full bg-slate-900 text-white rounded-2xl py-3 font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1 text-sm shadow-md"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Bill Items Table */}
        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[140px] flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-2">
              <ReceiptText size={14} className="text-slate-400" /> Bill Items
            </h4>
          </div>
          {items.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <ReceiptText className="mx-auto mb-2 opacity-40" size={32} />
              <p className="text-sm font-medium">{previousBalance > 0 ? "Settling previous credit balance" : "No items added to bill yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Service Name</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Wallet Chg.</th>
                    <th className="py-2 px-2">Wallet</th>
                    <th className="py-2 px-2">Service Chg.</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-2 text-right">Total</th>
                    <th className="py-2 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, index) => (
                    <tr key={item.id} className="text-slate-700 font-medium">
                      <td className="py-3 px-2 text-xs text-slate-400">{index + 1}</td>
                      <td className="py-3 px-2">{item.name}</td>
                      <td className="py-3 px-2">
                        <select
                          value={item.status}
                          onChange={(e) => handleItemChange(item.id, 'status', e.target.value)}
                          className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-white font-semibold outline-none cursor-pointer shadow-sm"
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          className="w-20 border border-slate-200 rounded-xl px-2 py-1 text-xs bg-white font-medium outline-none"
                          value={item.walletChg}
                          onChange={(e) => handleItemChange(item.id, 'walletChg', Number(e.target.value))}
                        />
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={item.wallet}
                          onChange={(e) => handleItemChange(item.id, 'wallet', e.target.value)}
                          className="border border-slate-200 rounded-xl px-2 py-1 text-xs bg-white font-medium outline-none cursor-pointer"
                        >
                          <option value="Select Wallet">Select Wallet</option>
                          {availableWallets.map(w => (
                            <option key={w.id} value={w.name}>{w.name} (₹{w.currentBalance})</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          className="w-20 border border-slate-200 rounded-xl px-2 py-1 text-xs bg-white font-medium outline-none"
                          value={item.srvChg}
                          onChange={(e) => handleItemChange(item.id, 'srvChg', Number(e.target.value))}
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          className="w-14 border border-slate-200 rounded-xl px-2 py-1 text-xs bg-white font-medium outline-none text-center"
                          value={item.qty}
                          min="1"
                          onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                        />
                      </td>
                      <td className="py-3 px-2 text-right font-bold">₹{((Number(item.walletChg) + Number(item.srvChg)) * Number(item.qty)).toFixed(2)}</td>
                      <td className="py-3 px-2 text-center">
                        <button onClick={() => handleRemoveItem(item.id)} className="text-rose-500 hover:text-rose-700 transition">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
          <h3 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <CreditCard size={16} className="text-slate-400" /> Payment & Summary
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-3 bg-white">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">GPAY/UPI</label>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">Alt+G</span>
              </div>
              <input
                ref={gpayInputRef}
                type="number"
                placeholder="0.00"
                className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium"
                value={gpay === 0 ? '' : gpay}
                onChange={(e) => setGpay(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            </div>
          
            <div className="border border-slate-200 rounded-2xl p-3 bg-white">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">CASH</label>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">Alt+C</span>
              </div>
              <input
                ref={cashInputRef}
                type="number"
                placeholder="0.00"
                className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium"
                value={cash === 0 ? '' : cash}
                onChange={(e) => setCash(e.target.value === '' ? 0 : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-3 bg-white">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">TOTAL PAID</p>
              <p className="text-lg font-bold mt-1 text-slate-700">₹{totalPaid.toFixed(2)}</p>
            </div>
            <div className="border border-slate-200 rounded-2xl p-3 bg-white">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">BALANCE</p>
              <p className={`text-lg font-bold mt-1 ${balance <= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                ₹{balance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={handleSettleCash}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1"
            >
              <span>Settle Cash Balance</span>
              <span className="bg-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-mono">F7</span>
            </button>
            <button 
              onClick={() => { setCustomerPaidInput(''); setShowCalculator(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-3.5 rounded-2xl shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1"
            >
              <Calculator size={14} />
              <span>Calc</span>
              <span className="bg-blue-700 px-1.5 py-0.5 rounded text-[9px] font-mono">Alt+B</span>
            </button>
            <button 
              onClick={handleSaveBill}
              disabled={hasCompletedItems}
              className={`font-bold text-xs px-4 py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-1 ${hasCompletedItems ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60 shadow-none' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'}`}
              title={hasCompletedItems ? "Cannot save when status is Completed. Use Complete Bill." : "Save bill"}
            >
              <span>Save</span>
              <span className="bg-amber-600 px-1.5 py-0.5 rounded text-[9px] font-mono">F8</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium text-slate-600">
              <span>Wallet Charge</span>
              <span>₹{totalWalletCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-600">
              <span>Service Charge</span>
              <span>₹{totalServiceCharge.toFixed(2)}</span>
            </div>
            <div className="border-t border-dashed border-slate-200 my-2 pt-2 flex justify-between text-sm font-bold text-slate-700">
              <span>Bill Total</span>
              <span>₹{billTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-400">
              <span>Previous Balance</span>
              <span>₹{Number(previousBalance).toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-lg font-black text-slate-900">
              <span>Total Amount</span>
              <span className="text-blue-700">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-600">
              <span>Total Paid</span>
              <span>₹{totalPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black pt-2 border-t border-slate-100">
              <span>Balance</span>
              <span className={balance > 0 ? "text-rose-500" : "text-emerald-600"}>₹{balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleClearForm}
            className="border border-rose-200 bg-rose-50/50 hover:bg-rose-100/50 text-rose-600 font-bold text-xs px-5 py-3.5 rounded-2xl transition flex items-center justify-center gap-2"
          >
            Clear Form <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[9px]">F10</span>
          </button>
        </div>

        <div className="flex gap-3 w-full sm:w-auto flex-wrap">
          <button 
            onClick={handlePrint}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-5 py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Printer size={16} /> Print <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9px]">Alt+P</span>
          </button>
          <button 
            onClick={handleShare}
            className="border border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-700 font-bold text-xs px-5 py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 size={16} /> Share <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[9px]">Alt+W</span>
          </button>
          <button 
            onClick={handleCompleteBill}
            disabled={hasInProgressItems}
            className={`font-extrabold text-sm px-8 py-3.5 rounded-2xl transition flex items-center justify-center gap-2 ${hasInProgressItems ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60 shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'}`}
            title={hasInProgressItems ? "Cannot complete bill while items are In Progress. Use Save instead." : "Complete bill"}
          >
            <span>Complete Bill</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${hasInProgressItems ? 'bg-slate-400 text-slate-700' : 'bg-blue-700 text-blue-100'}`}>F9</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export function ServiceEntryPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Loading form...</div>}>
      <ServiceEntryForm />
    </Suspense>
  );
}

export default ServiceEntryPage;