'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CampaignDetailClient from '@/components/campaign/CampaignDetailClient'

export default function CampaignDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [campaign, setCampaign] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'
        // Campaign fetch
        const campaignRes = await fetch(`${BASE}/campaigns/${id}`)
        const campaignData = await campaignRes.json()

        if (!campaignData.success) {
          setNotFoundState(true)
          return
        }

        setCampaign(campaignData.data)

        // Comments fetch
        const commentsRes = await fetch(`${BASE}/comments/campaign/${id}`)
        const commentsData = await commentsRes.json()

        if (commentsData.success) {
          setComments(commentsData.data ?? [])
        }
      } catch (err) {
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>
  )

  if (notFoundState) return notFound()
  if (!campaign) return null

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