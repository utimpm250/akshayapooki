import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Akshaya Management System",
  description: "Smart Akshaya Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}