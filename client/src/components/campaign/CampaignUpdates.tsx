// src/components/campaign/CampaignUpdates.tsx
import React from 'react'
import EmptyState from '@/components/common/EmptyState'
import { Bell } from 'lucide-react'

interface Update {
  date: string
  title: string
  content: string
}

interface CampaignUpdatesProps {
  updates?: Update[]
}

const MOCK_UPDATES: Update[] = [
  {
    date: '2024-06-20T10:00:00Z',
    title: 'We reached 50% of our goal!',
    content:
      'Thanks to your incredible generosity, we have now raised half of our target amount. The funds are being deployed immediately to those in need. Your support is making a real difference.',
  },
  {
    date: '2024-06-10T08:00:00Z',
    title: 'Campaign launched successfully',
    content:
      'We are thrilled to announce the launch of this campaign. Every donation, big or small, will go directly toward helping those who need it most. Thank you for believing in this cause.',
  },
]

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function CampaignUpdates({ updates }: CampaignUpdatesProps) {
  const items = updates ?? MOCK_UPDATES

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Bell size={40} />}
        title="No updates yet"
        description="The campaign creator hasn't posted any updates yet. Check back soon!"
      />
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {items.map((update, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5 ring-2 ring-emerald-100" />
            {i < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-emerald-200 mt-1 mb-0 min-h-[2rem]" />
            )}
          </div>

          {/* Content */}
          <div className={`pb-8 ${i === items.length - 1 ? 'pb-0' : ''}`}>
            <p className="text-xs text-slate-400 mb-1">{formatDate(update.date)}</p>
            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">{update.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{update.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}