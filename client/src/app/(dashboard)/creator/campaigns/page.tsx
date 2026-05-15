// src/app/(dashboard)/creator/campaigns/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Pause, Play } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import ProgressBar from '@/components/campaign/ProgressBar'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { mockCampaigns } from '@/lib/mockData'
import type { Campaign } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'

const CREATOR_ID = 'user-002'

type StatusFilter = 'all' | 'active' | 'draft' | 'paused' | 'completed'

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
]

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-gray-100 text-gray-600',
  paused: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  suspended: 'bg-red-100 text-red-700',
}

const gradients = [
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-blue-400 to-cyan-500',
  'from-rose-400 to-pink-500',
]

export default function CreatorCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(
    mockCampaigns.filter((c) => c.creatorId === CREATOR_ID)
  )
  const [activeTab, setActiveTab] = useState<StatusFilter>('all')
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)

  const filtered = activeTab === 'all' ? campaigns : campaigns.filter((c) => c.status === activeTab)

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
      )
    )
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setCampaigns((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const tabCounts: Record<StatusFilter, number> = {
    all: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    draft: campaigns.filter((c) => c.status === 'draft').length,
    paused: campaigns.filter((c) => c.status === 'paused').length,
    completed: campaigns.filter((c) => c.status === 'completed').length,
  }

  return (
    <DashboardLayout role="creator">
      <PageHeader
        title="My Campaigns"
        action={
          <Link
            href="/creator/campaigns/create"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New
          </Link>
        }
      />

      {/* Status Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${activeTab === tab.value ? 'text-emerald-600' : 'text-slate-400'}`}>
              {tabCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No campaigns found"
          description={activeTab === 'all' ? "You haven't created any campaigns yet." : `No ${activeTab} campaigns.`}
          action={
            <Link
              href="/creator/campaigns/create"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Goal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Raised</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Donors</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden xl:table-cell">Deadline</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c, idx) => {
                  const pct = Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100))
                  const gradient = gradients[idx % gradients.length]
                  const canToggle = c.status === 'active' || c.status === 'paused'
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      {/* Campaign */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {c.images?.[0] ? (
                            <img
                              src={c.images[0]}
                              alt={c.title}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} shrink-0`} />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate max-w-[160px]">{c.title}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[160px]">{c.category}</p>
                          </div>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {c.status}
                        </span>
                      </td>
                      {/* Goal */}
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{formatBDT(c.goalAmount)}</td>
                      {/* Raised */}
                      <td className="px-4 py-3 font-semibold text-emerald-600 hidden md:table-cell">{formatBDT(c.raisedAmount)}</td>
                      {/* Progress */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="w-28">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>{pct}%</span>
                          </div>
                          <ProgressBar value={pct} />
                        </div>
                      </td>
                      {/* Donors */}
                      <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{c.donorCount}</td>
                      {/* Deadline */}
                      <td className="px-4 py-3 text-slate-400 hidden xl:table-cell">
                        {new Date(c.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/creator/campaigns/${c.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          {canToggle && (
                            <button
                              onClick={() => handleToggleStatus(c.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title={c.status === 'active' ? 'Pause' : 'Activate'}
                            >
                              {c.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  )
}