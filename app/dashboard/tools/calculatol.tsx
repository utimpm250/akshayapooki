"use client";

import { useEffect, useState } from "react";
import { Delete, Divide, Equal, Minus, Plus, RotateCcw, X } from "lucide-react";

type Operator = "+" | "-" | "×" | "÷" | null;

function calculate(a: number, b: number, operator: Operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? null : a / b;
    default:
      return b;
  }
}

export default function CalculatorTool({ onClose }: { onClose?: () => void }) {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }

    setDisplay((value) => (value === "0" ? digit : value.length < 18 ? value + digit : value));
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay((value) => value + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    if (display === "0") return;
    setDisplay((value) => (value.startsWith("-") ? value.slice(1) : `-${value}`));
  };

  const percentage = () => {
    const value = Number(display);
    if (!Number.isFinite(value)) return;
    setDisplay(String(value / 100));
  };

  const backspace = () => {
    if (waitingForOperand) return;
    setDisplay((value) => (value.length <= 1 || (value.length === 2 && value.startsWith("-")) ? "0" : value.slice(0, -1)));
  };

  const chooseOperator = (nextOperator: Operator) => {
    const inputValue = Number(display);
    if (!Number.isFinite(inputValue)) return;

    if (storedValue !== null && operator && !waitingForOperand) {
      const result = calculate(storedValue, inputValue, operator);

      if (result === null) {
        setDisplay("Error");
        setStoredValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }

      setDisplay(String(result));
      setStoredValue(result);
    } else {
      setStoredValue(inputValue);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const equals = () => {
    if (storedValue === null || operator === null || waitingForOperand) return;

    const result = calculate(storedValue, Number(display), operator);

    if (result === null) {
      setDisplay("Cannot divide by 0");
    } else {
      const rounded = Number.isInteger(result) ? result : Number(result.toFixed(12));
      setDisplay(String(rounded));
    }

    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const keyMap: Record<string, () => void> = {
    "0": () => inputDigit("0"),
    "1": () => inputDigit("1"),
    "2": () => inputDigit("2"),
    "3": () => inputDigit("3"),
    "4": () => inputDigit("4"),
    "5": () => inputDigit("5"),
    "6": () => inputDigit("6"),
    "7": () => inputDigit("7"),
    "8": () => inputDigit("8"),
    "9": () => inputDigit("9"),
    ".": inputDecimal,
    "+": () => chooseOperator("+"),
    "-": () => chooseOperator("-"),
    "*": () => chooseOperator("×"),
    "/": () => chooseOperator("÷"),
    "%": percentage,
    "Enter": equals,
    "=": equals,
    "Backspace": backspace,
    "Escape": clear,
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = keyMap[event.key];
      if (event.key === "Escape" && onClose) {
        event.preventDefault();
        onClose();
        return;
      }
      if (action) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <>
      <section className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.22)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-3.5">
          <div className="mb-3 flex items-center justify-between rounded-[16px] border border-slate-100 bg-white px-3 py-2.5 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Smart Akshaya</p>
              <h1 className="text-base font-black">Calculator</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clear}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                title="Reset calculator"
                aria-label="Reset calculator"
              >
                <RotateCcw size={17} />
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  title="Close calculator"
                  aria-label="Close calculator"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="mb-3 rounded-[16px] border border-slate-800 bg-slate-950 px-4 py-3 text-right shadow-inner">
            <p className="mb-1 h-5 truncate text-xs font-semibold text-slate-400">
              {storedValue !== null && operator ? `${storedValue} ${operator}` : "Ready"}
            </p>
            <div className="min-h-10 overflow-hidden break-all text-3xl font-black tracking-tight text-white">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button type="button" onClick={clear} className="key secondary">AC</button>
            <button type="button" onClick={toggleSign} className="key secondary">+/−</button>
            <button type="button" onClick={percentage} className="key secondary">%</button>
            <button type="button" onClick={() => chooseOperator("÷")} className="key operator"><Divide size={19} /></button>

            {["7", "8", "9"].map((digit) => (
              <button key={digit} type="button" onClick={() => inputDigit(digit)} className="key number">{digit}</button>
            ))}
            <button type="button" onClick={() => chooseOperator("×")} className="key operator"><X size={19} /></button>

            {["4", "5", "6"].map((digit) => (
              <button key={digit} type="button" onClick={() => inputDigit(digit)} className="key number">{digit}</button>
            ))}
            <button type="button" onClick={() => chooseOperator("-")} className="key operator"><Minus size={19} /></button>

            {["1", "2", "3"].map((digit) => (
              <button key={digit} type="button" onClick={() => inputDigit(digit)} className="key number">{digit}</button>
            ))}
            <button type="button" onClick={() => chooseOperator("+")} className="key operator"><Plus size={19} /></button>

            <button type="button" onClick={backspace} className="key secondary"><Delete size={18} /></button>
            <button type="button" onClick={() => inputDigit("0")} className="key number">0</button>
            <button type="button" onClick={inputDecimal} className="key number">.</button>
            <button type="button" onClick={equals} className="key equal"><Equal size={20} /></button>
          </div>

          <p className="mt-2 text-center text-[9px] font-medium text-slate-400">
            Keyboard supported • Esc to clear • Enter to calculate
          </p>
        </section>

      <style jsx>{`
        .key {
          display: flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          font-weight: 900;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
        }
        .key:hover {
          transform: translateY(-1px);
        }
        .number {
          border: 1px solid rgb(226 232 240);
          background: white;
          color: rgb(15 23 42);
          box-shadow: 0 5px 14px rgba(15, 23, 42, 0.06);
        }
        .number:hover {
          background: rgb(248 250 252);
        }
        .secondary {
          border: 1px solid rgb(226 232 240);
          background: rgb(241 245 249);
          color: rgb(71 85 105);
        }
        .operator {
          background: linear-gradient(135deg, rgb(8 145 178), rgb(37 99 235));
          color: white;
          box-shadow: 0 5px 14px rgba(14, 165, 233, 0.18);
        }
        .equal {
          background: linear-gradient(135deg, rgb(16 185 129), rgb(13 148 136));
          color: white;
          box-shadow: 0 5px 14px rgba(16, 185, 129, 0.18);
        }
        :global(.dark) .number {
          border-color: rgb(51 65 85);
          background: rgb(30 41 59);
          color: white;
        }
        :global(.dark) .number:hover {
          background: rgb(51 65 85);
        }
        :global(.dark) .secondary {
          border-color: rgb(51 65 85);
          background: rgb(30 41 59);
          color: rgb(203 213 225);
        }
      `}</style>
    </>
  );
}
