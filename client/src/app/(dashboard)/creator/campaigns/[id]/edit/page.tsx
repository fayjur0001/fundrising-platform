'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'

import EditCampaignClient from '@/components/campaign/EditCampaignClient'
import { campaignApi } from '@/lib/api'
import type { Campaign } from '@/lib/api'

export default function EditCampaignPage() {
  const params = useParams()
  // URL param নাম 'id' কিন্তু value-টা slug — getBySlug দিয়েই fetch করো
  const slug = params.id as string

  const [campaign, setCampaign]   = useState<Campaign | null>(null)
  const [loading, setLoading]     = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await campaignApi.getBySlug(slug)

        if (res.success && res.data) {
          setCampaign(res.data)
        } else {
          setNotFoundState(true)
        }
      } catch {
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (notFoundState || !campaign) return notFound()

  return <EditCampaignClient campaign={campaign} />
}