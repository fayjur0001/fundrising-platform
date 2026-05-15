// src/components/campaign/CampaignSidebar.tsx
'use client'

import React, { useState } from 'react'
import type { Campaign } from '@/lib/mockData'
import { formatBDT, daysLeft } from '@/lib/utils'
import ProgressBar from './ProgressBar'
import Button from '@/components/ui/button'
import Toast from '@/components/ui/toast'
import { Users, Clock, AlertCircle } from 'lucide-react'

interface CampaignSidebarProps {
  campaign: Campaign
}

const PRESETS = [100, 500, 1000, 5000]

export default function CampaignSidebar({ campaign }: CampaignSidebarProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(500)
  const [customAmount, setCustomAmount] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const remaining = daysLeft(campaign.deadline)
  const isActive = campaign.status === 'active'

  const effectiveAmount = selectedPreset !== null ? selectedPreset : Number(customAmount)

  function handlePresetClick(amount: number) {
    setSelectedPreset(amount)
    setCustomAmount('')
  }

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedPreset(null)
    setCustomAmount(e.target.value)
  }

  async function handleDonate() {
    if (!isActive || !effectiveAmount) return
    setIsLoading(true)
    await new Promise((res) => setTimeout(res, 1000))
    console.log('Donation:', { amount: effectiveAmount, isAnonymous, message, campaignId: campaign.id })
    setIsLoading(false)
    setShowToast(true)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5 sticky top-24">
      {/* Progress */}
      <div>
        <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} size="lg" />
        <div className="mt-3">
          <p className="text-2xl font-bold text-slate-900">
            {formatBDT(campaign.raisedAmount)}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">
            raised of {formatBDT(campaign.goalAmount)} goal
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <Users size={15} className="text-emerald-600" />
          <span className="font-medium">{campaign.donorCount}</span> donors
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={15} className="text-emerald-600" />
          <span className="font-medium">{remaining > 0 ? remaining : 0}</span> days left
        </span>
      </div>

      <hr className="border-gray-200" />

      {/* Donation form */}
      {!isActive ? (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 font-medium">
            This campaign is not accepting donations at this time.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-semibold text-slate-900">Make a Donation</h3>

          {/* Preset grid */}
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetClick(amount)}
                className={`
                  py-2.5 rounded-lg text-sm font-semibold border transition-all
                  ${selectedPreset === amount
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-gray-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50'}
                `}
              >
                {formatBDT(amount)}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">৳</span>
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={handleCustomChange}
              min={1}
              className={`
                w-full border rounded-lg pl-7 pr-3 py-2.5 text-sm text-slate-900
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors
                ${selectedPreset === null && customAmount ? 'border-emerald-500' : 'border-gray-200'}
              `}
            />
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Donate anonymously</span>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`
                relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                ${isAnonymous ? 'bg-emerald-600' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                  ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message of support..."
            rows={3}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-colors"
          />
        </div>
      )}

      {/* Donate button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        disabled={!isActive || (!selectedPreset && !customAmount)}
        onClick={handleDonate}
      >
        Donate Now
      </Button>

      {/* Toast */}
      {showToast && (
        <Toast
          type="success"
          message="Thank you for your donation!"
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  )
}