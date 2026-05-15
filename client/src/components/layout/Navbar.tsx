// src/components/layout/Navbar.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu } from 'lucide-react'
import Button from '@/components/ui/button'
import MobileMenu from './MobileMenu'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Heart size={22} className="text-emerald-600 fill-emerald-600" />
              <span className="text-lg font-bold text-emerald-600">FundRaise</span>
            </Link>

            {/* Center nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'text-emerald-600 font-medium bg-emerald-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/creator/campaigns/create">
                <Button variant="primary" size="sm">Start Campaign</Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}