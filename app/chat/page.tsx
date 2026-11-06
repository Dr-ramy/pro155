"use client";

import React, { useState, useEffect, useRef, FormEvent, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import { FaPaperPlane, FaArrowLeft, FaPlus } from "react-icons/fa";

type Message = {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
};

const PAGE_SIZE = 10;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ChatPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const username = session?.user?.name ?? "";

  useEffect(() => {
    getSession().then((sessionData) => {
      setSession(sessionData);
    });
  }, []);

  const { data, size, setSize, isValidating, mutate } =
    useSWRInfinite<Message[]>(
      (index: number) => `/api/chat/messages?page=${index + 1}&limit=${PAGE_SIZE}`,
      fetcher
    );

  const messages: Message[] = useMemo(() => {
    return data ? ([] as Message[]).concat(...data) : [];
  }, [data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username) return;

    const messageData = {
      username,
      content: newMessage.trim(),
    };

    await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });

    setNewMessage("");
    mutate();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">غرفة الدردشة</h1>
        <Link
          href="/content"
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
        >
          <FaArrowLeft />
          <span>العودة للمحتوى</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-white shadow">
        {messages.length === 0 && (
          <p className="text-center text-gray-500">لا توجد رسائل بعد.</p>
        )}

        {messages.map((msg: Message) => (
          <div key={msg._id} className="mb-3 border-b pb-2">
            <span className="font-semibold">{msg.username}: </span>
            <span>{msg.content}</span>
            <div className="text-xs text-gray-400">
              {new Date(msg.createdAt).toLocaleString()}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="اكتب رسالتك..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="grow border rounded px-3 py-2"
          disabled={!username}
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 rounded disabled:opacity-50"
          disabled={!newMessage.trim() || !username}
        >
          <FaPaperPlane />
          إرسال
        </button>
      </form>

      {isValidating && (
        <p className="text-center text-gray-500 mt-2">جارِ التحميل...</p>
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => setSize(size + 1)}
          disabled={isValidating}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaPlus />
          تحميل المزيد
        </button>
      </div>
    </div>
  );
}
