"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Search,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldAlert,
  Clock,
  FileText,
} from "lucide-react";

interface PerformanceRecord {
  id: string;
  timestamp: string;
  staffName: string;
  customerName: string;
  totalAmount: number;
  totalPaid: number;
  serviceCharge: number;
  departmentFee: number;
  itemsCount: number;
  paymentMode?: string;
  commission?: number;
  openingBalance?: number;
}

interface PendingBill {
  id: string;
  timestamp: string;
  customerName: string;
  phone?: string;
  totalAmount: number;
  status: string;
  staffName?: string;
}

interface Holiday {
  id: string;
  date: string;
  title: string;
  type: "holiday" | "weekly";
}
interface SalaryHistory {
  id: string;
  staffName: string;
  paidOn: string;
  finalSalary: number;
  amountPaid: number;
  balance: number;
}

export default function StaffPerformancePage() {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [pendingBills, setPendingBills] = useState<PendingBill[]>([]);

  // Logged-in User
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Staff Filter
  const [selectedStaff, setSelectedStaff] = useState<string>("All");
  const [staffList, setStaffList] = useState<string[]>([]);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "pending" | "billed" | "attendance" | "salary"
  >("billed");

// Attendance Calendar
const [attendanceMonth, setAttendanceMonth] = useState<number>(
  new Date().getMonth()
);

const [attendanceYear, setAttendanceYear] = useState<number>(
  new Date().getFullYear()
);

const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);

const [staffData, setStaffData] = useState<any[]>([]);
 // Holiday Management (Phase 1)
const [holidays, setHolidays] = useState<Holiday[]>([]);
const [holidayDate, setHolidayDate] = useState("");
const [holidayTitle, setHolidayTitle] = useState("");
const [selectedAttendanceDate, setSelectedAttendanceDate] =
  useState<any>(null);

// Daily Summary
const [dailyDate, setDailyDate] = useState<Date>(new Date());

// Monthly Summary
const [selectedMonth, setSelectedMonth] = useState<number>(
  new Date().getMonth()
);

const [selectedYear, setSelectedYear] = useState<number>(
  new Date().getFullYear()
);

// Yearly Summary
const [yearlyYear, setYearlyYear] = useState<number>(
  new Date().getFullYear()
);
// Salary Management
const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);
const [showSalaryHistory, setShowSalaryHistory] = useState(false);
const handleSaveSalarySettings = () => {
  alert("Salary settings saved successfully.");
};
const handlePaySalary = () => {
  alert("Salary paid successfully.");
};
const handleSalaryHistory = () => {
  setShowSalaryHistory(true);
};

useEffect(() => {
  if (typeof window !== "undefined") {
    // Logged-in user
    const storedUser = localStorage.getItem("loggedInUser");

    const parsedUser = storedUser
      ? JSON.parse(storedUser)
      : {
          username: "Admin User",
          role: "admin",
        };

    setCurrentUser(parsedUser);

    // Staff login → സ്വന്തം data മാത്രം
    if (parsedUser.role.toLowerCase() !== "admin") {
      setSelectedStaff(parsedUser.username);
      setStaffList([parsedUser.username]);
    } else {
      loadStaffMembers();
    }

    // Performance Records
    const savedRecords = localStorage.getItem(
      "staff_performance_records"
    );

    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords);

        const mapped = parsed.map((item: any) => ({
          ...item,
          serviceCharge: Number(
            item.serviceCharge || item.srvChg || 0
          ),
          departmentFee: Number(
            item.departmentFee ||
              item.walletChg ||
              item.deptFee ||
              item.walletAmount ||
              item.expense ||
              0
          ),
          totalAmount: Number(
            item.totalAmount || item.amount || 0
          ),
          paymentMode: item.paymentMode || "Cash",
          commission: Number(item.commission || 0),
          openingBalance: Number(
            item.openingBalance || 0
          ),
        }));

        setRecords(mapped);
      } catch {
        setRecords([]);
      }
    }

    // Pending Bills
    const savedBills =
      localStorage.getItem("pending_bills") ||
      localStorage.getItem("saved_bills");

    if (savedBills) {
      try {
        setPendingBills(JSON.parse(savedBills));
      } catch {
        setPendingBills([]);
      }
    }

    // Attendance Logs
    const savedAttendance = localStorage.getItem(
      "attendance_logs"
    );

    if (savedAttendance) {
      try {
        setAttendanceLogs(JSON.parse(savedAttendance));
      } catch {
        setAttendanceLogs([]);
      }
    }

    // Holiday Settings
    const savedHolidays = localStorage.getItem(
      "holiday_settings"
    );

    if (savedHolidays) {
      try {
        setHolidays(JSON.parse(savedHolidays));
      } catch {
        setHolidays([]);
      }
    }
  }
}, []);

  // Load Staff Members (Admin Only)
  const loadStaffMembers = () => {
    const loadedNames: string[] = [];

    const possibleKeys = [
      "staff_members",
      "users",
      "akshaya_staffs",
      "smart_akshaya_staff",
    ];

    for (const key of possibleKeys) {
      const data = localStorage.getItem(key);

      if (!data) continue;

      try {
        const parsed = JSON.parse(data);

        if (Array.isArray(parsed)) {
          const names = parsed
            .map(
              (staff: any) =>
                staff.name ||
                staff.staffName ||
                staff.username
            )
            .filter(Boolean);

          loadedNames.push(...names);
        }
      } catch (err) {
        console.error(
          "Error parsing staff list:",
          key,
          err
        );
      }
    }

    if (loadedNames.length > 0) {
      setStaffList([...new Set(loadedNames)].sort());
    } else {
      setStaffList([
        "Admin User",
        "FASNIL",
        "SUMAYYA",
        "SHEEJA",
        "SAHLA",
        "test",
      ]);
    }
  };

  // Filter Performance Records
  const staffFilteredRecords = records.filter((record) => {
    const matchesStaff =
      selectedStaff === "All" ||
      record.staffName?.toLowerCase() ===
        selectedStaff.toLowerCase();

    const matchesSearch =
      record.customerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      record.staffName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesStaff && matchesSearch;
  });

  // Filter Pending Bills
  const filteredPendingBills = pendingBills.filter(
    (bill) => {
      const matchesStaff =
        selectedStaff === "All" ||
        bill.staffName?.toLowerCase() ===
          selectedStaff.toLowerCase();

      const matchesSearch =
        bill.customerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        bill.phone
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesStaff && matchesSearch;
    }
  );
  // Attendance Records (Selected Staff)
  const staffAttendanceLogs = attendanceLogs.filter((log) => {
    if (selectedStaff === "All") return true;

    return (
      log.staffName?.toLowerCase() ===
      selectedStaff.toLowerCase()
    );
  });

  // Daily Performance Records
  const cardDailyRecords = records.filter((record) => {
    const matchesStaff =
      selectedStaff === "All" ||
      record.staffName?.toLowerCase() ===
        selectedStaff.toLowerCase();

    const date = new Date(record.timestamp);

    return (
      matchesStaff &&
      date.getDate() === dailyDate.getDate() &&
      date.getMonth() === dailyDate.getMonth() &&
      date.getFullYear() === dailyDate.getFullYear()
    );
  });

  // Daily Summary
  const dailyServicesCount = cardDailyRecords.length;

  const dailyDeptFee = cardDailyRecords.reduce(
    (acc, curr) => acc + Number(curr.departmentFee || 0),
    0
  );

  const dailyServiceCharge = cardDailyRecords.reduce(
    (acc, curr) => acc + Number(curr.serviceCharge || 0),
    0
  );

  const dailyGpayUpi = cardDailyRecords
    .filter(
      (record) =>
        record.paymentMode?.toLowerCase().includes("upi") ||
        record.paymentMode?.toLowerCase().includes("gpay")
    )
    .reduce(
      (acc, curr) => acc + Number(curr.totalAmount || 0),
      0
    );

  const dailyOpeningBal = cardDailyRecords.reduce(
    (acc, curr) => acc + Number(curr.openingBalance || 0),
    0
  );

  const dailyTotalCash = cardDailyRecords.reduce(
    (acc, curr) => acc + Number(curr.totalAmount || 0),
    0
  );

  const dailyCommission = cardDailyRecords.reduce(
    (acc, curr) => acc + Number(curr.commission || 0),
    0
  );

  // Monthly Summary
  const cardMonthlyRecords = records.filter((record) => {
    const matchesStaff =
      selectedStaff === "All" ||
      record.staffName?.toLowerCase() ===
        selectedStaff.toLowerCase();

    const date = new Date(record.timestamp);

    return (
      matchesStaff &&
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  });

  const monthlyServicesCount = cardMonthlyRecords.length;

  const monthlyDeptFee = cardMonthlyRecords.reduce(
    (acc, curr) => acc + Number(curr.departmentFee || 0),
    0
  );

  const monthlyServiceCharge = cardMonthlyRecords.reduce(
    (acc, curr) => acc + Number(curr.serviceCharge || 0),
    0
  );

  const monthlyCash = cardMonthlyRecords.reduce(
    (acc, curr) => acc + Number(curr.totalAmount || 0),
    0
  );

  const monthlyCommission = cardMonthlyRecords.reduce(
    (acc, curr) => acc + Number(curr.commission || 0),
    0
  );

  // Monthly Attendance Summary
  const monthlyAttendanceLogs = staffAttendanceLogs.filter((log) => {
    const date = new Date(
      log.date || log.loginTime || log.timestamp
    );

    return (
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  });

  const monthlyPresentDays = monthlyAttendanceLogs.filter(
    (log) =>
      (log.status || "present").toLowerCase() ===
      "present"
  ).length;

  const monthlyAbsentDays = monthlyAttendanceLogs.filter(
    (log) =>
      (log.status || "").toLowerCase() === "absent"
  ).length;
  // Yearly Summary
  const cardYearlyRecords = records.filter((record) => {
    const matchesStaff =
      selectedStaff === "All" ||
      record.staffName?.toLowerCase() ===
        selectedStaff.toLowerCase();

    const date = new Date(record.timestamp);

    return (
      matchesStaff &&
      date.getFullYear() === yearlyYear
    );
  });

  const yearlyServicesCount = cardYearlyRecords.length;

  const yearlyDeptFee = cardYearlyRecords.reduce(
    (acc, curr) => acc + Number(curr.departmentFee || 0),
    0
  );

  const yearlyServiceCharge = cardYearlyRecords.reduce(
    (acc, curr) => acc + Number(curr.serviceCharge || 0),
    0
  );

  const yearlyGpayUpi = cardYearlyRecords
    .filter(
      (record) =>
        record.paymentMode?.toLowerCase().includes("upi") ||
        record.paymentMode?.toLowerCase().includes("gpay")
    )
    .reduce(
      (acc, curr) => acc + Number(curr.totalAmount || 0),
      0
    );

  const yearlyCash = cardYearlyRecords.reduce(
    (acc, curr) => acc + Number(curr.totalAmount || 0),
    0
  );

  const yearlyCommission = cardYearlyRecords.reduce(
    (acc, curr) => acc + Number(curr.commission || 0),
    0
  );

  // Overall Totals
  const totalServiceCharge = staffFilteredRecords.reduce(
    (acc, curr) => acc + Number(curr.serviceCharge || 0),
    0
  );

  const totalDepartmentFee = staffFilteredRecords.reduce(
    (acc, curr) => acc + Number(curr.departmentFee || 0),
    0
  );

  const totalFilteredCollection =
    staffFilteredRecords.reduce(
      (acc, curr) =>
        acc + Number(curr.totalAmount || 0),
      0
    );

  // Staff Salary
  const selectedStaffInfo = staffData.find(
    (staff) =>
      staff.name?.toLowerCase() ===
      selectedStaff.toLowerCase()
  );

  const basicSalary = Number(
    selectedStaffInfo?.salary || 0
  );

  const presentDays = attendanceLogs.filter((log) => {
    const date = new Date(log.timestamp || log.date);

    return (
      (selectedStaff === "All" ||
        log.staffName?.toLowerCase() ===
          selectedStaff.toLowerCase()) &&
      (log.status || "present").toLowerCase() ===
        "present" &&
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  }).length;

  const finalSalary =
    basicSalary + monthlyCommission;

  const amountPaid = 0;

  const balance = finalSalary - amountPaid;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const firstDay = new Date(
  attendanceYear,
  attendanceMonth,
  1
).getDay();

const daysInMonth = new Date(
  attendanceYear,
  attendanceMonth + 1,
  0
).getDate();

const renderAttendanceCalendar = () => {
  const daysGrid: React.ReactNode[] = [];

for (let i = 0; i < firstDay; i++) {
  daysGrid.push(
    <div
      key={`empty-${i}`}
      className="h-24 bg-slate-50/40 border border-slate-100 rounded-lg p-2 opacity-30"
    />
  );
}

for (let day = 1; day <= daysInMonth; day++) {
  const currentDate = new Date(
    attendanceYear,
    attendanceMonth,
    day
  );

  const dateStr = `${attendanceYear}-${String(
    attendanceMonth + 1
  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isSunday = currentDate.getDay() === 0;

  const holiday = holidays.find(
    (h) => h.date === dateStr
  );

  const dayLog = attendanceLogs.find((log) => {
    const logDate = new Date(
      log.timestamp || log.date
    )
      .toISOString()
      .split("T")[0];

    const matchesDate = logDate === dateStr;

    const matchesStaff =
      selectedStaff === "All" ||
      log.staffName?.toLowerCase() ===
        selectedStaff.toLowerCase();

    return matchesDate && matchesStaff;
  });

  const isPresent =
    !!dayLog &&
    (dayLog.status || "present").toLowerCase() ===
      "present";

  const loginTime = dayLog
    ? dayLog.loginTime ||
      new Date(dayLog.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const logoutTime = dayLog?.logoutTime || "--";

  daysGrid.push(
    <div
      key={dateStr}
      onClick={() =>
        setSelectedAttendanceDate({
          date: dateStr,
          log: dayLog,
          holiday,
          isSunday,
          loginTime,
          logoutTime,
        })
      }
          className={`h-24 rounded-lg border p-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
            holiday
              ? "bg-purple-50 border-purple-300"
              : isSunday
              ? "bg-gray-100 border-gray-300"
              : isPresent
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-slate-800">
              {day}
            </span>

            {holiday ? (
              <ShieldAlert
                size={14}
                className="text-purple-600"
              />
            ) : isSunday ? (
              <Calendar
                size={14}
                className="text-gray-600"
              />
            ) : isPresent ? (
              <CheckCircle2
                size={14}
                className="text-green-600"
              />
            ) : (
              <Clock
                size={14}
                className="text-red-500"
              />
            )}
          </div>

          <div className="mt-2 space-y-1 text-[10px]">
            {holiday ? (
              <>
                <p className="font-bold text-purple-700">
                  {holiday.title}
                </p>
                <p className="text-purple-500">
                  Holiday
                </p>
              </>
            ) : isSunday ? (
              <>
                <p className="font-bold text-gray-700">
                  Sunday
                </p>
                <p className="text-gray-500">
                  Weekly Holiday
                </p>
              </>
            ) : isPresent ? (
              <>
                <p className="text-green-700">
                  In : {loginTime}
                </p>
                <p className="text-green-700">
                  Out : {logoutTime}
                </p>
              </>
            ) : (
              <p className="font-semibold text-red-600">
                Absent
              </p>
            )}
          </div>
        </div>
      );
    }

    return daysGrid;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">

      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Award className="text-indigo-600" /> Staff Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centre: MPM250
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <User
                size={14}
                className="text-indigo-600"
              />
              View Staff:
            </span>
          <select
            className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer"
            value={selectedStaff}
            onChange={(e) =>
              setSelectedStaff(e.target.value)
            }
            disabled={
              currentUser &&
              currentUser.role.toLowerCase() !==
                "admin"
            }
          >
            {currentUser &&
              currentUser.role.toLowerCase() ===
                "admin" && (
                <option value="All">
                  All Staff Members
                </option>
              )}

            {staffList.map((staff, idx) => (
              <option key={idx} value={staff}>
                {staff}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
          {new Date().toLocaleDateString(
            "en-GB",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        </div>
      </div>
    </div>

    {/* THREE CARDS LAYOUT */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* 1. DAILY PERFORMANCE CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 relative overflow-hidden">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
            Daily Performance
          </h3>

          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
            <Calendar size={16} />
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
          <button
            onClick={() => {
              const prev = new Date(dailyDate);
              prev.setDate(prev.getDate() - 1);
              setDailyDate(prev);
            }}
            className="p-1.5 hover:bg-white rounded-lg text-slate-600 shadow-sm transition"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs font-bold text-slate-800">
            {dailyDate.toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </span>

          <button
            onClick={() => {
              const next = new Date(dailyDate);
              next.setDate(next.getDate() + 1);
              setDailyDate(next);
            }}
            className="p-1.5 hover:bg-white rounded-lg text-slate-600 shadow-sm transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="text-center py-2">
          <h2 className="text-3xl font-black text-slate-900">
            {dailyServicesCount}
          </h2>

          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Total Services
          </p>
        </div>
          <div className="space-y-2.5 text-xs border-t pt-4">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Dept. Fee</span>
              <span className="font-bold text-slate-900">
                ₹{dailyDeptFee.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Service Charge</span>
              <span className="font-bold text-slate-900">
                ₹{dailyServiceCharge.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>GPay / UPI</span>
              <span className="font-bold text-slate-900">
                ₹{dailyGpayUpi.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Opening Balance</span>
              <span className="font-bold text-slate-900">
                ₹{dailyOpeningBal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium pt-2 border-t">
              <span className="font-black text-slate-800">
                Total Cash
              </span>
              <span className="font-black text-slate-900 text-sm">
                ₹{dailyTotalCash.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Commission</span>
              <span className="font-bold text-emerald-600">
                ₹{dailyCommission.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. MONTHLY PERFORMANCE CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 relative overflow-hidden">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Monthly Performance
            </h3>

            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
              <Calendar size={16} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(Number(e.target.value))
              }
              className="bg-white border border-slate-200 text-xs font-bold rounded-lg p-1.5 outline-none cursor-pointer"
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(Number(e.target.value))
              }
              className="bg-white border border-slate-200 text-xs font-bold rounded-lg p-1.5 outline-none cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center py-2">
            <h2 className="text-3xl font-black text-slate-900">
              {monthlyServicesCount}
            </h2>

            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Total Services
            </p>
          </div>
          <div className="space-y-2.5 text-xs border-t pt-4">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Dept. Fee</span>
              <span className="font-bold text-slate-900">
                ₹{monthlyDeptFee.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Service Charge</span>
              <span className="font-bold text-slate-900">
                ₹{monthlyServiceCharge.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Present Days</span>
              <span className="font-bold text-emerald-600">
                {monthlyPresentDays}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Absent Days</span>
              <span className="font-bold text-red-600">
                {monthlyAbsentDays}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Cash</span>
              <span className="font-bold text-slate-900">
                ₹{monthlyCash.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium pt-2 border-t">
              <span className="font-black text-slate-800">
                Commission
              </span>
              <span className="font-black text-emerald-600 text-sm">
                ₹{monthlyCommission.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. YEARLY PERFORMANCE CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 relative overflow-hidden">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Yearly Performance
            </h3>

            <div className="bg-amber-50 text-amber-600 p-2 rounded-xl">
              <Calendar size={16} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
            <select
              value={yearlyYear}
              onChange={(e) =>
                setYearlyYear(Number(e.target.value))
              }
              className="w-full bg-white border border-slate-200 text-xs font-bold rounded-lg p-1.5 outline-none text-center cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center py-2">
            <h2 className="text-3xl font-black text-slate-900">
              {yearlyServicesCount}
            </h2>

            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Total Services
            </p>
          </div>

          <div className="space-y-2.5 text-xs border-t pt-4">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Dept. Fee</span>
              <span className="font-bold text-slate-900">
                ₹{yearlyDeptFee.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Service Charge</span>
              <span className="font-bold text-slate-900">
                ₹{yearlyServiceCharge.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>GPay / UPI</span>
              <span className="font-bold text-slate-900">
                ₹{yearlyGpayUpi.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 font-medium">
              <span>Cash</span>
              <span className="font-bold text-slate-900">
                ₹{yearlyCash.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium pt-2 border-t">
              <span className="font-black text-slate-800">
                Commission
              </span>
              <span className="font-black text-emerald-600 text-sm">
                ₹{yearlyCommission.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-8 border-b border-slate-200 pt-4 px-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 text-sm font-bold transition relative ${
            activeTab === "pending"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Pending Bills
        </button>

        <button
          onClick={() => setActiveTab("billed")}
          className={`pb-3 text-sm font-bold transition relative ${
            activeTab === "billed"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Billed Services
        </button>

        <button
          onClick={() => setActiveTab("attendance")}
          className={`pb-3 text-sm font-bold transition relative ${
            activeTab === "attendance"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Attendance
        </button>

        {currentUser?.role?.toLowerCase() === "admin" && (
          <button
            onClick={() => setActiveTab("salary")}
            className={`pb-3 text-sm font-bold transition relative ${
              activeTab === "salary"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Staff Salary
          </button>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex justify-between items-center">
        <div className="text-xs font-bold text-slate-600">
          {activeTab === "pending" &&
            `Pending Bills List (${filteredPendingBills.length})`}

          {activeTab === "billed" &&
            `Billed Services Records (${staffFilteredRecords.length})`}

          {activeTab === "attendance" &&
            `Staff Attendance Calendar View`}

          {activeTab === "salary" &&
            `Staff Salary Details`}
        </div>

        {activeTab !== "attendance" && (
          <div className="relative w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-3.5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search customer or staff..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
        )}
      </div>

      {/* TAB CONTENT : ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Staff Attendance Calendar
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Click any date to view attendance details.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-emerald-500"></span>
                <span>Present</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-red-500"></span>
                <span>Absent</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-amber-400"></span>
                <span>Holiday</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-slate-400"></span>
                <span>Sunday</span>
              </div>
            </div>
          </div>

          {renderAttendanceCalendar()}
        </div>
      )}

      {/* TAB CONTENT 1 : PENDING BILLS */}
      {activeTab === "pending" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {filteredPendingBills.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText
                size={40}
                className="mx-auto mb-2 opacity-40"
              />
              <p className="text-sm font-semibold">
                No pending bills found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">
                      Date / Time
                    </th>
                    <th className="py-3 px-4">
                      Staff Name
                    </th>
                    <th className="py-3 px-4">
                      Customer Name
                    </th>
                    <th className="py-3 px-4">
                      Phone
                    </th>
                    <th className="py-3 px-4 text-right">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-center">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredPendingBills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="hover:bg-slate-50/80 transition text-slate-700"
                    >
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                        {new Date(
                          bill.timestamp
                        ).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-indigo-600">
                        <span className="bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">
                          {bill.staffName || "Admin User"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium">
                        {bill.customerName || "Customer"}
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono">
                        {bill.phone || "N/A"}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        ₹
                        {Number(
                          bill.totalAmount || 0
                        ).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
       {/* TAB CONTENT 2 : BILLED SERVICES */}
      {activeTab === "billed" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {staffFilteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShieldAlert
                size={40}
                className="mx-auto mb-2 opacity-40"
              />
              <p className="text-sm font-semibold">
                No billed service records found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">
                      Date / Time
                    </th>
                    <th className="py-3 px-4">
                      Staff Name
                    </th>
                    <th className="py-3 px-4">
                      Customer Name
                    </th>
                    <th className="py-3 px-4 text-right">
                      Service Chg.
                    </th>
                    <th className="py-3 px-4 text-right">
                      Dept Fee
                    </th>
                    <th className="py-3 px-4 text-right">
                      Total Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {staffFilteredRecords.map((rec) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/80 transition text-slate-700"
                    >
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                        {new Date(
                          rec.timestamp
                        ).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-indigo-600">
                        <span className="bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">
                          {rec.staffName ||
                            "Admin User"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium">
                        {rec.customerName ||
                          "Walk-in Customer"}
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-emerald-600">
                        ₹
                        {Number(
                          rec.serviceCharge || 0
                        ).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-amber-600">
                        ₹
                        {Number(
                          rec.departmentFee || 0
                        ).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-slate-900">
                        ₹
                        {Number(
                          rec.totalAmount || 0
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-200">
                    <td
                      colSpan={3}
                      className="py-3.5 px-4 text-right uppercase text-xs"
                    >
                      Total Sum:
                    </td>

                    <td className="py-3.5 px-4 text-right text-emerald-700">
                      ₹{totalServiceCharge.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-amber-700">
                      ₹{totalDepartmentFee.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-900 text-base">
                      ₹{totalFilteredCollection.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
      {currentUser?.role?.toLowerCase() === "admin" &&
        activeTab === "salary" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">
              Staff Salary Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500">Staff Name</p>
                <p className="font-semibold">
                  {selectedStaffInfo?.name || selectedStaff}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Staff ID</p>
                <p className="font-semibold">
                  {selectedStaffInfo?.staffId || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="font-semibold">
                  {selectedStaffInfo?.role || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Basic Salary</p>
                <p className="font-semibold text-blue-600">
                  ₹ {basicSalary.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Monthly Commission
                </p>
                <p className="font-semibold text-green-600">
                  ₹ {monthlyCommission.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Present Days</p>
                <p className="font-semibold">{presentDays}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Bonus</p>
                <p className="font-semibold">₹ 0</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Final Salary</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ₹ {finalSalary.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Amount Paid</p>
                <p className="font-semibold">
                  ₹ {amountPaid.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                type="button"
                onClick={handleSaveSalarySettings}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Save Settings
              </button>

              <button
                type="button"
                onClick={handlePaySalary}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Pay Salary
              </button>

              <button
                type="button"
                onClick={handleSalaryHistory}
                className="px-5 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800 transition"
              >
                History
              </button>
            </div>
          </div>
        )}

      {/* Salary History Popup */}
      {showSalaryHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">
                Salary History
              </h2>

              <button
                onClick={() => setShowSalaryHistory(false)}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            {salaryHistory.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                No salary history available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Staff</th>
                      <th className="p-3 text-right">Salary</th>
                      <th className="p-3 text-right">Paid</th>
                      <th className="p-3 text-right">Balance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {salaryHistory.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-slate-50"
                      >
                        <td className="p-3">
                          {new Date(
                            item.paidOn
                          ).toLocaleDateString("en-GB")}
                        </td>

                        <td className="p-3">
                          {item.staffName}
                        </td>

                        <td className="p-3 text-right font-semibold text-indigo-600">
                          ₹
                          {item.finalSalary.toLocaleString()}
                        </td>

                        <td className="p-3 text-right font-semibold text-green-600">
                          ₹
                          {item.amountPaid.toLocaleString()}
                        </td>

                        <td className="p-3 text-right font-semibold text-red-600">
                          ₹
                          {item.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attendance Details Popup */}
      {selectedAttendanceDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">
              Attendance Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold">
                  {selectedAttendanceDate.date}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Staff</span>
                <span className="font-semibold">
                  {selectedAttendanceDate.log?.staffName ??
                    selectedStaff}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold">
                  {selectedAttendanceDate.holiday
                    ? selectedAttendanceDate.holiday.title
                    : selectedAttendanceDate.isSunday
                    ? "Sunday Holiday"
                    : selectedAttendanceDate.log?.status ??
                      "Absent"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Login Time
                </span>
                <span className="font-semibold">
                  {selectedAttendanceDate.log?.loginTime ??
                    "--"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Logout Time
                </span>
                <span className="font-semibold">
                  {selectedAttendanceDate.log?.logoutTime ??
                    "--"}
                </span>
              </div>
            </div>

             <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setSelectedAttendanceDate(null)
                }
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}