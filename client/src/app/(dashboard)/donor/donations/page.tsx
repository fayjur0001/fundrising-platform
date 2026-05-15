// src/app/(dashboard)/donor/donations/page.tsx
'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import DonationSummary from '@/components/donation/DonationSummary'
import ReceiptDownload from '@/components/donation/ReceiptDownload'
import EmptyState from '@/components/common/EmptyState'
import { mockDonations } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DONOR_ID = 'user-004'
const PAGE_SIZE = 6

type DateFilter = '30' | '90' | '365' | 'all'

const DATE_TABS: { label: string; value: DateFilter }[] = [
  { label: 'Last 30 days', value: '30' },
  { label: '3 months', value: '90' },
  { label: '1 year', value: '365' },
  { label: 'All time', value: 'all' },
]

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  refunded: 'bg-red-100 text-red-700',
}

export default function DonorDonationsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [page, setPage] = useState(1)

  const myDonations = mockDonations
    .filter((d) => d.donorId === DONOR_ID)
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filtered =
    dateFilter === 'all'
      ? myDonations
      : myDonations.filter((d) => {
          const cutoff = new Date(Date.now() - parseInt(dateFilter) * 24 * 60 * 60 * 1000)
          return new Date(d.createdAt) >= cutoff
        })

  const totalRaised = filtered
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0)
  const completedCount = filtered.filter((d) => d.status === 'completed').length
  const uniqueDonors = new Set(filtered.map((d) => d.donorId)).size
  const avgDonation = completedCount > 0 ? totalRaised / completedCount : 0

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDateFilter = (val: DateFilter) => {
    setDateFilter(val)
    setPage(1)
  }

  return (
    <DashboardLayout role="donor">
      <PageHeader title="My Donations" />

      {/* Summary */}
      <div className="mb-6">
        <DonationSummary
          totalRaised={totalRaised}
          totalDonors={uniqueDonors}
          averageDonation={avgDonation}
          completedCount={completedCount}
        />
      </div>

      {/* Date Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {DATE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleDateFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              dateFilter === tab.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table or Empty */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No donations found"
          description="You haven't made any donations in this period."
        />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      {/* Campaign */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800 truncate max-w-[160px]" title={d.campaignTitle}>
                            {d.campaignTitle}
                          </p>
                          {d.isAnonymous && (
                            <span className="shrink-0 inline-block px-1.5 py-0 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                              Anon
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Amount */}
                      <td className="px-4 py-3 font-semibold text-emerald-600 whitespace-nowrap">
                        {formatBDT(d.amount)}
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 text-slate-400 hidden md:table-cell whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      {/* Message */}
                      <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-[200px]">
                        {d.message ? (
                          <span className="truncate block max-w-[200px]" title={d.message}>
                            {d.message}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">—</span>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[d.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {d.status}
                        </span>
                      </td>
                      {/* Receipt */}
                      <td className="px-4 py-3 text-right">
                        <ReceiptDownload donation={d} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} donations
              </p>
              <p className="text-xs font-medium text-slate-600">
                Total: <span className="text-emerald-600">{formatBDT(totalRaised)}</span>
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
                    page === p
                      ? 'bg-emerald-600 text-white'
                      : 'border border-gray-200 text-slate-600 hover:bg-gray-50'
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