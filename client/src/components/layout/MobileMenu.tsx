// src/components/layout/MobileMenu.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Heart } from 'lucide-react'
import Button from '@/components/ui/button'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Heart size={20} className="text-emerald-600 fill-emerald-600" />
            <span className="text-lg font-bold text-emerald-600">FundRaise</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-4 py-5 space-y-1">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  block px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'}
                `}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* CTA buttons */}
        <div className="px-5 pt-2 space-y-3 border-t border-gray-100 mt-2">
          <Link href="/auth/login" onClick={onClose} className="block">
            <Button variant="outline" size="md" className="w-full">Login</Button>
          </Link>
          <Link href="/creator/campaigns/create" onClick={onClose} className="block">
            <Button variant="primary" size="md" className="w-full">Start Campaign</Button>
          </Link>
        </div>
      </div>
    </>
  )
}