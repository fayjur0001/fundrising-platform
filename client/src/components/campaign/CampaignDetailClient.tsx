// src/components/campaign/CampaignDetailClient.tsx
'use client'

import { useState } from 'react'
import type { Campaign, Comment } from '@/lib/mockData'
import CampaignGallery    from '@/components/campaign/CampaignGallery'
import CampaignHeader     from '@/components/campaign/CampaignHeader'
import CampaignDetails    from '@/components/campaign/CampaignDetails'
import CampaignUpdates    from '@/components/campaign/CampaignUpdates'
import CampaignSidebar    from '@/components/campaign/CampaignSidebar'
import CommentSection     from '@/components/campaign/CommentSection'
import ReactionBar        from '@/components/campaign/ReactionBar'
import LiveStats          from '@/components/campaign/LiveStats'
import LiveDonationFeed   from '@/components/campaign/LiveDonationFeed'
import ShareButton        from '@/components/campaign/ShareButton'

type Tab = 'story' | 'updates' | 'comments'

interface CampaignDetailClientProps {
  campaign:  Campaign
  comments:  Comment[]
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'story',    label: 'Story'    },
  { key: 'updates',  label: 'Updates'  },
  { key: 'comments', label: 'Comments' },
]

export default function CampaignDetailClient({
  campaign,
  comments,
}: CampaignDetailClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('story')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Mobile: fully stacked ─────────────────────────────── */}
      {/* ── Desktop: 2-column 65% / 35% ──────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── LEFT COLUMN (65%) ─────────────────────────────── */}
        <div className="w-full lg:w-[65%] flex flex-col gap-6">

          {/* Gallery */}
          <CampaignGallery images={campaign.images} />

          {/* Header */}
          <CampaignHeader campaign={campaign} />

          {/* Sidebar — mobile only (shown between header and tabs) */}
          <div className="lg:hidden flex flex-col gap-5">
            <CampaignSidebar  campaign={campaign} />
            <LiveStats />
            <ShareButton      campaignTitle={campaign.title} />
            <LiveDonationFeed />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-gray-200">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/40'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'comments' && comments.length > 0 && (
                    <span className="ml-1.5 text-xs text-slate-400">({comments.length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'story' && (
                <CampaignDetails campaign={campaign} />
              )}
              {activeTab === 'updates' && (
                <CampaignUpdates />
              )}
              {activeTab === 'comments' && (
                <CommentSection campaignId={campaign.id} comments={comments} />
              )}
            </div>
          </div>

          {/* Reaction bar */}
          <ReactionBar />
        </div>

        {/* ── RIGHT COLUMN (35%) — desktop only, sticky ─────── */}
        <div className="hidden lg:flex w-full lg:w-[35%] flex-col gap-5">
          <div className="sticky top-24 flex flex-col gap-5">
            <CampaignSidebar  campaign={campaign} />
            <LiveStats />
            <ShareButton      campaignTitle={campaign.title} />
            <LiveDonationFeed />
          </div>
        </div>

      </div>
    </div>
  )
}