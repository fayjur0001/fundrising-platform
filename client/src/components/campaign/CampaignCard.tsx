// src/components/campaign/CampaignCard.tsx
import React from 'react'
import Link from 'next/link'
import type { Campaign } from '@/lib/mockData'
import { formatBDT, daysLeft } from '@/lib/utils'
import ProgressBar from './ProgressBar'
import Badge from '@/components/ui/badge'
import { campaignStatusVariant } from '@/components/ui/badge'
import { Users, Clock } from 'lucide-react'

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const remaining = daysLeft(campaign.deadline)

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:scale-[1.015] hover:shadow-md transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {campaign.images[0] ? (
          <img
            src={campaign.images[0]}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-200" />
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="bg-white/90 text-slate-700 backdrop-blur-sm">
            {campaign.category}
          </Badge>
        </div>

        {/* Status badge — only if not active */}
        {campaign.status !== 'active' && (
          <div className="absolute top-3 right-3">
            <Badge variant={campaignStatusVariant(campaign.status)} className="capitalize">
              {campaign.status}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
          {campaign.title}
        </h3>

        {/* Creator */}
        <div className="flex items-center gap-2">
          {campaign.creatorAvatar ? (
            <img
              src={campaign.creatorAvatar}
              alt={campaign.creatorName}
              className="w-6 h-6 rounded-full bg-gray-100 flex-shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex-shrink-0" />
          )}
          <span className="text-xs text-slate-500 truncate">{campaign.creatorName}</span>
        </div>

        {/* Progress */}
        <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} size="sm" />

        {/* Amounts */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            <span className="font-semibold text-slate-900">{formatBDT(campaign.raisedAmount)}</span>
            {' '}raised
          </span>
          <span>{formatBDT(campaign.goalAmount)} goal</span>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {campaign.donorCount} donors
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {remaining > 0 ? `${remaining} days left` : 'Ended'}
          </span>
        </div>
      </div>
    </Link>
  )
}