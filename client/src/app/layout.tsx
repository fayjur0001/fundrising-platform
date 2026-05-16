// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  title: "FundRise — Bangladesh's Trusted Fundraising Platform",
  description: 'Raise funds for causes that matter in Bangladesh.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {/*
          AuthProvider: app load হলেই silently /auth/refresh call করে।
          Cookie থাকলে নতুন accessToken memory-তে রাখে।
          এরপর children render হয় — page refresh বা server restart-এ
          login আর break হবে না।
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}