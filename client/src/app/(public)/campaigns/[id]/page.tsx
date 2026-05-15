// src/app/(public)/campaigns/[id]/page.tsx
import { notFound } from 'next/navigation'
import { mockCampaigns, mockComments } from '@/lib/mockData'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CampaignDetailClient from '@/components/campaign/CampaignDetailClient'

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = mockCampaigns.find((c) => c.id === params.id)
  if (!campaign) notFound()

  const comments  = mockComments.filter((c) => c.campaignId === campaign.id)

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <CampaignDetailClient
          campaign={campaign}
          comments={comments}
        />
      </main>
      <Footer />
    </>
  )
}