"use client";

import { useEffect, useState } from "react";

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
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [pendingBills, setPendingBills] = useState<PendingBill[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);

  const [selectedStaff, setSelectedStaff] =
    useState("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [selectedRecord, setSelectedRecord] =
    useState<PerformanceRecord | null>(null);

  const [selectedHoliday, setSelectedHoliday] =
    useState<Holiday | null>(null);

  const [attendanceModalOpen, setAttendanceModalOpen] =
    useState(false);

  const [salaryHistoryOpen, setSalaryHistoryOpen] =
    useState(false);

  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  const [summaryDate, setSummaryDate] =
    useState(new Date());

  const [summaryMonth, setSummaryMonth] =
    useState(new Date().getMonth());

  const [summaryYear, setSummaryYear] =
    useState(new Date().getFullYear());

  const [activeTab, setActiveTab] = useState<
    "pending" | "billed" | "attendance" | "salary"
  >("pending");

  useEffect(() => {
    setRecords(loadPerformanceRecords());
    setPendingBills(loadPendingBills());
    setHolidays(loadHolidays());
    setSalaryHistory(loadSalaryHistory());
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    setSelectedRecord(
      getAttendanceRecord(records, date) || null
    );

    setSelectedHoliday(
      getHoliday(holidays, date) || null
    );

    setAttendanceModalOpen(true);
  };

  const closeAttendanceModal = () => {
    setAttendanceModalOpen(false);

    setSelectedDate(null);

    setSelectedRecord(null);

    setSelectedHoliday(null);
  };

  const staffList = [
        "All",

    ...Array.from(
      new Set(
        records
          .map((record) => record.staffName)
          .filter(Boolean)
      )
    ),
  ];

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Staff Performance Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor attendance, performance, billing and salary.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <select
            value={selectedStaff}
            onChange={(e) =>
              setSelectedStaff(e.target.value)
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500"
          >
            {staffList.map((staff) => (
              <option
                key={staff}
                value={staff}
              >
                {staff}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search staff or customer..."
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
          />

        </div>

      </div>

      <SummaryCards
        records={records}
        attendanceLogs={records}
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
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-4 text-sm font-semibold transition ${
              activeTab === "pending"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Pending Bills
          </button>

          <button
            onClick={() => setActiveTab("billed")}
            className={`px-6 py-4 text-sm font-semibold transition ${
              activeTab === "billed"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Billed Services
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-6 py-4 text-sm font-semibold transition ${
              activeTab === "attendance"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Attendance
          </button>
                    <button
            onClick={() => setActiveTab("salary")}
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
              bills={pendingBills}
              selectedStaff={selectedStaff}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "billed" && (
            <BilledServices
              records={records}
              selectedStaff={selectedStaff}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceCalendar
              records={records}
              holidays={holidays}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              onDateClick={handleDateClick}
            />
          )}

          {activeTab === "salary" && (
            <SalarySection
              records={records}
              salaryHistory={salaryHistory}
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
        isOpen={attendanceModalOpen}
        selectedDate={selectedDate}
        selectedRecord={selectedRecord}
        selectedHoliday={selectedHoliday}
        onClose={closeAttendanceModal}
      />

      <SalaryHistoryModal
        isOpen={salaryHistoryOpen}
        salaryHistory={salaryHistory}
        onClose={() =>
          setSalaryHistoryOpen(false)
        }
      />

    </div>
  );
}