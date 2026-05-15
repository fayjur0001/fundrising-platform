// src/app/(dashboard)/admin/campaigns/page.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import { mockCampaigns } from '@/lib/mockData'
import type { Campaign } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'
import { Search, Eye, CheckCircle, ShieldOff, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 8

type StatusFilter = 'all' | 'active' | 'draft' | 'paused' | 'completed' | 'suspended'

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
  { label: 'Suspended', value: 'suspended' },
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

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [suspendTarget, setSuspendTarget] = useState<Campaign | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.creatorName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [campaigns, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (val: string) => { setSearch(val); setPage(1) }
  const handleStatusFilter = (val: StatusFilter) => { setStatusFilter(val); setPage(1) }

  const handleApprove = (id: string) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: 'active' } : c))
  }

  const handleSuspend = () => {
    if (!suspendTarget) return
    setCampaigns((prev) => prev.map((c) => c.id === suspendTarget.id ? { ...c, status: 'suspended' } : c))
    setSuspendTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setCampaigns((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
    if (paginated.length === 1 && page > 1) setPage((p) => p - 1)
  }

  const tabCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = { all: campaigns.length, active: 0, draft: 0, paused: 0, completed: 0, suspended: 0 }
    campaigns.forEach((c) => { if (c.status in counts) counts[c.status as StatusFilter]++ })
    return counts
  }, [campaigns])

  return (
    <DashboardLayout role="admin">
      <PageHeader title="All Campaigns" />

      {/* Search + Status Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, creator, category…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === tab.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            <span className={`ml-1 ${statusFilter === tab.value ? 'text-emerald-600' : 'text-slate-400'}`}>
              {tabCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Table or Empty */}
      {filtered.length === 0 ? (
        <EmptyState title="No campaigns found" description="Try adjusting your search or status filter." />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Creator</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Goal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Raised</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden xl:table-cell">Created</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((c, idx) => {
                    const gradient = gradients[idx % gradients.length]
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        {/* Campaign */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {c.images?.[0] ? (
                              <img
                                src={c.images[0]}
                                alt={c.title}
                                className="w-9 h-9 rounded-lg object-cover shrink-0"
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} shrink-0`} />
                            )}
                            <p className="font-medium text-slate-800 truncate max-w-[140px]" title={c.title}>
                              {c.title}
                            </p>
                          </div>
                        </td>
                        {/* Creator */}
                        <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell whitespace-nowrap">
                          {c.creatorName}
                        </td>
                        {/* Category */}
                        <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell whitespace-nowrap">
                          {c.category}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {c.status}
                          </span>
                        </td>
                        {/* Goal */}
                        <td className="px-4 py-3 text-slate-600 text-xs hidden md:table-cell whitespace-nowrap">
                          {formatBDT(c.goalAmount)}
                        </td>
                        {/* Raised */}
                        <td className="px-4 py-3 font-semibold text-emerald-600 text-xs hidden md:table-cell whitespace-nowrap">
                          {formatBDT(c.raisedAmount)}
                        </td>
                        {/* Created */}
                        <td className="px-4 py-3 text-slate-400 text-xs hidden xl:table-cell whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/campaigns/${c.id}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {c.status !== 'active' && c.status !== 'completed' && (
                              <button
                                onClick={() => handleApprove(c.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {c.status !== 'suspended' && (
                              <button
                                onClick={() => setSuspendTarget(c)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                title="Suspend"
                              >
                                <ShieldOff className="w-4 h-4" />
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

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} campaigns
              </p>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === p ? 'bg-emerald-600 text-white' : 'border border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Suspend Confirm */}
      <ConfirmDialog
        open={!!suspendTarget}
        title="Suspend Campaign"
        description={`Are you sure you want to suspend "${suspendTarget?.title}"? It will be hidden from public listings.`}
        confirmLabel="Suspend"
        variant="danger"
        onConfirm={handleSuspend}
        onCancel={() => setSuspendTarget(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Campaign"
        description={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  )
}