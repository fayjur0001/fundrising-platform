// src/app/(dashboard)/admin/donations/page.tsx
'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import DonationSummary from '@/components/donation/DonationSummary'
import EmptyState from '@/components/common/EmptyState'
import { mockDonations } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 8

type StatusFilter = 'all' | 'pending' | 'completed' | 'refunded'

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Refunded', value: 'refunded' },
]

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  refunded: 'bg-red-100 text-red-700',
}

export default function AdminDonationsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return mockDonations.filter((d) => {
      const q = search.toLowerCase()
      const donorDisplay = d.isAnonymous ? 'anonymous' : d.donorName.toLowerCase()
      const matchSearch =
        !q ||
        donorDisplay.includes(q) ||
        d.campaignTitle.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      return matchSearch && matchStatus
    }).slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (val: string) => { setSearch(val); setPage(1) }
  const handleStatusFilter = (val: StatusFilter) => { setStatusFilter(val); setPage(1) }

  // Summary stats from all donations
  const completedAll = mockDonations.filter((d) => d.status === 'completed')
  const totalRaised = completedAll.reduce((sum, d) => sum + d.amount, 0)
  const uniqueDonors = new Set(mockDonations.map((d) => d.donorId)).size
  const avgDonation = completedAll.length > 0 ? totalRaised / completedAll.length : 0

  const tabCounts: Record<StatusFilter, number> = {
    all: mockDonations.length,
    completed: mockDonations.filter((d) => d.status === 'completed').length,
    pending: mockDonations.filter((d) => d.status === 'pending').length,
    refunded: mockDonations.filter((d) => d.status === 'refunded').length,
  }

  return (
    <DashboardLayout role="admin">
      <PageHeader title="All Donations" />

      {/* Summary */}
      <div className="mb-6">
        <DonationSummary
          totalRaised={totalRaised}
          totalDonors={uniqueDonors}
          averageDonation={avgDonation}
          completedCount={completedAll.length}
        />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search donor or campaign…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
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
        <EmptyState title="No donations found" description="Try adjusting your search or status filter." />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Donor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      {/* Donor */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-emerald-700">
                              {d.isAnonymous ? '?' : d.donorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 whitespace-nowrap">
                              {d.isAnonymous ? 'Anonymous' : d.donorName}
                            </p>
                            {d.isAnonymous && (
                              <span className="inline-block px-1.5 py-0 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                                Anon
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Campaign */}
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell max-w-[180px]">
                        <span className="truncate block max-w-[180px]" title={d.campaignTitle}>
                          {d.campaignTitle}
                        </span>
                      </td>
                      {/* Amount */}
                      <td className="px-4 py-3 font-semibold text-emerald-600 whitespace-nowrap">
                        {formatBDT(d.amount)}
                      </td>
                      {/* Message */}
                      <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-[180px]">
                        {d.message ? (
                          <span className="truncate block max-w-[180px]" title={d.message}>
                            {d.message}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">—</span>
                        )}
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} donations
              </p>
              <p className="text-xs font-medium text-slate-600">
                Filtered total:{' '}
                <span className="text-emerald-600">
                  {formatBDT(
                    filtered
                      .filter((d) => d.status === 'completed')
                      .reduce((sum, d) => sum + d.amount, 0)
                  )}
                </span>
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
    </DashboardLayout>
  )
}