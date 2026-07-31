"use client";

import React, { useMemo } from "react";
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
  onMonthChange: (date: Date) => void;
  onDateClick: (date: Date) => void;
  selectedStaff: string;
}

export default function AttendanceCalendar({
  records,
  holidays,
  currentMonth,
  onMonthChange,
  onDateClick,
  selectedStaff,
}: AttendanceCalendarProps) {

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  // ടൈം സോൺ പ്രശ്നങ്ങൾ ഒഴിവാക്കാൻ ഇന്നത്തെ തീയതി കൃത്യമായി സെറ്റ് ചെയ്യുന്നു
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const previousMonth = () => {
    onMonthChange(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    onMonthChange(
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

  const years: number[] = [];

  for (
    let y = today.getFullYear() - 5;
    y <= today.getFullYear() + 5;
    y++
  ) {
    years.push(y);
  }

  // തിരഞ്ഞെടുത്ത സ്റ്റാഫിന്റെയും തീയതിയുടെയും റെക്കോർഡ് കണ്ടെത്താൻ (ടൈം സോൺ ഒഴിവാക്കി)
  const hasAttendance = (date: Date) => {
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${yearStr}-${monthStr}-${dayStr}`;

    return records.find(
      (record) => record.date === formattedDate
    );
  };

  // ഹോളിഡേ പരിശോധിക്കാൻ
  const isHoliday = (date: Date) => {
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${yearStr}-${monthStr}-${dayStr}`;

    return holidays.find(
      (holiday) => holiday.date === formattedDate
    );
  };

  const calendarDays: (Date | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(
      new Date(year, month, day)
    );
  }

  // മുകളിലെ കാർഡുകളിലെ കണക്കുകൾ കൃത്യമാക്കാൻ (സൺഡേകളും അഡീഷണൽ ഹോളിഡേകളും ഉൾപ്പെടുത്തി)
  const attendanceSummary =
    useMemo(() => {

      let present = 0;
      let absent = 0;
      let holiday = 0;

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {

        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);

        // നാളത്തെ അല്ലെങ്കിൽ വരാനിരിക്കുന്ന ദിവസങ്ങൾ കണക്കിൽ കൂട്ടേണ്ടതില്ല
        if (date > today) continue;

        const isSun = date.getDay() === 0;
        const holidayMatch = isHoliday(date);
        const attendanceMatch = hasAttendance(date);

        // സൺഡേയോ അല്ലെങ്കിൽ മറ്റ് ഹോളിഡേയോ ആണെങ്കിൽ അത് ഹോളിഡേ ആയി കണക്കാക്കും
        if (isSun || holidayMatch) {
          holiday++;
          continue;
        }

        // പ്രസന്റ് ആണെങ്കിൽ
        if (attendanceMatch) {
          present++;
        } else {
          // അല്ലാത്തപക്ഷം (പ്രവർ്ത്തന ദിവസങ്ങളിൽ മാത്രം) ആബ്സെൻ്റ് ആയി കണക്കാക്കും
          absent++;
        }

      }

      return {
        present,
        absent,
        holiday,
      };

    }, [
      records,
      holidays,
      month,
      year,
      selectedStaff,
      today,
    ]);

  return (

    <div className="space-y-5">

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Present Days
          </div>

          <div className="mt-2 text-3xl font-black text-emerald-700">
            {attendanceSummary.present}
          </div>

        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-red-700">
            Absent Days
          </div>

          <div className="mt-2 text-3xl font-black text-red-700">
            {attendanceSummary.absent}
          </div>

        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Holiday Days
          </div>

          <div className="mt-2 text-3xl font-black text-amber-700">
            {attendanceSummary.holiday}
          </div>

        </div>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-2">

            <button
              onClick={previousMonth}
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100"
            >
              <ChevronLeft size={18} />
            </button>

            <select
              value={month}
              onChange={(e) =>
                onMonthChange(
                  new Date(
                    year,
                    Number(e.target.value),
                    1
                  )
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
            >
              {monthNames.map(
                (name, index) => (
                  <option
                    key={index}
                    value={index}
                  >
                    {name}
                  </option>
                )
              )}
            </select>

            <select
              value={year}
              onChange={(e) =>
                onMonthChange(
                  new Date(
                    Number(
                      e.target.value
                    ),
                    month,
                    1
                  )
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
            >
              {years.map((yr) => (
                <option
                  key={yr}
                  value={yr}
                >
                  {yr}
                </option>
              ))}
            </select>

            <button
              onClick={nextMonth}
              className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-100"
            >
              <ChevronRight size={18} />
            </button>

          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              Present
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-300"></span>
              Absent
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500"></span>
              Holiday
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
              Today
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border bg-slate-100"></span>
              Future
            </div>

          </div>

        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">

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
              className="border-r border-slate-200 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 last:border-r-0"
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

            const attendance =
              hasAttendance(date);

            const holiday =
              isHoliday(date);

            const isSunday =
              date.getDay() === 0;

            const isToday =
              today.toDateString() ===
              date.toDateString();

            const isFuture =
              date > today;

            let bgClass =
              "bg-white hover:bg-slate-50";

            if (attendance) {
              bgClass =
                "bg-emerald-50 hover:bg-emerald-100";
            }

            if (holiday || isSunday) {
              bgClass =
                "bg-amber-50 hover:bg-amber-100";
            }

            if (isFuture) {
              bgClass =
                "bg-slate-50";
            }

            return (
              <div
                key={date.toISOString()}
                onClick={() =>
                  onDateClick(date)
                }
                className={`h-28 cursor-pointer border border-slate-100 p-2 transition ${bgClass}`}
              >
                <div className="mb-2 flex items-center justify-between">

                  <span
                    className={`text-sm font-bold ${
                      isToday
                        ? "text-blue-600"
                        : "text-slate-700"
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  {isToday && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      Today
                    </span>
                  )}

                </div>

                {holiday ? (

                  <div className="space-y-1">

                    <div className="text-[10px] font-bold uppercase text-amber-700">
                      Holiday
                    </div>

                    <div className="text-[11px] font-medium leading-tight text-amber-800">
                      {holiday.name}
                    </div>

                  </div>

                ) : isSunday ? (

                  <div className="flex h-16 items-center justify-center">

                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                      Sunday
                    </span>

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

                ) : isFuture ? (

                  <div className="flex h-16 items-center justify-center">

                    <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500">
                      Future
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

    </div>

  );

}