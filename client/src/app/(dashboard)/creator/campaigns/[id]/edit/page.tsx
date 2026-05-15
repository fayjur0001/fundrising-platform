// src/app/(dashboard)/creator/campaigns/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { mockCampaigns } from '@/lib/mockData'
import EditCampaignClient from '@/components/campaign/EditCampaignClient'

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const campaign = mockCampaigns.find((c) => c.id === params.id)
  if (!campaign) notFound()

  return <EditCampaignClient campaign={campaign} />
}