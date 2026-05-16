// src/components/campaign/CampaignForm.tsx
'use client'

import React from 'react'
import type { Campaign } from '@/lib/mockData'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Select from '@/components/ui/select'

interface CampaignFormProps {
  step: 1 | 2 | 3
  formData: Partial<Campaign>
  onChange: (data: Partial<Campaign>) => void
}

const CATEGORIES = [
  { label: 'Education', value: 'Education' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Disaster Relief', value: 'Disaster Relief' },
  { label: 'Environment', value: 'Environment' },
  { label: 'Animal Welfare', value: 'Animal Welfare' },
  { label: 'Community', value: 'Community' },
  { label: 'Poverty', value: 'Poverty' },
  { label: 'Arts', value: 'Arts' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Other', value: 'Other' },
]

export default function CampaignForm({ step, formData, onChange }: CampaignFormProps) {
  function handleChange(field: keyof Campaign, value: string | number) {
    onChange({ ...formData, [field]: value })
  }

  if (step === 1) {
    return (
      <div className="flex flex-col gap-5">
        <Input
          label="Campaign Title"
          placeholder="E.g. Flood Relief for Sylhet"
          value={formData.title ?? ''}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
        <Select
          label="Category"
          options={CATEGORIES}
          value={formData.category ?? ''}
          onChange={(e) => handleChange('category', e.target.value)}
          placeholder="Select a category"
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">
            Fundraising Goal <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">৳</span>
            <input
              type="number"
              min={1000}
              placeholder="500000"
              value={formData.goalAmount ?? ''}
              onChange={(e) => handleChange('goalAmount', Number(e.target.value))}
              className="border border-gray-200 rounded-lg pl-7 pr-3 py-2 w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        <Input
          label="Campaign Deadline"
          type="date"
          value={formData.deadline ? formData.deadline.split('T')[0] : ''}
          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
          onChange={(e) => handleChange('deadline', e.target.value)}
          required
        />
      </div>
    )
  }

  if (step === 2) {
    const descLen = (formData.description ?? '').length
    const storyLen = (formData.story ?? '').length
    const benefInfoLen = (formData.beneficiaryInfo ?? '').length

    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Textarea
            label="Short Description"
            placeholder="A brief summary of your campaign (1–2 sentences)"
            value={formData.description ?? ''}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            required
          />
          <p className={`text-xs mt-0.5 ${descLen < 20 ? 'text-red-500' : 'text-slate-400'}`}>
            {descLen}/20 minimum characters
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Textarea
            label="Your Story"
            placeholder="Tell your story in detail — why this campaign matters, who it helps, and how funds will be used."
            value={formData.story ?? ''}
            onChange={(e) => handleChange('story', e.target.value)}
            rows={7}
            required
          />
          <p className={`text-xs mt-0.5 ${storyLen < 50 ? 'text-red-500' : 'text-slate-400'}`}>
            {storyLen}/50 minimum characters
          </p>
        </div>
        <Input
          label="Beneficiary Name"
          placeholder="E.g. Flood victims of Sylhet"
          value={formData.beneficiaryName ?? ''}
          onChange={(e) => handleChange('beneficiaryName', e.target.value)}
          required
        />
        <div className="flex flex-col gap-1">
          <Textarea
            label="Beneficiary Information"
            placeholder="Describe who will benefit from this campaign"
            value={formData.beneficiaryInfo ?? ''}
            onChange={(e) => handleChange('beneficiaryInfo', e.target.value)}
            rows={3}
            required
          />
          <p className={`text-xs mt-0.5 ${benefInfoLen < 10 ? 'text-red-500' : 'text-slate-400'}`}>
            {benefInfoLen}/10 minimum characters
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500 bg-gray-50 border border-gray-200 rounded-lg p-4">
        Upload images in Step 3 — use ImageUploadPreview component below.
      </p>
    </div>
  )
}