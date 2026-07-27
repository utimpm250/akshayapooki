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
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}