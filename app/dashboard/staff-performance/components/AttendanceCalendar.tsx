"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  PerformanceRecord,
  Holiday,
} from "../types";

interface AttendanceCalendarProps {
  records: PerformanceRecord[];
  holidays: Holiday[];
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  onDateClick: (date: Date) => void;
}

export default function AttendanceCalendar({
  records,
  holidays,
  currentMonth,
  setCurrentMonth,
  onDateClick,
}: AttendanceCalendarProps) {

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const previousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );
  };

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

  const hasAttendance = (date: Date) => {

    const day = date.toISOString().split("T")[0];

    return records.find(
      (record) => record.date === day
    );

  };

  const isHoliday = (date: Date) => {

    const day = date.toISOString().split("T")[0];

    return holidays.find(
      (holiday) => holiday.date === day
    );

  };

  const calendarDays: (Date | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      new Date(year, month, day)
    );
  }

  return (

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <button
          onClick={previousMonth}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="text-lg font-bold text-slate-800">
          {monthNames[month]} {year}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">

        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (

          <div
            key={day}
            className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            {day}
          </div>

        ))}

      </div>

      <div className="grid grid-cols-7">

        {calendarDays.map((date, index) => {

          if (!date) {

            return (
              <div
                key={index}
                className="h-28 border border-slate-100 bg-slate-50"
              />
            );

          }

          const attendance = hasAttendance(date);
          const holiday = isHoliday(date);

          const isSunday =
            date.getDay() === 0;

          const today =
            new Date().toDateString() ===
            date.toDateString();

          let bgClass =
            "bg-white hover:bg-slate-50";

          if (attendance) {
            bgClass =
              "bg-emerald-50 hover:bg-emerald-100";
          }

          if (holiday) {
            bgClass =
              "bg-amber-50 hover:bg-amber-100";
          }

          if (isSunday) {
            bgClass =
              "bg-red-50 hover:bg-red-100";
          }

          return (
            <div
              key={date.toISOString()}
              onClick={() => onDateClick(date)}
              className={`h-28 border border-slate-100 p-2 cursor-pointer transition ${bgClass}`}
            >
                              <div className="flex items-center justify-between mb-2">

                <span
                  className={`text-sm font-bold ${
                    today
                      ? "text-blue-600"
                      : "text-slate-700"
                  }`}
                >
                  {date.getDate()}
                </span>

                {today && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                    Today
                  </span>
                )}

              </div>

              {holiday ? (

                <div className="space-y-1">

                  <div className="text-[10px] font-bold text-amber-700 uppercase">
                    Holiday
                  </div>

                  <div className="text-[11px] text-amber-800 font-medium leading-tight">
                    {holiday.name}
                  </div>

                </div>

              ) : attendance ? (

                <div className="space-y-1">

                  <div className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Present
                  </div>

                  <div className="text-[10px] text-slate-500">
                    Login
                  </div>

                  <div className="text-[11px] font-semibold text-slate-700">
                    {attendance.loginTime || "--"}
                  </div>

                  <div className="text-[10px] text-slate-500">
                    Logout
                  </div>

                  <div className="text-[11px] font-semibold text-slate-700">
                    {attendance.logoutTime || "--"}
                  </div>

                </div>

              ) : isSunday ? (

                <div className="flex h-16 items-center justify-center">

                  <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600">
                    Sunday
                  </span>

                </div>

              ) : (

                <div className="flex h-16 items-center justify-center">

                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-400">
                    Absent
                  </span>

                </div>

              )}

            </div>

          );

        })}
              </div>

    </div>

  );

}