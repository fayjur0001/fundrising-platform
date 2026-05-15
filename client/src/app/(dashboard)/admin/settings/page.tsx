// src/app/(dashboard)/admin/settings/page.tsx
'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, AlertTriangle } from 'lucide-react'

type Tab = 'general' | 'features' | 'maintenance'

const TABS: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'features', label: 'Features' },
  { key: 'maintenance', label: 'Maintenance' },
]

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  danger?: boolean
  id?: string
}

function Toggle({ checked, onChange, danger = false, id }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        checked
          ? danger
            ? 'bg-red-500 focus:ring-red-400'
            : 'bg-emerald-600 focus:ring-emerald-500'
          : 'bg-gray-200 focus:ring-gray-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

interface ToastState {
  visible: boolean
  message: string
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' })

  // General
  const [siteName, setSiteName] = useState('FundRaise')
  const [siteDescription, setSiteDescription] = useState(
    'A trusted crowdfunding platform connecting donors with meaningful causes across Bangladesh.'
  )
  const [contactEmail, setContactEmail] = useState('support@fundraise.com.bd')
  const [supportPhone, setSupportPhone] = useState('+880 1800-FUNDRAISE')

  // Features
  const [allowRegistrations, setAllowRegistrations] = useState(true)
  const [allowCampaignCreation, setAllowCampaignCreation] = useState(true)
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(true)
  const [googleLoginEnabled, setGoogleLoginEnabled] = useState(true)

  // Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'We are currently performing scheduled maintenance. We will be back shortly. Thank you for your patience.'
  )

  const showToast = (message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const handleSaveGeneral = () => {
    showToast('Platform settings saved successfully.')
  }

  const handleToggleFeature = (label: string, value: boolean) => {
    showToast(`"${label}" has been ${value ? 'enabled' : 'disabled'}.`)
  }

  const handleMaintenanceToggle = (value: boolean) => {
    setMaintenanceMode(value)
    showToast(
      value
        ? 'Maintenance mode is now ACTIVE. The site is unavailable to users.'
        : 'Maintenance mode has been disabled. The site is live.'
    )
  }

  const handleSaveMaintenance = () => {
    showToast('Maintenance settings saved.')
  }

  return (
    <DashboardLayout role="admin">
      {/* Toast */}
      {toast.visible && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-white border border-emerald-200 text-emerald-800 rounded-xl shadow-md px-4 py-3 text-sm font-medium animate-fade-in max-w-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {toast.message}
        </div>
      )}

      <PageHeader
        title="Platform Settings"
        description="Configure global platform behaviour, features, and availability."
      />

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-white border border-b-white border-gray-200 text-emerald-700 -mb-px'
                : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl rounded-tr-xl shadow-sm">
        {/* ── GENERAL ── */}
        {activeTab === 'general' && (
          <div className="p-6 max-w-2xl space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Site Name</label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Site name"
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Site Description
              </label>
              <Textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of the platform"
                className="rounded-lg resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contact Email
              </label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@example.com"
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Support Phone
              </label>
              <Input
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+880 ..."
                className="rounded-lg"
              />
            </div>
            <div className="pt-2">
              <Button
                onClick={handleSaveGeneral}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* ── FEATURES ── */}
        {activeTab === 'features' && (
          <div className="p-6 max-w-2xl divide-y divide-gray-100">
            {(
              [
                {
                  id: 'registrations',
                  label: 'Allow new registrations',
                  description: 'Let new users sign up on the platform.',
                  value: allowRegistrations,
                  setter: (v: boolean) => {
                    setAllowRegistrations(v)
                    handleToggleFeature('Allow new registrations', v)
                  },
                },
                {
                  id: 'campaign-creation',
                  label: 'Allow campaign creation',
                  description: 'Permit verified creators to launch new campaigns.',
                  value: allowCampaignCreation,
                  setter: (v: boolean) => {
                    setAllowCampaignCreation(v)
                    handleToggleFeature('Allow campaign creation', v)
                  },
                },
                {
                  id: 'email-verification',
                  label: 'Email verification required',
                  description: 'Require users to verify their email before accessing features.',
                  value: emailVerificationRequired,
                  setter: (v: boolean) => {
                    setEmailVerificationRequired(v)
                    handleToggleFeature('Email verification required', v)
                  },
                },
                {
                  id: 'google-login',
                  label: 'Google login enabled',
                  description: 'Allow users to sign in using their Google account.',
                  value: googleLoginEnabled,
                  setter: (v: boolean) => {
                    setGoogleLoginEnabled(v)
                    handleToggleFeature('Google login enabled', v)
                  },
                },
              ] as const
            ).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 gap-4">
                <div>
                  <label
                    htmlFor={item.id}
                    className="block text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    {item.label}
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                </div>
                <Toggle
                  id={item.id}
                  checked={item.value}
                  onChange={item.setter}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── MAINTENANCE ── */}
        {activeTab === 'maintenance' && (
          <div className="p-6 max-w-2xl space-y-6">
            {/* Warning banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 font-medium">
                ⚠️ Warning: Enabling maintenance mode will make the site unavailable to all users.
              </p>
            </div>

            {/* Maintenance mode toggle */}
            <div
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                maintenanceMode
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div>
                <p
                  className={`text-sm font-bold ${
                    maintenanceMode ? 'text-red-700' : 'text-slate-800'
                  }`}
                >
                  Maintenance Mode
                </p>
                <p className={`text-xs mt-0.5 ${maintenanceMode ? 'text-red-500' : 'text-slate-500'}`}>
                  {maintenanceMode
                    ? 'Site is currently OFFLINE for users.'
                    : 'Site is live and accessible to all users.'}
                </p>
              </div>
              <Toggle
                checked={maintenanceMode}
                onChange={handleMaintenanceToggle}
                danger
              />
            </div>

            {/* Maintenance message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Maintenance Message
              </label>
              <p className="text-xs text-slate-400 mb-2">
                This message will be displayed to users when maintenance mode is active.
              </p>
              <Textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                rows={4}
                placeholder="Enter the message users will see..."
                className="rounded-lg resize-none"
              />
            </div>

            <div>
              <Button
                onClick={handleSaveMaintenance}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6"
              >
                Save Maintenance Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}