// src/components/notification/NotificationBell.tsx
'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { mockNotifications } from '@/lib/mockData'
import type { Notification } from '@/lib/mockData'
import NotificationDropdown from '@/components/notification/NotificationDropdown'

interface NotificationBellProps {
  userId?: string
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleToggle = () => setOpen((prev) => !prev)
  const handleClose  = () => setOpen(false)

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          onClose={handleClose}
          onMarkAllRead={handleMarkAllRead}
          onRead={handleRead}
        />
      )}
    </div>
  )
}