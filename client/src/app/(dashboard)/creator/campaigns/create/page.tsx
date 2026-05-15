// src/app/(dashboard)/creator/campaigns/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StepIndicator from '@/components/campaign/StepIndicator'
import CampaignForm from '@/components/campaign/CampaignForm'
import ImageUploadPreview from '@/components/campaign/ImageUploadPreview'
import type { Campaign } from '@/lib/mockData'
import { CheckCircle } from 'lucide-react'

const STEPS = ['Basic Info', 'Story & Beneficiary', 'Media & Preview']

export default function CreateCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData]       = useState<Partial<Campaign>>({})
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [visible, setVisible]         = useState(true)

  const handleFormChange = (data: Partial<Campaign>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const animateTransition = (cb: () => void) => {
    setVisible(false)
    setTimeout(() => {
      cb()
      setVisible(true)
    }, 180)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      animateTransition(() => setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3))
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      animateTransition(() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3))
    }
  }

  const handleSubmit = async () => {
  setSubmitting(true)
  try {
    const token = localStorage.getItem('accessToken')
    const res = await fetch('http://localhost:5000/api/v1/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        story: formData.story,
        goalAmount: formData.goalAmount,
        category: formData.category,
        beneficiaryName: formData.beneficiaryName,
        beneficiaryInfo: formData.beneficiaryInfo,
        deadline: formData.deadline,
        images: formData.images ?? [],
      }),
    })
    const data = await res.json()
    if (data.success) {
      setSubmitted(true)
    } else {
      alert(data.message)
    }
  } catch (err) {
    alert('Something went wrong. Please try again.')
  } finally {
    setSubmitting(false)
  }
}

  return (
    <DashboardLayout role="creator">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Page title */}
        {!submitted && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create a Campaign</h1>
            <p className="text-slate-500 text-sm mt-1">
              Fill in the details below to launch your fundraiser.
            </p>
          </div>
        )}

        {submitted ? (
          /* ── Success card ───────────────────────────────────── */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex flex-col items-center text-center gap-5">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Campaign Submitted for Review!
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                Our team will review your campaign within 24 hours. You&apos;ll receive
                a notification once it&apos;s approved and live.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => router.push('/creator/campaigns')}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
              >
                View My Campaigns
              </button>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setCurrentStep(1)
                  setFormData({})
                  setVisible(true)
                }}
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 font-semibold text-sm transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Step indicator ──────────────────────────────── */}
            <div className="mb-8">
              <StepIndicator steps={STEPS} currentStep={currentStep} />
            </div>

            {/* ── Step content (fade transition) ──────────────── */}
            <div
              className="transition-opacity duration-200"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-7 flex flex-col gap-6">

                {currentStep === 1 && (
                  <CampaignForm
                    step={1}
                    formData={formData}
                    onChange={handleFormChange}
                  />
                )}

                {currentStep === 2 && (
                  <CampaignForm
                    step={2}
                    formData={formData}
                    onChange={handleFormChange}
                  />
                )}

                {currentStep === 3 && (
                  <>
                    <CampaignForm
                      step={3}
                      formData={formData}
                      onChange={handleFormChange}
                    />
                    <div className="border-t border-gray-100 pt-6">
                      <p className="text-sm font-medium text-slate-700 mb-3">
                        Campaign Images
                      </p>
                      <ImageUploadPreview
                        images={formData.images ?? []}
                        onChange={(images) => handleFormChange({ images })}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Navigation buttons ──────────────────────────── */}
            <div className="flex items-center justify-between mt-6">
              {/* Back */}
              <div>
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 font-semibold text-sm transition-colors"
                  >
                    ← Back
                  </button>
                )}
              </div>

              {/* Step counter + Next/Submit */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">
                  Step {currentStep} of {STEPS.length}
                </span>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Submitting…
                      </>
                    ) : (
                      'Submit Campaign'
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}