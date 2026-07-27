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
} from "lucide-react";

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
    name: "Wallet Management",
    path: "/dashboard/wallet-management",
    icon: Wallet,
    section: "Wallets",
    permissionKey: "Wallets Balance",
  },
  {
    name: "Billed Services",
    path: "/dashboard/billed-services",
    icon: FileSpreadsheet,
    section: "Finance",
    permissionKey: "Service Reports",
  },
  {
    name: "Transaction History",
    path: "/dashboard/transaction-history",
    icon: History,
    section: "Finance",
    permissionKey: "Service Reports",
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
    permissionKey: "Expenses",
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
    permissionKey: "Dashboard Wallet Balance",
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

const [sidebarPinned, setSidebarPinned] = useState(false);

const [allowedMenus, setAllowedMenus] =
  useState<MenuItem[]>(allMenuItems);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    const storedUser = localStorage.getItem("loggedInUser");

    let userRole = "admin";
    let username = "";

    if (storedUser) {
      try {
const parsed = JSON.parse(storedUser);

username = parsed.username || "";
userRole = (parsed.role || "staff").toLowerCase();

setCurrentUser({
  username: parsed.username || "User",
  role: (parsed.role || "staff").toLowerCase(),
});

const pinKey = `sidebar_pinned_${username.toLowerCase()}`;

const savedPin = localStorage.getItem(pinKey);

if (savedPin !== null) {
  const pinned = savedPin === "true";
  setSidebarPinned(pinned);
  setSidebarOpen(pinned);
}

      } catch (err) {
        console.error("Error reading loggedInUser", err);
      }
    }

    if (userRole === "admin" && username.toLowerCase() === "admin") {
      setAllowedMenus(allMenuItems);
      return;
    }
        let actualRole = userRole;

    const savedStaffData = localStorage.getItem("smart_akshaya_staff");

    if (savedStaffData) {
      try {
        const staffArray = JSON.parse(savedStaffData);

        const matched = staffArray.find((s: any) => {
          const sName = (
            s.name ||
            s.staffName ||
            s.username ||
            ""
          )
            .trim()
            .toLowerCase();

          return sName === username.toLowerCase();
        });

        if (matched && matched.role) {
          actualRole = matched.role.trim().toLowerCase();
        }
        setCurrentUser({
  username,
  role: actualRole,
});
      } catch (e) {
        console.error("Error checking staff role", e);
      }
    }

    if (actualRole === "admin") {
      setAllowedMenus(allMenuItems);
      return;
    }

    const savedPermissions = localStorage.getItem(
      "role_feature_permissions"
    );

    if (savedPermissions) {
      try {
        const permissionsList = JSON.parse(savedPermissions);

        const filtered = allMenuItems.filter((item) => {
          if (
            item.path ===
            "/dashboard/feature-permissions"
          )
            return false;

          const found = permissionsList.find(
            (p: any) =>
              p.featureName === item.permissionKey
          );

          if (!found) return true;

          if (actualRole === "accountant") {
            return found.accountantAccess;
          }

          return found.staffAccess;
        });

        setAllowedMenus(filtered);

        const isCurrentAllowed =
          filtered.some(
            (item) => item.path === pathname
          ) || pathname === "/dashboard";

        if (!isCurrentAllowed) {
          router.push("/dashboard");
        }
      } catch (e) {
        console.error(
          "Error parsing permissions",
          e
        );
      }
    } else {
      setAllowedMenus(allMenuItems);
    }
  }, [pathname, router]);

const togglePinSidebar = () => {
  const newValue = !sidebarPinned;

  setSidebarPinned(newValue);
  setSidebarOpen(newValue);

  const pinKey = `sidebar_pinned_${currentUser.username.toLowerCase()}`;

  localStorage.setItem(pinKey, String(newValue));
};
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  const isActive = (path: string) =>
    pathname === path;

  const displayRole =
    currentUser.role.charAt(0).toUpperCase() +
    currentUser.role.slice(1);

  const userInitial =
    currentUser.username.charAt(0).toUpperCase();

  const sections = [
    "Main",
    "Services",
    "Wallets",
    "Finance",
    "System",
  ];

  return (
    <>
      <div
        className="fixed left-0 top-0 h-screen w-3 z-40"
        onMouseEnter={openSidebar}
      />

      <div className="relative flex w-full h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">

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
 <div className="mb-4 px-2 shrink-0 flex items-start justify-between">
  <div>
    <h1 className="text-xl font-bold text-white tracking-wide">
      Smart Akshaya
    </h1>

    <p className="text-xs text-slate-400">
      Akshaya Pookiparamba
    </p>
  </div>

  <button
    onClick={togglePinSidebar}
    title={sidebarPinned ? "Unpin Sidebar" : "Pin Sidebar"}
    className={`p-1 rounded transition ${
      sidebarPinned
        ? "text-emerald-400"
        : "text-slate-500 hover:text-white"
    }`}
  >
    <Pin size={16} />
  </button>
</div>

<nav className="space-y-4 overflow-y-auto flex-1 pr-1">
  {sections.map((sectionName) => {
                const sectionItems = allowedMenus.filter(
                  (item) => item.section === sectionName
                );

                if (sectionItems.length === 0) return null;

                return (
                  <div key={sectionName}>
                    <p className="text-xs font-semibold text-slate-500 uppercase px-2 mb-1 tracking-wider">
                      {sectionName}
                    </p>

                    <ul className="space-y-1">
                      {sectionItems.map((item) => {
                        const IconComponent = item.icon;

                        return (
                          <li
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition font-medium ${
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

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm uppercase">
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
              className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
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
    p-6
    bg-slate-100
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