'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaTrash, FaComments, FaUserShield } from "react-icons/fa";
import { useRouter } from 'next/navigation';

type Message = {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const router = useRouter();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete message');
      await fetchMessages();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء حذف الرسالة');
    }
    setDeletingId(null);
  };

  // فلترة الرسائل حسب اسم المستخدم (case insensitive)
  const filteredMessages = messages.filter(msg =>
    msg.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center flex-1">إدارة رسائل الدردشة</h1>

        <div className="flex space-x-4">
          <Button
            onClick={() => router.push('/chat')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <FaComments />
            <span>عودة لصفحة الدردشة</span>
          </Button>

          <Button
            onClick={() => router.push('/admin')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <FaUserShield />
            <span>عودة لصفحة المشرف</span>
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="فلتر حسب اسم المستخدم..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <p className="text-center py-4">جارِ التحميل...</p>}
      {!loading && filteredMessages.length === 0 && (
        <p className="text-center py-4">لا توجد رسائل تطابق البحث.</p>
      )}

      <ScrollArea className="h-125 md:h-150 rounded-md border p-2">
        <ul className="space-y-4">
          {filteredMessages.map(msg => (
            <li
              key={msg._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{msg.username}</p>
                <p className="truncate">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(msg._id)}
                disabled={deletingId === msg._id}
                className="mt-2 sm:mt-0 sm:ml-4 whitespace-nowrap flex items-center space-x-2 cursor-pointer"
              >
                <FaTrash />
                <span>{deletingId === msg._id ? 'جارِ الحذف...' : 'حذف'}</span>
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
