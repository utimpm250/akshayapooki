export interface PerformanceRecord {
  id: string;
  date: string;
  timestamp: string;

  staffName: string;
  customerName: string;

  phone?: string;

  totalServices: number;

  departmentFee: number;
  serviceCharge: number;

  totalAmount: number;

  cashAmount: number;
  gpayUpiAmount: number;

  openingBalance: number;

  commission: number;

  loginTime?: string;
  logoutTime?: string;
}

export interface PendingBill {
  id: string;

  timestamp: string;

  staffName: string;

  customerName: string;

  phone: string;

  totalAmount: number;
}

export interface Holiday {
  id: string;

  date: string;

  name: string;
}

export interface SalaryHistory {
  id: string;

  staffName: string;

  paymentDate: string;

  amount: number;

  paymentMethod: string;

  notes?: string;
}