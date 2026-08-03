"use client";

import { useState } from "react";

export interface GradesState {
  Aplus: string;
  A: string;
  Bplus: string;
  B: string;
  Cplus: string;
  C: string;
  Dplus: string;
  D: string;
  E: string;
}

export function useSSLCCalculator() {
  const [grades, setGrades] = useState<GradesState>({
    Aplus: "",
    A: "",
    Bplus: "",
    B: "",
    Cplus: "",
    C: "",
    Dplus: "",
    D: "",
    E: "",
  });

  const [sslcResultObj, setSslcResultObj] = useState<{
    totalSubjects: number;
    totalPoints: number;
    percentage: number;
    overallGrade: string;
  } | null>(null);

  const gradePointsMap: Record<keyof GradesState, number> = {
    Aplus: 9,
    A: 8,
    Bplus: 7,
    B: 6,
    Cplus: 5,
    C: 4,
    Dplus: 3,
    D: 2,
    E: 1,
  };

  const handleSslcInputChange = (
    key: keyof GradesState,
    value: string
  ) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    setGrades((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const totalSubjectsSelected = Object.values(grades).reduce(
    (acc, value) => {
      const num = parseInt(value, 10);
      return acc + (isNaN(num) ? 0 : num);
    },
    0
  );
    const calculateSslcResults = () => {
    if (totalSubjectsSelected !== 10) {
      alert("ദയവായി കൃത്യം 10 വിഷയങ്ങളുടെ ഗ്രേഡുകൾ നൽകുക.");
      return;
    }

    let totalPts = 0;

    (Object.keys(grades) as Array<keyof GradesState>).forEach((key) => {
      const count = parseInt(grades[key], 10) || 0;
      totalPts += count * gradePointsMap[key];
    });

    const maxPossiblePoints = 90;
    const calcPercentage = (totalPts / maxPossiblePoints) * 100;

    let overall = "C";

    if (calcPercentage >= 90) overall = "A+";
    else if (calcPercentage >= 80) overall = "A";
    else if (calcPercentage >= 70) overall = "B+";
    else if (calcPercentage >= 60) overall = "B";
    else if (calcPercentage >= 50) overall = "C+";
    else if (calcPercentage >= 40) overall = "C";
    else overall = "D / E";

    setSslcResultObj({
      totalSubjects: totalSubjectsSelected,
      totalPoints: totalPts,
      percentage: Number(calcPercentage.toFixed(2)),
      overallGrade: overall,
    });
  };

  const handleSslcReset = () => {
    setGrades({
      Aplus: "",
      A: "",
      Bplus: "",
      B: "",
      Cplus: "",
      C: "",
      Dplus: "",
      D: "",
      E: "",
    });

    setSslcResultObj(null);
  };

  const gradeCards = [
    {
      key: "Aplus" as keyof GradesState,
      label: "A+",
      points: "9 Grade Points",
      color: "text-purple-600",
    },
    {
      key: "A" as keyof GradesState,
      label: "A",
      points: "8 Grade Points",
      color: "text-indigo-600",
    },
    {
      key: "Bplus" as keyof GradesState,
      label: "B+",
      points: "7 Grade Points",
      color: "text-blue-600",
    },
    {
      key: "B" as keyof GradesState,
      label: "B",
      points: "6 Grade Points",
      color: "text-cyan-600",
    },
    {
      key: "Cplus" as keyof GradesState,
      label: "C+",
      points: "5 Grade Points",
      color: "text-emerald-600",
    },
    {
      key: "C" as keyof GradesState,
      label: "C",
      points: "4 Grade Points",
      color: "text-amber-600",
    },
    {
      key: "Dplus" as keyof GradesState,
      label: "D+",
      points: "3 Grade Points",
      color: "text-orange-600",
    },
    {
      key: "D" as keyof GradesState,
      label: "D",
      points: "2 Grade Points",
      color: "text-rose-600",
    },
    {
      key: "E" as keyof GradesState,
      label: "E",
      points: "1 Grade Point",
      color: "text-red-600",
    },
  ];
    return {
    grades,
    sslcResultObj,
    totalSubjectsSelected,
    gradeCards,
    handleSslcInputChange,
    calculateSslcResults,
    handleSslcReset,
  };
}