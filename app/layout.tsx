import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClientProviders from "@/app/client-providers"; // ملف لتغليف مكونات Client

export const metadata: Metadata = {
  title: "Education",
  description: "Course Platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="min-h-screen">
      <body className="min-h-screen w-full bg-white text-black overflow-x-hidden">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
