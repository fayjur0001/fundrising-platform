"use client";

import { useEffect, useState } from "react";
import { Server, FileText, Settings, Wallet, Bell, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import {
  notificationService,
  formatRelativeTime,
  type Notification,
  type NotificationFilter,
} from "@/lib/notification.service";

type TabLabel = "Today" | "This Week" | "Earlier";

const TAB_FILTER_MAP: Record<TabLabel, NotificationFilter> = {
  Today: "today",
  "This Week": "week",
  Earlier: "earlier",
};

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  topup_approved: { icon: Wallet,   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  proxy_rent:     { icon: Server,   color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  system:         { icon: Settings, color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
  default:        { icon: FileText, color: "text-zinc-400",    bg: "bg-zinc-800/60 border-zinc-700/40" },
};

const NotifIcon = ({ type }: { type: string }) => {
  const cfg = typeConfig[type] ?? typeConfig.default;
  const Icon = cfg.icon;
  return (
    <div className={`p-2 rounded-xl border ${cfg.bg} shrink-0`}>
      <Icon className={`w-4 h-4 ${cfg.color}`} />
    </div>
  );
};

const NotificationDropdown = () => {
  const [activeTab, setActiveTab] = useState<TabLabel>("Today");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { notificationsCount, refreshNotifications } = useAuth();

  useEffect(() => {
    if (!open) return;
    const filter = TAB_FILTER_MAP[activeTab];
    setLoading(true);
    notificationService
      .getNotifications(filter)
      .then((res) => setNotifications(res.data ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [activeTab, open]);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && notificationsCount > 0) {
      notificationService.markAllRead().then(() => refreshNotifications());
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="relative cursor-pointer p-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 outline-none group">
          <Bell className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-zinc-950">
              {notificationsCount > 9 ? "9+" : notificationsCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[360px] sm:w-[420px] p-0 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Bell className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-[11px] text-emerald-400">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <Link href="/admin/notification">
            <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-emerald-400 transition-colors font-medium">
              See all <ArrowRight className="h-3 w-3" />
            </button>
          </Link>
        </div>

        <div className="px-4 pt-3 pb-2">
          <div className="flex gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/60">
            {(["Today", "This Week", "Earlier"] as TabLabel[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center gap-2 text-zinc-600">
              <div className="w-4 h-4 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs">Loading…</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-zinc-600">
              <Bell className="h-8 w-8 opacity-30" />
              <span className="text-xs">No notifications yet</span>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 px-5 py-4 hover:bg-zinc-900/60 transition-colors cursor-pointer ${
                    !item.isRead ? "bg-emerald-950/10" : ""
                  }`}
                >
                  <NotifIcon type={item.type} />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {!item.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        )}
                        <h4 className={`text-xs font-semibold truncate ${!item.isRead ? "text-white" : "text-zinc-200"}`}>
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-zinc-600 shrink-0 whitespace-nowrap">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-zinc-500 line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-zinc-800/60 bg-zinc-950">
          <Link href="/admin/notification" className="block">
            <button className="w-full text-xs text-zinc-500 hover:text-emerald-400 transition-colors font-medium py-1 flex items-center justify-center gap-1.5">
              View all notifications <ArrowRight className="h-3 w-3" />
            </button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;