"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";

function BellIcon({ hasUnread }) {
  return (
    <div className="relative">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#9A9CA6]"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {hasUnread && (
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#14151A] bg-[#FF5B3C]" />
      )}
    </div>
  );
}

function TimeAgo({ date }) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return <span>{diff}s ago</span>;
  if (diff < 3600) return <span>{Math.floor(diff / 60)}m ago</span>;
  if (diff < 86400) return <span>{Math.floor(diff / 3600)}h ago</span>;
  return <span>{Math.floor(diff / 86400)}d ago</span>;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = () => {
    if (!session?.user?.email) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?userEmail=${session.user.email}`)
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
      method: "PATCH",
    });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = async () => {
    if (!session?.user?.email) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: session.user.email }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (!session?.user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center rounded-full p-2 transition hover:bg-white/5"
        aria-label="Notifications"
      >
        <BellIcon hasUnread={unreadCount > 0} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="text-sm font-semibold text-[#F5F3EF]">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-[#FF5B3C] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#9A9CA6] hover:text-[#FF5B3C]"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#6B6D78]"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p className="text-xs text-[#6B6D78]">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => !n.read && markAsRead(n._id)}
                  className={`w-full border-b border-white/5 px-4 py-3 text-left transition last:border-0 hover:bg-white/5 ${
                    !n.read ? "bg-[#FF5B3C]/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        n.type === "trainer_approved"
                          ? "bg-emerald-500/15"
                          : "bg-red-500/15"
                      }`}
                    >
                      {n.type === "trainer_approved" ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#F5F3EF]">{n.title}</p>
                        {!n.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF5B3C]" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#9A9CA6]">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[10px] text-[#6B6D78]">
                        <TimeAgo date={n.createdAt} />
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}