'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import EditCampaignClient from '@/components/campaign/EditCampaignClient'

export default function EditCampaignPage() {
  const params = useParams()
  const id = params.id as string
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`http://localhost:5000/api/v1/campaigns/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (data.success) {
          setCampaign(data.data)
        } else {
          setNotFoundState(true)
        }
      } catch (err) {
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaign()
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>
  )

  if (notFoundState) return notFound()

  return <EditCampaignClient campaign={campaign} />
}