"use client";

import { useState } from "react";

export function useCashCounter() {
  const [cashCounts, setCashCounts] = useState({
    500: "",
    200: "",
    100: "",
    50: "",
    20: "",
    10: "",
    5: "",
    2: "",
    1: "",
  });

  const handleCashInputChange = (
    denom: keyof typeof cashCounts,
    value: string
  ) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    setCashCounts((prev) => ({
      ...prev,
      [denom]: value,
    }));
  };

  const handleCashReset = () => {
    setCashCounts({
      500: "",
      200: "",
      100: "",
      50: "",
      20: "",
      10: "",
      5: "",
      2: "",
      1: "",
    });
  };

  const denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1];

  let totalNotes = 0;
  let grandTotal = 0;

  denominations.forEach((denom) => {
    const qty =
      parseInt(
        cashCounts[denom as keyof typeof cashCounts],
        10
      ) || 0;

    totalNotes += qty;
    grandTotal += qty * denom;
  });

  return {
    cashCounts,
    denominations,
    totalNotes,
    grandTotal,
    handleCashInputChange,
    handleCashReset,
  };
}