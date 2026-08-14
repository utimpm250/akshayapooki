"use client";

import html2canvas from "html2canvas";
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuickReceiptScan from "./components/QuickReceiptScan";
import { 
  Calendar, User, Phone, Search, Plus, Trash2, 
  ReceiptText, CreditCard, Calculator, Printer, Share2, QrCode, Lock, ShieldCheck, X, Palette
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  srvChg: number;
  deptChg: number;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: '1', name: 'Aadhaar [Aadhaar Redacted]', srvChg: 125, deptChg: 0 },
  { id: '2', name: 'Aadhaar [Aadhaar Redacted]', srvChg: 50, deptChg: 0 },
  { id: '3', name: 'Aadhaar [Aadhaar Redacted]', srvChg: 75, deptChg: 0 },
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
  const editId = searchParams.get('edit');
  const resumeId = searchParams.get('resume') || searchParams.get('creditId') || editId;

  // Theme State
  const [currentTheme, setCurrentTheme] = useState<string>('slate');

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

  const [savedCustomersList, setSavedCustomersList] = useState<any[]>([]);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [showNameDropdown, setShowNameDropdown] = useState(false);

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

  const [showCalculator, setShowCalculator] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isModalGPayQr, setIsModalGPayQr] = useState(true);

  const [showPaymentQRModal, setShowPaymentQRModal] = useState(false);

  const [lastCompletedBill, setLastCompletedBill] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showCopyQrToast, setShowCopyQrToast] = useState(false);

  const serviceInputRef = useRef<HTMLInputElement>(null);
  const qrBoxRef = useRef<HTMLDivElement>(null);
  const paymentQrBoxRef = useRef<HTMLDivElement>(null);
  const [billCompleted, setBillCompleted] = useState(false);
  const [customerPaidInput, setCustomerPaidInput] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const customerDropdownRef = useRef<HTMLDivElement>(null);

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

  const loadSavedCustomers = () => {
    try {
      const stored = localStorage.getItem('managedCustomers');
      if (stored) {
        setSavedCustomersList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading saved customers", e);
    }
  };

  useEffect(() => {
    loadWallets();
    loadSavedCustomers();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node)) {
        setShowMobileDropdown(false);
        setShowNameDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      loadManagedServices();

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

  const loadManagedServices = () => {
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
  };


  // Resume a previously saved draft bill with the exact saved customer,
  // service items, quantities and payment values.
  useEffect(() => {
    if (!resumeId || typeof window === 'undefined') return;

    try {
      let bill: any = null;

      // Billed Services -> Edit uses this payload. It contains the complete
      // original bill, including every service item.
      if (editId) {
        const editRaw = localStorage.getItem('serviceEntryEditData');
        if (editRaw) {
          try {
            const editData = JSON.parse(editRaw);
            if (
              String(editData?.billId || editData?.id || '') === String(resumeId) ||
              String(editData?.id || '') === String(editId)
            ) {
              bill = editData;
            }
          } catch (error) {
            console.error('Failed to parse serviceEntryEditData:', error);
          }
        }
      }

      // Saved Bill / Credit resume remains fully compatible.
      if (!bill) {
        const savedBills = JSON.parse(localStorage.getItem('savedBillsList') || '[]');
        const savedBill = Array.isArray(savedBills)
          ? savedBills.find((candidate: any) =>
              String(candidate.id || candidate.billId || '') === String(resumeId)
            )
          : null;

        const creditBills = JSON.parse(localStorage.getItem('smart_akshaya_bills') || '[]');
        const creditBill = !savedBill && Array.isArray(creditBills)
          ? creditBills.find((candidate: any) =>
              String(candidate.id || candidate.billId || '') === String(resumeId)
            )
          : null;

        bill = savedBill || creditBill;
      }

      if (!bill) return;

      setCustomerName(String(bill.customerName || bill.name || ''));
      setMobile(String(bill.mobile || bill.mobileNumber || bill.customerPhone || ''));
      setGpay(Number(bill.gpay ?? bill.gpayAmount ?? bill.totalPaid ?? 0));
      setCash(Number(bill.cash ?? bill.cashReceived ?? 0));
      setPreviousBalance(Number(bill.previousBalance ?? 0));

      const restoredItems = Array.isArray(bill.items)
        ? bill.items.map((item: any, index: number) => ({
            id: String(item.id || `RESUME-${Date.now()}-${index}`),
            name: String(item.name || item.serviceName || item.service || 'Service'),
            wallet: String(item.wallet || item.walletName || 'Select Wallet'),
            walletChg: Number(item.walletChg ?? item.deptChg ?? item.deptFee ?? 0),
            srvChg: Number(
              item.srvChg ??
              item.srvCharge ??
              item.serviceCharge ??
              item.totalAmount ??
              item.total ??
              0
            ),
            qty: Number(item.qty ?? item.quantity ?? 1) > 0
              ? Number(item.qty ?? item.quantity ?? 1)
              : 1,
            status: String(item.status || 'Completed').toLowerCase() === 'completed'
              ? 'Completed'
              : 'In Progress',
          }))
        : [];

      setItems(restoredItems);
      setSearchService('');
      setSelectedService(null);
      setWallet('Select Wallet');
      setWalletChg(0);
      setSrvChg(0);
      setQty(1);
      setShowDropdown(false);

      setTimeout(() => serviceInputRef.current?.focus(), 150);
    } catch (error) {
      console.error('Failed to resume/edit bill:', error);
    }
  }, [resumeId, editId]);

  const registerNewServicesIfNeeded = () => {
    try {
      const storedServices = localStorage.getItem('managedServices');
      let managedList = storedServices ? JSON.parse(storedServices) : [];

      let updated = false;
      items.forEach(item => {
        if (!item.name) return;
        const exists = managedList.some((s: any) => s.name.toLowerCase() === item.name.toLowerCase());
        if (!exists) {
          managedList.push({
            id: "SRV-" + Date.now() + Math.random(),
            name: item.name,
            defaultWallet: item.wallet !== 'Select Wallet' ? item.wallet : 'BANK',
            deptFee: Number(item.walletChg) || 0,
            srvCharge: Number(item.srvChg) || 0,
            commission: 0,
            pinned: false,
            category: 'General',
            status: 'Active'
          });
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem('managedServices', JSON.stringify(managedList));
        loadManagedServices();
      }
    } catch (e) {
      console.error("Error registering new services", e);
    }
  };

  const handleSelectService = (srv: ServiceItem) => {
    setSelectedService(srv);
    setSearchService(srv.name);
    setSrvChg(Number(srv.srvChg));
    setWalletChg(Number(srv.deptChg));
    
    try {
      const storedServices = localStorage.getItem('managedServices');
      if (storedServices) {
        const parsed = JSON.parse(storedServices);
        const found = parsed.find((s: any) => s.name.toLowerCase() === srv.name.toLowerCase());
        if (found && found.defaultWallet) {
          setWallet(found.defaultWallet);
        }
      }
    } catch (e) {
      console.error(e);
    }

    setShowDropdown(false);
  };

  const handleSelectCustomer = (cust: any) => {
    setCustomerName(cust.name || '');
    setMobile(cust.mobile || '');
    setShowMobileDropdown(false);
    setShowNameDropdown(false);
  };

  const handleAddItem = () => {
    if (!selectedService && !searchService.trim()) return;
    
    const newItem: BillItem = {
      id: Date.now().toString(),
      name: selectedService ? selectedService.name : searchService.trim(),
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
    setShowDropdown(false);
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
    setShowDropdown(false);
    if (resumeId) {
      router.push('/dashboard/service-entry');
    }
    setTimeout(() => {
      serviceInputRef.current?.focus();
    }, 100);
    setBillCompleted(false);
  };
  
  const handlePrint = () => {
    const targetBill = lastCompletedBill || {
      customerName: customerName || "Walk-in",
      mobile: mobile || "-",
      items: items.length > 0 ? items : [{ name: "Current Session", walletChg, srvChg, qty, status: "Completed" }],
      totalAmount: totalAmount || billTotal,
      gpay,
      cash,
      totalPaid,
      balance,
      date: new Date().toLocaleString(),
    };

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

    const itemRows = targetBill.items
      .map(
        (item: any, index: number) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>₹${Number(item.walletChg || 0).toFixed(2)}</td>
          <td>₹${Number(item.srvChg || 0).toFixed(2)}</td>
          <td>${item.qty || 1}</td>
          <td>${item.status ?? "Completed"}</td>
          <td style="text-align:right">
            ₹${((Number(item.walletChg || 0) + Number(item.srvChg || 0)) * Number(item.qty || 1)).toFixed(2)}
          </td>
        </tr>`
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;}
          body{padding:25px;font-size:12px;color:#000;}
          .invoice{width:100%;border:2px solid #222;padding:12px;}
          .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;}
          .left{width:35%;}
          .center{width:30%;text-align:center;}
          .right{width:35%;}
          .title{display:inline-block;background:#fff48a;border:1px solid #888;padding:4px 18px;font-size:22px;font-weight:bold;margin-bottom:10px;}
          .company{font-size:22px;font-weight:bold;line-height:30px;}
          .small{font-size:12px;line-height:18px;}
          .blue{background:#8eaaf8;color:white;padding:4px 8px;font-weight:bold;margin-bottom:6px;}
          table{width:100%;border-collapse:collapse;margin-top:10px;}
          th{background:#8eaaf8;color:white;padding:6px;border:1px solid #777;font-size:12px;}
          td{border:1px solid #777;padding:6px;font-size:12px;}
          .footer{margin-top:18px;text-align:center;font-size:11px;color:#555;}
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="left">
              <div class="company">AKSHAYA CENTRE<br>POOKIPARAMBA</div>
              <div class="small">MPM250<br>Ph : 9037298582<br>Email : akshayapkp@gmail.com</div>
            </div>
            <div class="center">
              <div class="title">INVOICE</div>
              <div style="text-align:left">
                <b>Bill # :</b> MPM${Date.now()}<br>
                <b>Date :</b> ${targetBill.date}<br>
                <b>Created By :</b> ${currentStaff}
              </div>
            </div>
            <div class="right">
              <div class="blue">Customer</div>
              <div class="small">
                <b>Name :</b> ${targetBill.customerName || "Walk-in"}<br>
                <b>Phone :</b> ${targetBill.mobile || "-"}
              </div>
            </div>
          </div>
          <div class="blue">Service Details</div>
          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Service</th>
                <th>Dept Fee</th>
                <th>Svc Charge</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <br>
          <div class="blue">Payment Summary</div>
          <table>
            <tr>
              <td><b>Total Dept Fee</b></td>
              <td style="text-align:right">₹${totalWalletCharge.toFixed(2)}</td>
              <td><b>GPay</b></td>
              <td style="text-align:right">₹${Number(targetBill.gpay || gpay).toFixed(2)}</td>
            </tr>
            <tr>
              <td><b>Total Service Charge</b></td>
              <td style="text-align:right">₹${totalServiceCharge.toFixed(2)}</td>
              <td><b>Cash</b></td>
              <td style="text-align:right">₹${Number(targetBill.cash || cash).toFixed(2)}</td>
            </tr>
            <tr>
              <td><b>Gross Total</b></td>
              <td style="text-align:right">₹${Number(targetBill.totalAmount || totalAmount).toFixed(2)}</td>
              <td><b>Total Paid</b></td>
              <td style="text-align:right">₹${Number(targetBill.totalPaid || totalPaid).toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td><b>Balance</b></td>
              <td style="text-align:right">₹${Number(targetBill.balance || balance).toFixed(2)}</td>
            </tr>
          </table>
          <div class="footer">
            <hr style="margin:20px 0;">
            <h3 style="margin-bottom:8px;">Thank You!</h3>
            <p>We appreciate your visit to <b>Akshaya e Centre Pookiparamba</b>.</p>
            <p style="margin-top:8px;">This is a computer generated invoice.</p>
            <p style="margin-top:6px;">Generated on : ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };
  
  const handleShare = async () => {
    const targetBill = lastCompletedBill || {
      customerName: customerName || "Walk-in",
      mobile: mobile || "-",
      items: items.length > 0 ? items : [{ name: "Current Session", walletChg, srvChg, qty, status: "Completed" }],
      totalAmount: totalAmount || billTotal,
      gpay,
      cash,
      totalPaid,
      balance,
      date: new Date().toLocaleString(),
    };

    try {
      const container = document.createElement("div");
      container.style.width = "600px";
      container.style.background = "#ffffff";
      container.style.padding = "20px";
      container.style.fontFamily = "Arial";
      container.style.color = "#000";

      const rows = targetBill.items
        .map(
          (item: any) => `
          <tr>
            <td style="border:1px solid #999;padding:6px;">${item.name}</td>
            <td style="border:1px solid #999;padding:6px;text-align:center;">${item.qty || 1}</td>
            <td style="border:1px solid #999;padding:6px;text-align:right;">₹${(Number(item.walletChg || 0) + Number(item.srvChg || 0)).toFixed(2)}</td>
            <td style="border:1px solid #999;padding:6px;text-align:right;">₹${(((Number(item.walletChg || 0) + Number(item.srvChg || 0)) * Number(item.qty || 1))).toFixed(2)}</td>
          </tr>`
        )
        .join("");

      container.innerHTML = `
        <div style="text-align:center;">
          <h2 style="margin:0;">Akshaya e Centre</h2>
          <h3 style="margin:4px 0;">MPM250</h3>
          <div>POOKIPARAMBA</div>
          <div>Ph : 9037298582</div>
          <hr>
          <h2>INVOICE</h2>
        </div>
        <p><b>Customer :</b> ${targetBill.customerName || "Walk-in"}</p>
        <p><b>Phone :</b> ${targetBill.mobile || "-"}</p>
        <p><b>Date :</b> ${targetBill.date}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <tr style="background:#7e9cff;color:white;">
            <th style="border:1px solid #999;padding:6px;">Item</th>
            <th style="border:1px solid #999;padding:6px;">Qty</th>
            <th style="border:1px solid #999;padding:6px;">Rate</th>
            <th style="border:1px solid #999;padding:6px;">Total</th>
          </tr>
          ${rows}
        </table>
        <table style="width:100%;margin-top:15px;border-collapse:collapse;">
          <tr>
            <td style="border:1px solid #999;padding:6px;"><b>Gross Total</b></td>
            <td style="border:1px solid #999;padding:6px;text-align:right;"><b>₹${Number(targetBill.totalAmount).toFixed(2)}</b></td>
          </tr>
          <tr>
            <td style="border:1px solid #999;padding:6px;">GPay / UPI</td>
            <td style="border:1px solid #999;padding:6px;text-align:right;">₹${Number(targetBill.gpay).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="border:1px solid #999;padding:6px;">Cash</td>
            <td style="border:1px solid #999;padding:6px;text-align:right;">₹${Number(targetBill.cash).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="border:1px solid #999;padding:6px;"><b>Balance</b></td>
            <td style="border:1px solid #999;padding:6px;text-align:right;"><b>₹${Number(targetBill.balance).toFixed(2)}</b></td>
          </tr>
        </table>
        <div style="margin-top:20px;text-align:center;font-size:13px;color:#555;">
          Thank you for choosing<br><b>Akshaya e Centre POOKIPARAMBA</b>
        </div>
      `;

      document.body.appendChild(container);

      // @ts-ignore
      const canvas = await html2canvas(container, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
      });

      document.body.removeChild(container);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setShowShareToast(true);
          setTimeout(() => setShowShareToast(false), 3000);
        } catch (err) {
          alert("Clipboard copy failed.");
        }
      });
    } catch (err) {
      console.error(err);
      alert("Unable to prepare invoice.");
    }
  };

  const saveCustomerToDirectory = () => {
    const name = customerName ? customerName.trim() : "";
    const mob = mobile ? mobile.trim() : "";

    if (name && mob && name.toLowerCase() !== "walk-in") {
      const storedCustomers = localStorage.getItem("managedCustomers");
      let managedList = [];

      try {
        managedList = storedCustomers ? JSON.parse(storedCustomers) : [];
      } catch {
        managedList = [];
      }

      const existingIndex = managedList.findIndex(
        (c: any) => c.mobile === mob && c.name.toLowerCase() === name.toLowerCase()
      );

      if (existingIndex !== -1) {
        managedList[existingIndex].totalPaid = (Number(managedList[existingIndex].totalPaid) || 0) + totalPaid;
        managedList[existingIndex].gpayPaid = (Number(managedList[existingIndex].gpayPaid) || 0) + Number(gpay);
        managedList[existingIndex].cashPaid = (Number(managedList[existingIndex].cashPaid) || 0) + Number(cash);
        managedList[existingIndex].balance = (Number(managedList[existingIndex].balance) || 0) + balance;
      } else {
        managedList.push({
          id: "CUST-" + Date.now(),
          name,
          mobile: mob,
          email: "Not provided",
          address: "Not provided",
          remarks: "Added via Service Entry",
          totalPaid,
          gpayPaid: Number(gpay),
          cashPaid: Number(cash),
          balance,
        });
      }

      localStorage.setItem("managedCustomers", JSON.stringify(managedList));
      loadSavedCustomers();
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

    registerNewServicesIfNeeded();

    // Save is only a draft. Do not create a billed-service transaction yet.
    const billId = resumeId || ("SB-" + Date.now());
    const billTimestamp = new Date().toLocaleString();
    const savedBillsList = JSON.parse(localStorage.getItem('savedBillsList') || '[]');

    const savedBill = {
      id: billId,
      billId,
      customerName: customerName || 'Walk-in',
      mobile,
      items: items.map(item => ({ ...item })),
      totalAmount,
      totalPaid,
      balance,
      gpay: Number(gpay),
      cash: Number(cash),
      previousBalance: Number(previousBalance),
      date: billTimestamp,
      dateTime: billTimestamp,
      staffName: currentStaff,
      status: 'draft',
    };

    const withoutCurrent = Array.isArray(savedBillsList)
      ? savedBillsList.filter(
          (bill: any) => String(bill.id || bill.billId || '') !== String(billId)
        )
      : [];

    withoutCurrent.unshift(savedBill);
    localStorage.setItem('savedBillsList', JSON.stringify(withoutCurrent));

    alert('Bill saved successfully to Saved Bills & Customer Directory!');

    // Always return to a fresh Service Entry form after saving.
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
    setShowDropdown(false);
    setBillCompleted(false);

    router.push('/dashboard/service-entry');
    setTimeout(() => serviceInputRef.current?.focus(), 150);
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

    registerNewServicesIfNeeded();
    processWalletUpdates();
    saveCustomerToDirectory();

    const billId = resumeId || ("BILL-" + Date.now());
    const billDate = new Date().toLocaleDateString('en-GB');
    const billTimestamp = new Date().toLocaleString();

    // Create the real billed-service records only now.
    const serviceEntries = JSON.parse(localStorage.getItem('serviceEntries') || '[]');
    const entriesWithoutThisBill = Array.isArray(serviceEntries)
      ? serviceEntries.filter(
          (entry: any) => String(entry.billId || '') !== String(billId)
        )
      : [];

    items.forEach((item) => {
      const itemQty = Number(item.qty) || 1;
      const itemTotal =
        (Number(item.walletChg || 0) + Number(item.srvChg || 0)) * itemQty;
      const paidShare =
        totalAmount > 0 ? (Number(totalPaid) * itemTotal) / totalAmount : 0;
      const pendingShare =
        totalAmount > 0 ? (Number(balance) * itemTotal) / totalAmount : 0;

      entriesWithoutThisBill.unshift({
        id: "SE-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
        billId,
        dateTime: billTimestamp,
        customerName: customerName || 'Walk-in',
        customerPhone: mobile || '',
        serviceName: item.name,
        quantity: itemQty,
        wallet: item.wallet,
        walletName: item.wallet,
        walletChg: Number(item.walletChg || 0),
        srvChg: Number(item.srvChg || 0),
        totalAmount: Number(itemTotal.toFixed(2)),
        receivedAmount: Number(paidShare.toFixed(2)),
        cashReceived: Number(
          (totalAmount > 0 ? (Number(cash) * itemTotal) / totalAmount : 0).toFixed(2)
        ),
        gpayAmount: Number(
          (totalAmount > 0 ? (Number(gpay) * itemTotal) / totalAmount : 0).toFixed(2)
        ),
        pendingAmount: Number(pendingShare.toFixed(2)),
        staffName: currentStaff,
        status: isCredit ? 'credit' : 'completed',
      });
    });

    localStorage.setItem('serviceEntries', JSON.stringify(entriesWithoutThisBill));

    if (isCredit) {
      const creditBills = JSON.parse(localStorage.getItem("smart_akshaya_bills") || "[]");
      const creditWithoutThisBill = Array.isArray(creditBills)
        ? creditBills.filter(
            (bill: any) => String(bill.id || bill.billId || '') !== String(billId)
          )
        : [];

      creditWithoutThisBill.unshift({
        id: billId,
        billNumber: billId,
        customerName,
        mobileNumber: mobile,
        date: billDate,
        dateTime: billTimestamp,
        staffName: currentStaff,
        status: "Credit",
        totalAmount,
        paidAmount: totalPaid,
        owedAmount: balance,
        items: [...items],
      });

      localStorage.setItem(
        "smart_akshaya_bills",
        JSON.stringify(creditWithoutThisBill)
      );
    }

    const existingRecords = JSON.parse(
      localStorage.getItem("performanceRecords") || "[]"
    );

    const departmentFee = items.reduce(
      (sum, item) => sum + Number(item.walletChg || 0) * Number(item.qty || 1),
      0
    );
    const serviceCharge = items.reduce(
      (sum, item) => sum + Number(item.srvChg || 0) * Number(item.qty || 1),
      0
    );

    existingRecords.unshift({
      id: "PERF-" + Date.now(),
      billId,
      date: billDate,
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
    });

    localStorage.setItem("performanceRecords", JSON.stringify(existingRecords));

    // Once a Saved Bill is completed, remove only that draft from Saved Bills.
    if (resumeId) {
      try {
        const savedBills = JSON.parse(
          localStorage.getItem('savedBillsList') || '[]'
        );

        if (Array.isArray(savedBills)) {
          const remaining = savedBills.filter(
            (bill: any) =>
              String(bill.id || bill.billId || '') !== String(resumeId)
          );
          localStorage.setItem('savedBillsList', JSON.stringify(remaining));
        }
      } catch (error) {
        console.error('Failed to remove completed Saved Bill:', error);
      }
    }

    setLastCompletedBill({
      customerName,
      mobile,
      items: [...items],
      totalAmount,
      totalPaid,
      balance,
      gpay,
      cash,
      date: billTimestamp,
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    // Always finish on a fresh Service Entry form.
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
    setShowDropdown(false);
    setBillCompleted(true);

    router.push('/dashboard/service-entry');
    setTimeout(() => serviceInputRef.current?.focus(), 150);
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

      if (e.key === 'F7') {
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
      } else if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (e.altKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleShare();
      } else if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setCustomerPaidInput('');
        setShowCalculator(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, gpay, cash, customerName, mobile, previousBalance, totalAmount, totalPaid, balance, currentStaff]);

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

  const customerPaidNum = Number(customerPaidInput) || 0;
  const balanceReturnAmount = customerPaidNum > totalAmount ? customerPaidNum - totalAmount : 0;

  const upiPayeeVPA = "aksmpm250@oksbi";
  const upiPayeeName = "Akshaya e Centre Pookiparamba";
  
  const currentGpayAmount = Number(gpay) > 0 ? Number(gpay).toFixed(2) : "0.00";
  const dynamicUpiUri = `upi://pay?pa=${upiPayeeVPA}&pn=${encodeURIComponent(upiPayeeName)}&am=${currentGpayAmount}&cu=INR&tn=${encodeURIComponent('Bill Payment - Akshaya')}`;

  const whatsappQrPublicPath = "/whatsapp-qr.jpeg"; 
  const activeModalQrImageUrl = isModalGPayQr 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dynamicUpiUri)}`
    : whatsappQrPublicPath;

  const paymentQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dynamicUpiUri)}`;

  const filteredByMobile = mobile.trim().length >= 4 
    ? savedCustomersList.filter(c => c.mobile && c.mobile.includes(mobile.trim()))
    : [];

  const filteredByName = customerName.trim().length >= 3 
    ? savedCustomersList.filter(c => c.name && c.name.toLowerCase().includes(customerName.trim().toLowerCase()))
    : [];

  // Theme Class Mapping (Both background and cards match the selected pastel theme)
  const themeClasses: Record<string, { bg: string, cardBg: string, text: string, border: string, hoverColor: string }> = {
    slate: { bg: 'bg-gradient-to-br from-slate-50 via-white to-cyan-50/40', cardBg: 'bg-white/85', text: 'text-slate-900', border: 'border-slate-200', hoverColor: 'hover:bg-cyan-50' },
    green: { bg: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50', cardBg: 'bg-white/85', text: 'text-emerald-950', border: 'border-emerald-200', hoverColor: 'hover:bg-emerald-100' },
    blue: { bg: 'bg-gradient-to-br from-blue-50 via-white to-cyan-50', cardBg: 'bg-white/85', text: 'text-blue-950', border: 'border-blue-200', hoverColor: 'hover:bg-blue-100' },
    purple: { bg: 'bg-[#faf5ff]', cardBg: 'bg-[#f3eafc]', text: 'text-purple-950', border: 'border-purple-200', hoverColor: 'hover:bg-purple-200' },
    amber: { bg: 'bg-[#fffbeb]', cardBg: 'bg-[#fef3c7]', text: 'text-amber-950', border: 'border-amber-200', hoverColor: 'hover:bg-amber-200' },
    rose: { bg: 'bg-[#fff1f2]', cardBg: 'bg-[#ffe4e6]', text: 'text-rose-950', border: 'border-rose-200', hoverColor: 'hover:bg-rose-200' },
  };

  const activeTheme = themeClasses[currentTheme] || themeClasses.slate;

  return (
    <>
      {showSuccessToast && (
        <div className="fixed right-5 top-5 z-[9999] rounded-2xl border border-emerald-400/20 bg-emerald-500 px-6 py-3 font-black text-white shadow-[0_15px_40px_rgba(16,185,129,0.25)]">
          ✅ Bill Completed Successfully
        </div>
      )}
      {showShareToast && (
        <div className="fixed right-5 top-20 z-[9999] rounded-2xl border border-cyan-400/20 bg-cyan-600 px-6 py-3 font-black text-white shadow-[0_15px_40px_rgba(6,182,212,0.25)]">
          📋 Invoice copied to clipboard
        </div>
      )}
      {showCopyQrToast && (
        <div className="fixed right-5 top-5 z-[9999] rounded-2xl border border-emerald-400/20 bg-emerald-500 px-6 py-3 font-black text-white shadow-[0_15px_40px_rgba(16,185,129,0.25)]">
          ✅ Copied to clipboard successfully
        </div>
      )}

      <div className={`w-full max-w-[1600px] mx-auto space-y-5 relative min-h-screen transition-colors duration-300 px-4 py-4 lg:px-5 lg:py-5 xl:px-6 ${activeTheme.bg} ${activeTheme.text}`} ref={customerDropdownRef}>
        {showStaffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
            <div className="w-full rounded-3xl border border-slate-200/80 bg-white/95 px-5 py-4 shadow-[0_25px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl">
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
                <button onClick={handleVerifyStaffPin} className="flex-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 text-xs font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5"><ShieldCheck size={16} /> Authorize</button>
              </div>
            </div>
          </div>
        )}

        {showCalculator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl">
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

        {showPaymentQRModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
            onClick={() => setShowPaymentQRModal(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <QrCode className="text-indigo-600" size={22} /> Google Pay / UPI QR Code
                </h2>
                <button
                  onClick={() => setShowPaymentQRModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                <div ref={paymentQrBoxRef} className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-inner flex flex-col items-center w-full">
                  <img
                    src={paymentQrImageUrl}
                    alt="GPay QR Code"
                    className="w-56 h-56 rounded-xl border bg-white p-2 shadow object-contain"
                    crossOrigin="anonymous"
                  />
                  <div className="mt-3 text-center">
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Requested Amount</p>
                    <p className="text-2xl font-black text-slate-900">₹{currentGpayAmount}</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 space-y-1">
                <p>UPI ID: <strong className="text-slate-700">{upiPayeeVPA}</strong></p>
                <p>Scan using GPay, PhonePe, Paytm, or any UPI App.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(paymentQrImageUrl, { mode: 'cors' });
                      const blob = await response.blob();
                      
                      const imgBitmap = await createImageBitmap(blob);
                      const canvas = document.createElement('canvas');
                      canvas.width = imgBitmap.width;
                      canvas.height = imgBitmap.height;
                      const ctx = canvas.getContext('2d');
                      
                      if (!ctx) throw new Error("Canvas context failed");
                      ctx.drawImage(imgBitmap, 0, 0);

                      canvas.toBlob(async (pngBlob) => {
                        if (!pngBlob) throw new Error("PNG conversion failed");
                        await navigator.clipboard.write([
                          new ClipboardItem({ "image/png": pngBlob })
                        ]);
                        setShowCopyQrToast(true);
                        setTimeout(() => setShowCopyQrToast(false), 3000);
                      }, "image/png");

                    } catch (err) {
                      console.error("Clipboard copy failed:", err);
                      alert("Unable to copy QR code image to clipboard.");
                    }
                  }}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <Share2 size={14} /> Copy
                </button>
                <button
                  onClick={() => setShowPaymentQRModal(false)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showQRModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
            onClick={() => setShowQRModal(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <QrCode className="text-indigo-600" size={22} /> {isModalGPayQr ? "Scan & Pay (Dynamic UPI)" : "WhatsApp QR Code"}
                </h2>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                <div ref={qrBoxRef} className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-inner flex flex-col items-center w-full">
                  <img
                    src={activeModalQrImageUrl}
                    alt="QR Code"
                    className="w-56 h-56 rounded-xl border bg-white p-2 shadow object-contain"
                    crossOrigin="anonymous"
                  />
                  {isModalGPayQr && (
                    <div className="mt-3 text-center">
                      <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Requested Amount</p>
                      <p className="text-2xl font-black text-slate-900">₹{currentGpayAmount}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 space-y-1">
                {isModalGPayQr ? (
                  <>
                    <p>UPI ID: <strong className="text-slate-700">{upiPayeeVPA}</strong></p>
                    <p>Scan using GPay, PhonePe, Paytm, or any UPI App.</p>
                  </>
                ) : (
                  <p>Scan to connect directly via WhatsApp.</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(activeModalQrImageUrl, { mode: 'cors' });
                      const blob = await response.blob();
                      
                      const imgBitmap = await createImageBitmap(blob);
                      const canvas = document.createElement('canvas');
                      canvas.width = imgBitmap.width;
                      canvas.height = imgBitmap.height;
                      const ctx = canvas.getContext('2d');
                      
                      if (!ctx) throw new Error("Canvas context failed");
                      ctx.drawImage(imgBitmap, 0, 0);

                      canvas.toBlob(async (pngBlob) => {
                        if (!pngBlob) throw new Error("PNG conversion failed");
                        await navigator.clipboard.write([
                          new ClipboardItem({ "image/png": pngBlob })
                        ]);
                        setShowCopyQrToast(true);
                        setTimeout(() => setShowCopyQrToast(false), 3000);
                      }, "image/png");

                    } catch (err) {
                      console.error("Clipboard copy failed:", err);
                      alert("Unable to copy QR code image to clipboard.");
                    }
                  }}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <Share2 size={14} /> Copy
                </button>
                <button
                  onClick={() => setIsModalGPayQr(!isModalGPayQr)}
                  className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 border border-indigo-200 shadow-sm"
                >
                  🔄 Twist ({isModalGPayQr ? "WhatsApp" : "GPay"})
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Header with New Entry & Theme Selector Dropdown */}
        <div className="flex justify-between items-center">
          <div className="inline-block bg-white border border-slate-200 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
            New Entry {resumeId ? '(Settle / Resume Bill)' : ''}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <Palette size={14} className="text-indigo-600" />
            <label className="text-xs font-bold text-slate-600">Theme:</label>
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="slate">Light Slate</option>
              <option value="green">Soft Green</option>
              <option value="blue">Soft Blue</option>
              <option value="purple">Soft Purple</option>
              <option value="amber">Soft Amber</option>
              <option value="rose">Soft Rose</option>
            </select>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-900 to-blue-900 p-5 text-white shadow-[0_20px_55px_rgba(15,23,42,0.22)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-cyan-400/10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-cyan-200">Billing Dashboard</p>
            <h2 className="text-5xl font-black mt-1">₹{totalAmount.toFixed(2)}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-md flex items-center gap-3 shadow-inner">
              <Calendar size={20} className="text-blue-200" />
              <div>
                <p className="text-[10px] text-blue-200 font-semibold tracking-wider">DATE</p>
                <p className="text-sm font-bold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
            <QuickReceiptScan />
            <div 
              onClick={() => setShowStaffModal(true)} 
              className="cursor-pointer rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-md transition hover:bg-white/15 flex items-center gap-3"
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

        <div className={`${activeTheme.cardBg} rounded-2xl p-6 shadow-sm border ${activeTheme.border}`}>
          <h3 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-black text-slate-800">
            <User size={16} className="text-slate-400" /> Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="relative">
              <div className="border border-slate-200 rounded-2xl bg-white p-2.5 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10">
                <Phone size={18} className="text-slate-400 mx-3" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">Mobile Number (Type first 4 digits)</label>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    className="w-full pt-0.5 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      setShowMobileDropdown(true);
                    }}
                    onFocus={() => setShowMobileDropdown(true)}
                  />
                </div>
              </div>
              {showMobileDropdown && filteredByMobile.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                  {filteredByMobile.map((cust, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelectCustomer(cust)}
                      className="p-3 text-sm font-medium transition hover:bg-cyan-50 cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <p className="font-semibold text-slate-700">{cust.name}</p>
                      <p className="text-xs text-indigo-600 font-bold">{cust.mobile}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="border border-slate-200 rounded-2xl bg-white p-2.5 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10">
                <Search size={18} className="text-slate-400 mx-3" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">Customer Name (Type first 3 letters)</label>
                  <input
                    type="text"
                    placeholder="Search customer name..."
                    className="w-full pt-0.5 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setShowNameDropdown(true);
                    }}
                    onFocus={() => setShowNameDropdown(true)}
                  />
                </div>
              </div>
              {showNameDropdown && filteredByName.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                  {filteredByName.map((cust, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelectCustomer(cust)}
                      className="p-3 text-sm font-medium transition hover:bg-cyan-50 cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <p className="font-semibold text-slate-700">{cust.name}</p>
                      <p className="text-xs text-indigo-600 font-bold">{cust.mobile}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        <div className={`${activeTheme.cardBg} rounded-2xl p-6 shadow-sm border ${activeTheme.border} space-y-6`} ref={dropdownRef}>
          <h3 className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-black text-slate-800">
            <Plus size={16} className="text-slate-400" /> Add Service
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Services</label>
              <div className="border border-slate-200 rounded-2xl bg-white p-2.5 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10">
                <input
                  ref={serviceInputRef}
                  type="text"
                  placeholder="Search service..."
                  className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
                  value={searchService}
                  onChange={(e) => {
                    setSearchService(e.target.value);
                    setShowDropdown(true);
                  }}
                  onClick={() => setShowDropdown(true)}
                />
              </div>
              {showDropdown && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                  {services.filter(s => s.name.toLowerCase().includes(searchService.toLowerCase())).map(srv => (
                    <div 
                      key={srv.id} 
                      onClick={() => handleSelectService(srv)}
                      className={`p-3 text-sm cursor-pointer border-b border-slate-100 last:border-0 transition-colors ${activeTheme.hoverColor}`}
                    >
                      <p className="font-semibold text-slate-900">{srv.name}</p>
                      <p className="text-[11px] text-slate-600 font-medium">Srv: ₹{srv.srvChg} | Dept: ₹{srv.deptChg}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Wallet Chg.</label>
              <div className="border border-slate-200 rounded-2xl bg-white p-2.5 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10">
                <input
                  type="number"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 font-medium"
                  value={walletChg === 0 ? '' : walletChg}
                  onChange={(e) => setWalletChg(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Wallet</label>
              <div className="border border-slate-200 rounded-2xl bg-white p-2.5 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10">
                <select
                  className="w-full bg-transparent outline-none text-sm text-slate-800 font-medium cursor-pointer"
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
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Srv. Chg.</label>
              <div className="border border-slate-200 rounded-2xl bg-white p-2.5 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10">
                <input
                  type="number"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 font-medium"
                  value={srvChg === 0 ? '' : srvChg}
                  onChange={(e) => setSrvChg(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Qty</label>
              <div className="border border-slate-200 rounded-2xl bg-white p-2.5 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/10">
                <input
                  type="number"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 font-medium"
                  value={qty}
                  min="1"
                  onChange={(e) => setQty(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <button 
                onClick={handleAddItem}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-black text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-1 text-sm"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          <div className="min-h-[140px] rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-2">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-2">
                <ReceiptText size={14} className="text-slate-400" /> Bill Items
              </h4>
            </div>
            {items.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <ReceiptText className="mx-auto mb-2 opacity-40" size={32} />
                <p className="text-sm font-medium">{previousBalance > 0 ? "Settling previous credit balance" : "No items added to bill yet"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
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
                  <tbody className="divide-y divide-slate-200/80">
                    {items.map((item, index) => (
                      <tr key={item.id} className="text-slate-800 font-medium">
                        <td className="py-3 px-2 text-xs text-slate-500">{index + 1}</td>
                        <td className="py-3 px-2">{item.name}</td>
                        <td className="py-3 px-2">
                          <select
                            value={item.status}
                            onChange={(e) => handleItemChange(item.id, 'status', e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold shadow-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 cursor-pointer"
                          >
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                          </select>
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm outline-none focus:border-cyan-400"
                            value={item.walletChg}
                            onChange={(e) => handleItemChange(item.id, 'walletChg', Number(e.target.value))}
                          />
                        </td>
                        <td className="py-3 px-2">
                          <select
                            value={item.wallet}
                            onChange={(e) => handleItemChange(item.id, 'wallet', e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm outline-none focus:border-cyan-400 cursor-pointer"
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
                            className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm outline-none focus:border-cyan-400"
                            value={item.srvChg}
                            onChange={(e) => handleItemChange(item.id, 'srvChg', Number(e.target.value))}
                          />
                        </td>
                        <td className="py-3 px-2 text-center">
                          <input
                            type="number"
                            className="w-14 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-medium shadow-sm outline-none focus:border-cyan-400 text-center"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-6 ${activeTheme.cardBg} rounded-2xl p-6 shadow-sm border ${activeTheme.border} space-y-5`}>
            <h3 className="font-bold text-slate-700 text-sm border-b border-slate-200/60 pb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-slate-400" /> Payment & Summary
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200/80 rounded-2xl p-3 bg-white/80">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">GPAY / UPI</label>
                  <span className="text-[9px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">Alt+G</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-transparent outline-none text-sm text-slate-800 font-medium"
                    value={gpay === 0 ? '' : gpay}
                    onChange={(e) => setGpay(e.target.value === '' ? 0 : Number(e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPaymentQRModal(true)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-xl transition flex items-center justify-center border border-indigo-200 shadow-sm"
                    title="Generate QR for entered amount"
                  >
                    <QrCode size={18} />
                  </button>
                </div>
              </div>
            
              <div className="border border-slate-200/80 rounded-2xl p-3 bg-white/80">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">CASH</label>
                  <span className="text-[9px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">Alt+C</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 font-medium"
                  value={cash === 0 ? '' : cash}
                  onChange={(e) => setCash(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200/80 rounded-2xl p-3 bg-white/80">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">TOTAL PAID</p>
                <p className="text-lg font-bold mt-1 text-slate-800">₹{totalPaid.toFixed(2)}</p>
              </div>
              <div className="border border-slate-200/80 rounded-2xl p-3 bg-white/80">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">BALANCE</p>
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

          <div className={`lg:col-span-6 ${activeTheme.cardBg} rounded-2xl p-6 shadow-sm border ${activeTheme.border} flex flex-col justify-between`}>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-700">
                <span>Wallet Charge</span>
                <span>₹{totalWalletCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-700">
                <span>Service Charge</span>
                <span>₹{totalServiceCharge.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-slate-300 my-2 pt-2 flex justify-between text-sm font-bold text-slate-800">
                <span>Bill Total</span>
                <span>₹{billTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Previous Balance</span>
                <span>₹{Number(previousBalance).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/60 space-y-2">
              <div className="flex justify-between text-lg font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-blue-700">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-700">
                <span>Total Paid</span>
                <span>₹{totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 border-t border-slate-200/60">
                <span>Balance</span>
                <span className={balance > 0 ? "text-rose-500" : "text-emerald-600"}>₹{balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handleClearForm}
              className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-xs font-black text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-100 flex items-center justify-center gap-2"
            >
              Clear Form <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[9px]">F10</span>
            </button>
          </div>

          <div className="flex gap-3 w-full sm:w-auto flex-wrap">
            <button 
              onClick={handlePrint}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <Printer size={16} /> Print <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9px]">Alt+P</span>
            </button>
            <button
              onClick={() => { setIsModalGPayQr(true); setShowQRModal(true); }}
              className="rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-3.5 text-xs font-black text-cyan-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-100 flex items-center justify-center gap-2"
            >
              <QrCode size={16} /> QR Code
            </button>
            <button
              onClick={handleShare}
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-xs font-black text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-100 flex items-center justify-center gap-2"
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
    </>
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