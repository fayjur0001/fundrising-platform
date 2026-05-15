// src/components/campaign/CampaignHeader.tsx
import React from 'react'
import type { Campaign } from '@/lib/mockData'
import Badge, { campaignStatusVariant } from '@/components/ui/badge'

interface CampaignHeaderProps {
  campaign: Campaign
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function CampaignHeader({ campaign }: CampaignHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="default">{campaign.category}</Badge>
        {campaign.status !== 'active' && (
          <Badge variant={campaignStatusVariant(campaign.status)} className="capitalize">
            {campaign.status}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-slate-900 leading-snug">{campaign.title}</h1>

      {/* Creator row */}
      <div className="flex items-center gap-3">
        {campaign.creatorAvatar ? (
          <img
            src={campaign.creatorAvatar}
            alt={campaign.creatorName}
            className="w-10 h-10 rounded-full object-cover bg-gray-100 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-700 text-xs font-semibold">{getInitials(campaign.creatorName)}</span>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-slate-900">{campaign.creatorName}</p>
          <p className="text-xs text-slate-500">
            Campaign Creator · Created {formatDate(campaign.createdAt)}
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />
    </div>
  )
}