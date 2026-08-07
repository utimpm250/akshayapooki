"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Receipt,
  Settings,
  Wallet,
  FileSpreadsheet,
  History,
  TrendingDown,
  CreditCard,
  Users,
  Award,
  UserCheck,
  Share2,
  ShieldAlert,
  LogOut,
  Pin,
  Rocket,
  X,
  Sun,
  Moon,
  Home,
  ClipboardList,
} from "lucide-react";


const APP_VERSION = "1.0.9";

interface MenuItem {
  name: string;
  path: string;
  icon: any;
  section: string;
  permissionKey: string;
}

const allMenuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    section: "Main",
    permissionKey: "Dashboard",
  },
  {
    name: "Application Forms",
    path: "/dashboard/application-forms",
    icon: FileText,
    section: "Main",
    permissionKey: "Application Forms",
  },
  {
    name: "Service Entry",
    path: "/dashboard/service-entry",
    icon: FilePlus,
    section: "Services",
    permissionKey: "Service Entry",
  },
  {
    name: "Saved Bills",
    path: "/dashboard/saved-bills",
    icon: Receipt,
    section: "Services",
    permissionKey: "Saved Bills",
  },
  {
    name: "Service Management",
    path: "/dashboard/service-management",
    icon: Settings,
    section: "Services",
    permissionKey: "Service Management",
  },
  {
  name: "Work Status",
  path: "/dashboard/work-status",
  icon: ClipboardList,
  section: "Services",
  permissionKey: "Work Status",
},
  {
    name: "Wallet Management",
    path: "/dashboard/wallet-management",
    icon: Wallet,
    section: "Wallets",
    permissionKey: "Wallet Management",
  },
  {
    name: "Billed Services",
    path: "/dashboard/billed-services",
    icon: FileSpreadsheet,
    section: "Finance",
    permissionKey: "Billed Services",
  },
  {
    name: "Transaction History",
    path: "/dashboard/transaction-history",
    icon: History,
    section: "Finance",
    permissionKey: "Transaction History",
  },
  {
    name: "Expenses",
    path: "/dashboard/expenses",
    icon: TrendingDown,
    section: "Finance",
    permissionKey: "Expenses",
  },
  {
    name: "Credit Details",
    path: "/dashboard/credit-details",
    icon: CreditCard,
    section: "Finance",
    permissionKey: "Credit Details",
  },
  {
    name: "Staff Management",
    path: "/dashboard/staff-management",
    icon: Users,
    section: "System",
    permissionKey: "Staff Management",
  },
  {
    name: "Staff Performance",
    path: "/dashboard/staff-performance",
    icon: Award,
    section: "System",
    permissionKey: "Staff Performance",
  },
  {
    name: "Customer Details",
    path: "/dashboard/customer-details",
    icon: UserCheck,
    section: "System",
    permissionKey: "Customer Details",
  },
  {
    name: "Quick Hub",
    path: "/dashboard/quick-hub",
    icon: Share2,
    section: "System",
    permissionKey: "Quick Hub",
  },
  {
    name: "Feature Permissions",
    path: "/dashboard/feature-permissions",
    icon: ShieldAlert,
    section: "System",
    permissionKey: "Feature Permissions",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentUser, setCurrentUser] = useState({
    username: "Admin User",
    role: "admin",
  });

  const [allowedMenus, setAllowedMenus] = useState<MenuItem[]>([]);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update Bubble
  const [showUpdate, setShowUpdate] = useState(false);

  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  
  const openSidebar = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    if (sidebarPinned) return;

    hideTimer.current = setTimeout(() => {
      setSidebarOpen(false);
    }, 150);
  };

  useEffect(() => {
    // Theme Loader from LocalStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const storedUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );

    const username = (storedUser.username || "User").trim();
    const role = (storedUser.role || "staff").toLowerCase();

    setCurrentUser({
      username,
      role,
    });

    const versionKey = `app_version_${username.toLowerCase()}`;
    const savedVersion = localStorage.getItem(versionKey);

    if (savedVersion !== APP_VERSION) {
      setTimeout(() => {
        setShowUpdate(true);
      }, 500);
    }

    const pinKey = `sidebar_pinned_${username.toLowerCase()}`;
    const savedPin = localStorage.getItem(pinKey);

    if (savedPin !== null) {
      const pinned = savedPin === "true";
      setSidebarPinned(pinned);
      setSidebarOpen(pinned);
    }

    if (role === "admin") {
      setAllowedMenus(allMenuItems);
      return;
    }

    const permissions = JSON.parse(
      localStorage.getItem("role_feature_permissions") || "[]"
    );

    const filteredMenus = allMenuItems.filter((menu) => {
      if (menu.permissionKey === "Feature Permissions") {
        return false;
      }

      const permission = permissions.find(
        (p: any) => p.featureName === menu.permissionKey
      );

      if (!permission) return false;

      if (role === "accountant") {
        return permission.accountantAccess;
      }

      return permission.staffAccess;
    });

    setAllowedMenus(filteredMenus);

    const allowed =
      pathname === "/dashboard" ||
      filteredMenus.some((m) => m.path === pathname);

    if (!allowed) {
      router.replace("/dashboard");
    }
  }, [pathname, router]);

  // Theme Toggle Function
  const toggleTheme = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    }
  };

  const updateApplication = () => {
    const key = `app_version_${currentUser.username.toLowerCase()}`;
    localStorage.setItem(key, APP_VERSION);
    setShowUpdate(false);
    window.location.reload();
  };

  const togglePinSidebar = () => {
    const newValue = !sidebarPinned;
    setSidebarPinned(newValue);
    setSidebarOpen(newValue);
    const pinKey = `sidebar_pinned_${currentUser.username.toLowerCase()}`;
    localStorage.setItem(pinKey, String(newValue));
  };

  const handleCloseUpdate = () => {
    setShowUpdate(false);
  };

  const handleLogout = () => {
    try {
      const logs = JSON.parse(
        localStorage.getItem("staff_attendance_logs") || "[]"
      );
      const today = new Date().toISOString().split("T")[0];
      const index = logs.findIndex((log: any) => {
        const logDate = new Date(log.timestamp)
          .toISOString()
          .split("T")[0];
        return (
          log.staffName?.toLowerCase() ===
            currentUser.username.toLowerCase() &&
          logDate === today
        );
      });

      if (index !== -1) {
        logs[index].logoutTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        localStorage.setItem(
          "staff_attendance_logs",
          JSON.stringify(logs)
        );
      }
    } catch (err) {
      console.error("Error saving logout time", err);
    }

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loginSessionDate");
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  const displayRole =
    currentUser.role.charAt(0).toUpperCase() +
    currentUser.role.slice(1);

  const userInitial = currentUser.username.charAt(0).toUpperCase();

  const sections = [
    "Main",
    "Services",
    "Wallets",
    "Finance",
    "System",
  ];

  return (
    <>
      {/* Floating Update Bubble */}
      {showUpdate && (
        <div className="fixed bottom-6 right-6 z-[100] animate-[fadeIn_.4s_ease]">
          <div className="group relative w-64 rounded-2xl border border-emerald-200/70 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <button
              onClick={handleCloseUpdate}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white"
            >
              <X size={15} />
            </button>

            <div className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    Update Available
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Version {APP_VERSION}
                  </p>
                </div>
              </div>

              <p className="mb-4 text-xs leading-5 text-slate-600 dark:text-slate-300">
                A newer version of Smart Akshaya is ready.
              </p>

              <button
                onClick={updateApplication}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-95"
              >
                Update Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed left-0 top-0 z-40 h-screen w-3"
        onMouseEnter={openSidebar}
      />

      <div className="relative flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
        <aside
          onMouseEnter={openSidebar}
          onMouseLeave={closeSidebar}
          className={`
            fixed
            top-0
            left-0
            z-50
            w-64
            h-screen
            bg-slate-900
            text-slate-300
            hidden
            md:flex
            flex-col
            justify-between
            p-4
            transition-transform
            duration-300
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="mb-4 flex shrink-0 items-start justify-between px-2">
              <div>
                <h1 className="text-xl font-bold tracking-wide text-white">
                  Smart Akshaya
                </h1>
                <p className="text-xs text-slate-400">
                  Akshaya Pookiparamba
                </p>
              </div>

              <div className="flex items-center gap-1">
                {/* Theme Toggle Button Inside Sidebar Header */}
                <button
                  onClick={toggleTheme}
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
                </button>

                <button
                  onClick={togglePinSidebar}
                  title={
                    sidebarPinned
                      ? "Unpin Sidebar"
                      : "Pin Sidebar"
                  }
                  className={`rounded p-1 transition ${
                    sidebarPinned
                      ? "text-emerald-400"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <Pin size={16} />
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
              {sections.map((sectionName) => {
                const sectionItems = allowedMenus.filter(
                  (item) => item.section === sectionName
                );

                if (sectionItems.length === 0) return null;

                return (
                  <div key={sectionName}>
                    <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {sectionName}
                    </p>

                    <ul className="space-y-1">
                      {sectionItems.map((item) => {
                        const IconComponent = item.icon;

                        return (
                          <li
                            key={item.path}
                            onClick={() =>
                              router.push(item.path)
                            }
                            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 font-medium transition ${
                              isActive(item.path)
                                ? "bg-emerald-600 text-white"
                                : "hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <IconComponent size={18} />
                            <span>{item.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-slate-800 pt-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold uppercase text-white">
                {userInitial}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {currentUser.username}
                </p>
                <p className="text-xs text-slate-500">
                  {displayRole}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="cursor-pointer text-slate-500 transition hover:text-rose-400"
            >
              <LogOut size={18} />
            </button>
          </div>
        </aside>

        <main
          className={`
            flex-1
            min-h-screen
            overflow-y-auto
            bg-slate-100
            dark:bg-slate-950
            p-6
            transition-all
            duration-300
            ${sidebarOpen ? "ml-64" : "ml-0"}
          `}
        >
          {children}
        </main>
      </div>
    </>
  );
}