// src/app/(dashboard)/creator/donations/page.tsx
'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/common/PageHeader'
import DonationSummary from '@/components/donation/DonationSummary'
import DonationTable from '@/components/donation/DonationTable'
import EmptyState from '@/components/common/EmptyState'
import { mockCampaigns, mockDonations } from '@/lib/mockData'
import type { Donation } from '@/lib/mockData'
import { formatBDT } from '@/lib/utils'

const CREATOR_ID = 'user-002'

export default function CreatorDonationsPage() {
  const myCampaigns = mockCampaigns.filter((c) => c.creatorId === CREATOR_ID)
  const myCampaignIds = new Set(myCampaigns.map((c) => c.id))
  const allDonations = mockDonations.filter((d) => myCampaignIds.has(d.campaignId))

  const [selectedCampaign, setSelectedCampaign] = useState<string>('all')

  const filtered: Donation[] =
    selectedCampaign === 'all'
      ? allDonations
      : allDonations.filter((d) => d.campaignId === selectedCampaign)

  const totalRaised = filtered.reduce((sum, d) => sum + (d.status === 'completed' ? d.amount : 0), 0)
  const totalDonors = new Set(filtered.filter((d) => !d.isAnonymous).map((d) => d.donorId)).size
  const completedCount = filtered.filter((d) => d.status === 'completed').length
  const averageDonation = completedCount > 0 ? totalRaised / completedCount : 0

  const summaryData = {
    totalRaised,
    totalDonors,
    averageDonation,
    completedCount,
  }

  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    refunded: 'bg-red-100 text-red-700',
  }

  return (
    <DashboardLayout role="creator">
      <PageHeader title="Donations Received" />

      {/* Summary */}
      <div className="mb-6">
        <DonationSummary
          totalRaised={summaryData.totalRaised}
          totalDonors={summaryData.totalDonors}
          averageDonation={summaryData.averageDonation}
          completedCount={summaryData.completedCount}
        />
      </div>

      {/* Campaign Filter */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <label className="text-sm font-medium text-slate-600 shrink-0">Filter by campaign:</label>
        <select
          value={selectedCampaign}
          onChange={(e) => setSelectedCampaign(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-w-[220px]"
        >
          <option value="all">All Campaigns ({allDonations.length})</option>
          {myCampaigns.map((c) => {
            const count = allDonations.filter((d) => d.campaignId === c.id).length
            return (
              <option key={c.id} value={c.id}>
                {c.title} ({count})
              </option>
            )
          })}
        </select>
        {selectedCampaign !== 'all' && (
          <button
            onClick={() => setSelectedCampaign('all')}
            className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Table or Empty */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No donations found"
          description={
            selectedCampaign === 'all'
              ? "You haven't received any donations yet."
              : 'No donations for this campaign yet.'
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Donor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered
                  .slice()
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      {/* Donor */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-emerald-700">
                              {d.isAnonymous ? '?' : d.donorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {d.isAnonymous ? 'Anonymous' : d.donorName}
                            </p>
                            {d.isAnonymous && (
                              <span className="inline-block mt-0.5 px-1.5 py-0 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                                Anonymous
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Amount */}
                      <td className="px-4 py-3 font-semibold text-emerald-600">{formatBDT(d.amount)}</td>
                      {/* Message */}
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell max-w-[200px]">
                        {d.message ? (
                          <span className="truncate block max-w-[200px]" title={d.message}>
                            {d.message}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">—</span>
                        )}
                      </td>
                      {/* Campaign */}
                      <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-[160px]">
                        <span className="truncate block max-w-[160px]" title={d.campaignTitle}>
                          {d.campaignTitle}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 text-slate-400 hidden lg:table-cell whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            statusColors[d.status] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-slate-400">
              Showing {filtered.length} donation{filtered.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs font-medium text-slate-600">
              Total: <span className="text-emerald-600">{formatBDT(totalRaised)}</span>
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}