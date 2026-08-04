"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = false;
    let assignedRole = "staff";
    let displayName = "";

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Admin Login
    if (cleanUsername === "admin" && cleanPassword === "admin") {
      isValid = true;
      assignedRole = "admin";
      displayName = "Admin User";
    } else {
      // Staff Login
      const savedStaffData = localStorage.getItem("smart_akshaya_staff");

      if (savedStaffData) {
        try {
          const staffArray = JSON.parse(savedStaffData);

          if (Array.isArray(staffArray)) {
            const matchedStaff = staffArray.find((s: any) => {
              const sName = (
                s.name ||
                s.staffName ||
                s.username ||
                ""
              )
                .trim()
                .toLowerCase();

              const sPass = (
                s.password ||
                s.pass ||
                ""
              ).trim();

              const defaultPass =
                `${sName.split(" ")[0]}akshaya`.toLowerCase();

              const sEmail = (s.email || "").trim().toLowerCase();

              return (
                (sName === cleanUsername || sEmail === cleanUsername) &&
                (
                  (sPass !== "" && sPass === cleanPassword) ||
                  defaultPass === cleanPassword.toLowerCase() ||
                  cleanPassword === "akshaya123" // എമർജൻസി പാസ്‌വേഡ്
                )
              );
            });

            if (matchedStaff) {
              isValid = true;

              assignedRole =
                matchedStaff.role?.toLowerCase() === "admin"
                  ? "admin"
                  : "staff";

              displayName =
                matchedStaff.name ||
                matchedStaff.staffName ||
                matchedStaff.username;
            }
          }
        } catch (err) {
          console.error("Error reading staff storage", err);
        }
      }
    }

    if (isValid) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          username: displayName,
          role: assignedRole,
        })
      );

      localStorage.setItem(
        "loginSessionDate",
        new Date().toISOString().split("T")[0]
      );

      router.push("/dashboard");
    } else {
      alert("Invalid Username or Password. Please check your credentials.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-900 to-blue-700 p-4">

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />

      <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl animate-pulse" />

      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/20 bg-white/95 backdrop-blur-2xl p-8 shadow-[0_30px_80px_rgba(15,23,42,0.28)] transition-all duration-500">

        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500" />

        <div className="flex flex-col items-center justify-center mb-8">

          <div className="flex items-center justify-center mb-5 animate-in fade-in zoom-in duration-700">

            <div className="relative flex items-center justify-center">

              <div className="absolute h-32 w-32 rounded-full bg-gradient-to-r from-cyan-400/20 via-indigo-500/20 to-violet-500/20 blur-3xl animate-pulse" />

              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="relative h-28 md:h-32 lg:h-36 w-auto object-contain pointer-events-none select-none drop-shadow-[0_20px_45px_rgba(79,70,229,0.45)] transition-all duration-500 hover:scale-105"
              >
                <source
                  src="/Animate_logo.webm"
                  type="video/webm"
                />
              </video>

            </div>

          </div>

          <h2 className="bg-gradient-to-r from-indigo-700 via-blue-600 to-violet-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent text-center">
            Welcome Back
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 text-center max-w-xs">
            Sign in to your Smart Akshaya Account
          </p>

        </div>
         <form
          onSubmit={handleLogin}
          className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
              Smart Akshaya
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Secure Billing & Service Management System
            </p>
          </div>

          {/* Username */}

          <div className="group">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500 transition-colors group-focus-within:text-indigo-600">
              Staff Name / Username
            </label>

            <input
              type="text"
              placeholder="Enter your name (e.g. FASNIL)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Password */}

          <div className="group">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500 transition-colors group-focus-within:text-indigo-600">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {/* Submit */}

          <button
            type="submit"
            className="group w-full rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 py-3 font-bold tracking-wide text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(79,70,229,.35)] active:scale-[0.98]"
          >
            <span className="transition-all duration-300 group-hover:tracking-widest">
              Sign In
            </span>
          </button>

          <div className="border-t border-slate-200 pt-5 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Smart Akshaya
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Fast • Secure • Reliable
            </p>
          </div>
        </form>

      </div>

    </div>
  );
}