// app/admin/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaUsers, FaEnvelope, FaFileAlt, FaHome,FaComments } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">لوحة تحكم المشرف</h1>

        <Link href="/admin/enroll" className="block">
          <Button
            variant="default"
            className="w-full text-base py-6 rounded-2xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 cursor-pointer"
          >
            <FaUsers className="text-xl" />
            إدارة المستخدمين
          </Button>
        </Link>

        <Link href="/admin/chat" className="block">
          <Button
            variant="default"
            className="w-full text-base py-6 rounded-2xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 cursor-pointer"
          >
            <FaComments className="text-xl" />
            إدارة الدردشة
          </Button>
        </Link>

        <Link href="/admin/messages" className="block">
          <Button
            variant="default"
            className="w-full text-base py-6 rounded-2xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 cursor-pointer"
          >
            <FaEnvelope className="text-xl" />
            الرسائل
          </Button>
        </Link>

        <Link href="/content" className="block">
          <Button
            variant="default"
            className="w-full text-base py-6 rounded-2xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 cursor-pointer"
          >
            <FaFileAlt className="text-xl" />
            المحتوى
          </Button>
        </Link>

        <Link href="/" className="block">
          <Button
            variant="default"
            className="w-full text-base py-6 rounded-2xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 cursor-pointer"
          >
            <FaHome className="text-xl" />
            الصفحة الرئيسية
          </Button>
        </Link>
      </div>
    </main>
  );
}
