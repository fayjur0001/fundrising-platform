// src/components/notification/NotificationDropdown.tsx
'use client'

import { useEffect, useRef } from 'react'
import type { Notification } from '@/lib/mockData'
import NotificationItem from '@/components/notification/NotificationItem'
import Link from 'next/link'

interface NotificationDropdownProps {
  notifications: Notification[]
  onClose: () => void
  onMarkAllRead: () => void
  onRead: (id: string) => void
}

export default function NotificationDropdown({
  notifications,
  onClose,
  onMarkAllRead,
  onRead,
}: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [onClose])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-50 w-[360px] bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        {notifications.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-2xl mb-2">🔔</p>
            <p className="text-sm text-slate-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={onRead} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
        <Link
          href="/notifications"
          onClick={onClose}
          className="block text-center text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          View all notifications →
        </Link>
      </div>
    </div>
  )
}