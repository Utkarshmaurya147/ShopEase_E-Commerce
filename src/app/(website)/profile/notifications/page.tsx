"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import {
  BellIcon,
  ShoppingBagIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notifications/my-notifications");
        setNotifications(data.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/notifications/mark-read/${id}`);
      setNotifications((prev) =>
        prev.map((note: any) =>
          note.id === id ? { ...note, isRead: true } : note
        )
      );
      window.dispatchEvent(new Event("notificationRead"));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((note: any) => ({ ...note, isRead: true }))
      );
      toast.success("All caught up!");
    } catch (err) {
      toast.error("Failed to update notifications");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBagIcon className="h-6 w-6 text-blue-600" />;
      case "payment":
        return <CreditCardIcon className="h-6 w-6 text-green-600" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-400 font-bold">Loading alerts...</div>;

  return (
    <div className="bg-[#d1daeb] rounded-2xl shadow-sm border border-gray-100 p-8 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          Notifications
          <span className="text-sm font-normal text-gray-400">
            ({notifications.length})
          </span>
        </h2>

        {/* Show "Mark all as read" only if there are unread notifications */}
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-4 ">
        {notifications.length > 0 ? (
          notifications.map((note: any) => (
            <div
              key={note.id}
              onClick={() => !note.isRead && handleMarkRead(note.id)}
              className={`p-5 rounded-3xl border transition-all flex gap-4 items-start cursor-pointer group ${
                note.isRead
                  ? "bg-[#e8e9ed] border-gray-100 opacity-80"
                  : "bg-blue-50 border-blue-100 ring-1 ring-blue-100 hover:shadow-md"
              }`}
            >
              {/* Icon Container */}
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50 flex-shrink-0">
                {getIcon(note.type)}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`font-bold transition-colors ${note.isRead ? "text-gray-700" : "text-gray-900"}`}>
                    {note.title}
                  </h4>
                  <span className="text-[10px] font-bold text-gray-600 uppercase whitespace-nowrap ml-4">
                    {format(new Date(note.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <p className={`text-sm mt-1 leading-relaxed ${note.isRead ? "text-gray-600" : "text-gray-600"}`}>
                  {note.message}
                </p>
              </div>

              {/* Unread Blue Dot Indicator */}
              {!note.isRead && (
                <div className="mt-2 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
              )}
            </div>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-24 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <div className="relative inline-block">
                <BellIcon className="h-16 w-16 text-gray-200 mx-auto" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-gray-100 rounded-full border-4 border-gray-50"></div>
            </div>
            <p className="text-gray-400 font-bold mt-4">Everything is quiet here...</p>
            <p className="text-gray-300 text-sm">We'll notify you about your orders and updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}