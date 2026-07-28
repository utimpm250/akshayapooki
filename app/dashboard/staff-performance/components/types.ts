// components/types.ts

export interface BillRecord {
  staffName?: string;
  staff?: string;
  timestamp?: string;
  createdAt?: string;
  created_at?: string;
  date?: string;
  credit?: number | string;
}

export interface StaffRecord {
  id?: string;
  staffName?: string;
  name?: string;
  salary?: number | string;
}

export interface Summary {
  services: number;
  deptFee: number;
  serviceCharge: number;
  credit: number;
  totalCash: number;
}

export interface StatRowProps {
  label: string;
  value: number;
  color: string;
}

export interface DailyCardProps {
  daily: Summary;
  dailyDate: Date;
  setDailyDate: React.Dispatch<React.SetStateAction<Date>>;
}

export interface MonthlyCardProps {
  monthly: Summary;
  monthNames: string[];
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  basicSalary: number;
  monthlyBonus: number;
  finalMonthlySalary: number;
}

export interface YearlyCardProps {
  yearly: Summary;
  yearlyYear: number;
  setYearlyYear: React.Dispatch<React.SetStateAction<number>>;
  yearlySalary: number;
  yearlyBonus: number;
  finalYearlySalary: number;
}