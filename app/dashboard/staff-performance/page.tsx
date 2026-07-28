"use client";

import { useEffect, useMemo, useState } from "react";

import SummaryCards from "./components/SummaryCards";
import PendingBills from "./components/PendingBills";
import BilledServices from "./components/BilledServices";
import AttendanceCalendar from "./components/AttendanceCalendar";
import AttendanceModal from "./components/AttendanceModal";
import SalarySection from "./components/SalarySection";
import SalaryHistoryModal from "./components/SalaryHistoryModal";

import {
  PerformanceRecord,
  PendingBill,
  Holiday,
  SalaryHistory,
} from "./types";

import {
  loadPerformanceRecords,
  loadPendingBills,
  loadHolidays,
  loadSalaryHistory,
  getAttendanceRecord,
  getHoliday,
} from "./utils";

export default function StaffPerformancePage() {
  const [records, setRecords] =
    useState<PerformanceRecord[]>([]);

  const [pendingBills, setPendingBills] =
    useState<PendingBill[]>([]);

  const [holidays, setHolidays] =
    useState<Holiday[]>([]);

  const [salaryHistory, setSalaryHistory] =
    useState<SalaryHistory[]>([]);

  /* ---------------- CURRENT USER ---------------- */

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  /* ---------------- STAFF LIST ---------------- */

  const [staffList, setStaffList] = useState<string[]>([
    "All",
  ]);

  const [selectedStaff, setSelectedStaff] =
    useState("All");

  /* ---------------- SEARCH ---------------- */

  const [searchQuery, setSearchQuery] =
    useState("");

  /* ---------------- ATTENDANCE ---------------- */

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [selectedRecord, setSelectedRecord] =
    useState<PerformanceRecord | null>(null);

  const [selectedHoliday, setSelectedHoliday] =
    useState<Holiday | null>(null);

  const [attendanceModalOpen, setAttendanceModalOpen] =
    useState(false);

  /* ---------------- SALARY ---------------- */

  const [salaryHistoryOpen, setSalaryHistoryOpen] =
    useState(false);

  /* ---------------- CALENDAR ---------------- */

  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  const [summaryDate, setSummaryDate] =
    useState(new Date());

  const [summaryMonth, setSummaryMonth] =
    useState(new Date().getMonth());

  const [summaryYear, setSummaryYear] =
    useState(new Date().getFullYear());

  /* ---------------- TAB ---------------- */

  const [activeTab, setActiveTab] = useState<
    "pending" | "billed" | "attendance" | "salary"
  >("pending");

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    setRecords(loadPerformanceRecords());

    setPendingBills(loadPendingBills());

    setHolidays(loadHolidays());

    setSalaryHistory(loadSalaryHistory());

    if (typeof window === "undefined") return;

    const storedUser =
      localStorage.getItem("loggedInUser");

    const parsedUser = storedUser
      ? JSON.parse(storedUser)
      : {
          username: "Admin User",
          role: "admin",
        };

    setCurrentUser(parsedUser);

    if (
      parsedUser.role?.toLowerCase() !== "admin"
    ) {
      setSelectedStaff(parsedUser.username);

      setStaffList([
        parsedUser.username,
      ]);
    } else {
      loadStaffMembers();
    }
  }, []);
    /* ---------------- LOAD STAFF MEMBERS ---------------- */

  const loadStaffMembers = () => {
    if (typeof window === "undefined") return;

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

        if (!Array.isArray(parsed)) continue;

        const names = parsed
          .map(
            (staff: any) =>
              staff.name ||
              staff.staffName ||
              staff.username
          )
          .filter(Boolean);

        loadedNames.push(...names);
      } catch (error) {
        console.error(
          "Error loading staff:",
          key,
          error
        );
      }
    }

    /* fallback from performance records */

    records.forEach((record) => {
      if (record.staffName) {
        loadedNames.push(record.staffName);
      }
    });

    const uniqueStaff = Array.from(
      new Set(loadedNames)
    ).sort();

    if (uniqueStaff.length > 0) {
      setStaffList([
        "All",
        ...uniqueStaff,
      ]);
    } else {
      setStaffList([
        "All",
        "FASNIL",
        "SAHAL",
        "SHEEJA",
        "SUMAYYA",
      ]);
    }
  };

  /* ---------------- FILTERED RECORDS ---------------- */

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const staffMatch =
        selectedStaff === "All" ||
        record.staffName?.toLowerCase() ===
          selectedStaff.toLowerCase();

      const searchMatch =
        searchQuery.trim() === "" ||
        record.customerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        record.staffName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return staffMatch && searchMatch;
    });
  }, [
    records,
    selectedStaff,
    searchQuery,
  ]);

  const filteredPendingBills =
    useMemo(() => {
      return pendingBills.filter((bill) => {
        const staffMatch =
          selectedStaff === "All" ||
          bill.staffName?.toLowerCase() ===
            selectedStaff.toLowerCase();

        const searchMatch =
          searchQuery.trim() === "" ||
          bill.customerName
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          bill.phone
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            );

        return (
          staffMatch && searchMatch
        );
      });
    }, [
      pendingBills,
      selectedStaff,
      searchQuery,
    ]);
      /* ---------------- DATE CLICK ---------------- */

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    const attendance = getAttendanceRecord(
      filteredRecords,
      date
    );

    const holiday = getHoliday(
      holidays,
      date
    );

    setSelectedRecord(
      attendance || null
    );

    setSelectedHoliday(
      holiday || null
    );

    setAttendanceModalOpen(true);
  };

  const closeAttendanceModal = () => {
    setAttendanceModalOpen(false);

    setSelectedDate(null);

    setSelectedRecord(null);

    setSelectedHoliday(null);
  };

  /* ---------------- FILTERED STAFF RECORDS ---------------- */

  const staffRecords = useMemo(() => {
    if (selectedStaff === "All") {
      return records;
    }

    return records.filter(
      (record) =>
        record.staffName
          ?.toLowerCase()
          .trim() ===
        selectedStaff
          .toLowerCase()
          .trim()
    );
  }, [records, selectedStaff]);

  const staffPendingBills =
    useMemo(() => {
      if (selectedStaff === "All") {
        return pendingBills;
      }

      return pendingBills.filter(
        (bill) =>
          bill.staffName
            ?.toLowerCase()
            .trim() ===
          selectedStaff
            .toLowerCase()
            .trim()
      );
    }, [
      pendingBills,
      selectedStaff,
    ]);

  const attendanceRecords =
    useMemo(() => {
      if (selectedStaff === "All") {
        return records;
      }

      return records.filter(
        (record) =>
          record.staffName
            ?.toLowerCase()
            .trim() ===
          selectedStaff
            .toLowerCase()
            .trim()
      );
    }, [
      records,
      selectedStaff,
    ]);

  const selectedSalaryHistory =
    useMemo(() => {
      if (selectedStaff === "All") {
        return salaryHistory;
      }

      return salaryHistory.filter(
        (item) =>
          item.staffName
            ?.toLowerCase()
            .trim() ===
          selectedStaff
            .toLowerCase()
            .trim()
      );
    }, [
      salaryHistory,
      selectedStaff,
    ]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Staff Performance Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor attendance, performance,
            billing and salary.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedStaff}
            onChange={(e) =>
              setSelectedStaff(e.target.value)
            }
            disabled={
              currentUser &&
              currentUser.role?.toLowerCase() !==
                "admin"
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
          >
            {staffList.map((staff) => (
              <option
                key={staff}
                value={staff}
              >
                {staff === "All"
                  ? "All Staff Members"
                  : staff}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SummaryCards
        records={staffRecords}
        attendanceLogs={attendanceRecords}
        selectedStaff={selectedStaff}
        dailyDate={summaryDate}
        setDailyDate={setSummaryDate}
        selectedMonth={summaryMonth}
        selectedYear={summaryYear}
        setSelectedMonth={setSummaryMonth}
        setSelectedYear={setSummaryYear}
        yearlyYear={summaryYear}
        setYearlyYear={setSummaryYear}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap border-b border-slate-200">

          <button
            onClick={() =>
              setActiveTab("pending")
            }
            className={`px-6 py-4 text-sm font-semibold transition ${
              activeTab === "pending"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Pending Bills
          </button>

          <button
            onClick={() =>
              setActiveTab("billed")
            }
            className={`px-6 py-4 text-sm font-semibold transition ${
              activeTab === "billed"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Billed Services
          </button>

          <button
            onClick={() =>
              setActiveTab("attendance")
            }
            className={`px-6 py-4 text-sm font-semibold transition ${
              activeTab === "attendance"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Attendance
          </button>

          <button
            onClick={() =>
              setActiveTab("salary")
            }
            className={`px-6 py-4 text-sm font-semibold transition ${
              activeTab === "salary"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Salary Summary
          </button>

        </div>

        <div className="p-6">
                    {activeTab === "pending" && (
<PendingBills
  bills={staffPendingBills}
  selectedStaff={selectedStaff}
  searchQuery={searchQuery}
/>
          )}

          {activeTab === "billed" && (
<BilledServices
  records={filteredRecords}
  selectedStaff={selectedStaff}
  searchQuery={searchQuery}
/>
          )}

          {activeTab === "attendance" && (
            <AttendanceCalendar
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              records={attendanceRecords}
              holidays={holidays}
              selectedStaff={selectedStaff}
              onDateClick={handleDateClick}
            />
          )}

          {activeTab === "salary" && (
<SalarySection
  records={attendanceRecords}
  salaryHistory={selectedSalaryHistory}
  selectedStaff={selectedStaff}
  selectedMonth={summaryMonth}
  selectedYear={summaryYear}
  onOpenHistory={() =>
    setSalaryHistoryOpen(true)
  }
/>
          )}
        </div>
      </div>

      <AttendanceModal
        open={attendanceModalOpen}
        onClose={closeAttendanceModal}
        date={selectedDate}
        record={selectedRecord}
        holiday={selectedHoliday}
      />

<SalaryHistoryModal
  isOpen={salaryHistoryOpen}
  salaryHistory={selectedSalaryHistory}
  onClose={() =>
    setSalaryHistoryOpen(false)
  }
/>
    </div>
  );
}