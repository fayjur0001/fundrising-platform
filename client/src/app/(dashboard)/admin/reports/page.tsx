// src/app/(dashboard)/admin/reports/page.tsx
'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, XCircle, ShieldAlert } from 'lucide-react'

type ReportStatus = 'pending' | 'reviewed' | 'dismissed'
type ReportReason = 'Fake campaign' | 'Spam' | 'Misleading' | 'Inappropriate'
type FilterTab = 'all' | ReportStatus

interface Report {
  id: string
  reporterName: string
  campaignTitle: string
  campaignId: string
  reason: ReportReason
  date: string
  status: ReportStatus
}

const initialReports: Report[] = [
  {
    id: 'rep-001',
    reporterName: 'Karim Hossain',
    campaignTitle: 'Help Flood Victims of Sylhet',
    campaignId: 'campaign-001',
    reason: 'Fake campaign',
    date: '2024-11-10',
    status: 'pending',
  },
  {
    id: 'rep-002',
    reporterName: 'Sumaiya Akter',
    campaignTitle: 'Medical Aid for Rina Begum',
    campaignId: 'campaign-002',
    reason: 'Misleading',
    date: '2024-11-12',
    status: 'pending',
  },
  {
    id: 'rep-003',
    reporterName: 'Tanvir Islam',
    campaignTitle: 'School Rebuilding Project Rangpur',
    campaignId: 'campaign-003',
    reason: 'Spam',
    date: '2024-11-08',
    status: 'reviewed',
  },
  {
    id: 'rep-004',
    reporterName: 'Nasrin Khanam',
    campaignTitle: 'Winter Clothes for Street Children',
    campaignId: 'campaign-004',
    reason: 'Inappropriate',
    date: '2024-11-05',
    status: 'dismissed',
  },
  {
    id: 'rep-005',
    reporterName: 'Rafiqul Alam',
    campaignTitle: 'Clean Water Initiative Cox\'s Bazar',
    campaignId: 'campaign-005',
    reason: 'Fake campaign',
    date: '2024-11-14',
    status: 'pending',
  },
]

const reasonColors: Record<ReportReason, string> = {
  'Fake campaign': 'bg-red-100 text-red-700 border-red-200',
  'Spam': 'bg-amber-100 text-amber-700 border-amber-200',
  'Misleading': 'bg-orange-100 text-orange-700 border-orange-200',
  'Inappropriate': 'bg-purple-100 text-purple-700 border-purple-200',
}

const statusColors: Record<ReportStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  reviewed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  dismissed: 'bg-gray-100 text-gray-500 border-gray-200',
}

const statusLabels: Record<ReportStatus, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  dismissed: 'Dismissed',
}

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'reviewed', label: 'Reviewed' },
  { key: 'dismissed', label: 'Dismissed' },
]

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [suspendTarget, setSuspendTarget] = useState<Report | null>(null)

  const filtered = activeTab === 'all' ? reports : reports.filter((r) => r.status === activeTab)

  const counts: Record<FilterTab, number> = {
    all: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    reviewed: reports.filter((r) => r.status === 'reviewed').length,
    dismissed: reports.filter((r) => r.status === 'dismissed').length,
  }

  const markAs = (id: string, status: ReportStatus) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const handleSuspendConfirm = () => {
    if (!suspendTarget) return
    markAs(suspendTarget.id, 'reviewed')
    setSuspendTarget(null)
  }

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Reports & Abuse"
        description="Review and manage reported campaigns from users."
      />

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-white border border-b-white border-gray-200 text-emerald-700 -mb-px'
                : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-0 bg-white border border-gray-200 rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No reports found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Reporter</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Campaign</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Reason</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-slate-800 font-medium whitespace-nowrap">
                      {report.reporterName}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <Link
                        href={`/campaigns/${report.campaignId}`}
                        className="text-emerald-700 hover:text-emerald-800 hover:underline font-medium line-clamp-1"
                      >
                        {report.campaignTitle}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${reasonColors[report.reason]}`}
                      >
                        {report.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(report.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[report.status]}`}
                      >
                        {statusLabels[report.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {report.status !== 'reviewed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1"
                            onClick={() => markAs(report.id, 'reviewed')}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Review
                          </Button>
                        )}
                        {report.status !== 'dismissed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2.5 text-xs text-slate-600 border-gray-200 hover:bg-gray-50 gap-1"
                            onClick={() => markAs(report.id, 'dismissed')}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Dismiss
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1"
                          onClick={() => setSuspendTarget(report)}
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Suspend
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Suspend ConfirmDialog */}
      {suspendTarget && (
        <ConfirmDialog
          open={!!suspendTarget}
          onClose={() => setSuspendTarget(null)}
          onConfirm={handleSuspendConfirm}
          title="Suspend Campaign"
          description={`Are you sure you want to suspend "${suspendTarget.campaignTitle}"? This action will make the campaign inaccessible to donors and cannot be undone without admin intervention.`}
          confirmLabel="Suspend Campaign"
          variant="danger"
        />
      )}
    </DashboardLayout>
  )
}