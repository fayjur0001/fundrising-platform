'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

import DashboardLayout from '@/components/layout/DashboardLayout'
import StepIndicator from '@/components/campaign/StepIndicator'
import CampaignForm from '@/components/campaign/CampaignForm'
import ImageUploadPreview from '@/components/campaign/ImageUploadPreview'
import { campaignApi } from '@/lib/api'
import type { Campaign } from '@/lib/mockData'

const STEPS = ['Basic Info', 'Story & Beneficiary', 'Media & Preview']

function normalizeDeadline(dateValue?: string) {
  if (!dateValue) return undefined
  const date = new Date(`${dateValue}T23:59:59.999`)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message
  return 'Something went wrong. Please try again.'
}

export default function CreateCampaignPage() {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState<Partial<Campaign>>({})
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [error, setError] = useState('')

  const previewImages = useMemo(() => formData.images ?? [], [formData.images])

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

  const uploadSelectedFiles = async (slug: string, files: File[]) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)

      const uploadRes = await campaignApi.uploadCover(slug, formData)
      if (!uploadRes.success) {
        throw new Error(uploadRes.message || 'Image upload failed')
      }
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    try {
      if (!formData.title || !formData.description || !formData.story || !formData.goalAmount || !formData.category || !formData.beneficiaryName || !formData.beneficiaryInfo || !formData.deadline) {
        setError('Please fill in all required fields.')
        return
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        story: formData.story,
        goalAmount: Number(formData.goalAmount),
        category: formData.category,
        beneficiaryName: formData.beneficiaryName,
        beneficiaryInfo: formData.beneficiaryInfo,
        deadline: normalizeDeadline(formData.deadline),
        images: [],
      }

      const res = await campaignApi.create(payload)

      if (!res.success) {
        setError(res.message || 'Campaign creation failed.')
        return
      }

      const createdCampaign = res.data as { slug: string }

      if (selectedFiles.length > 0) {
        await uploadSelectedFiles(createdCampaign.slug, selectedFiles)
      }

      setSubmitted(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout role="creator">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {!submitted && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create a Campaign</h1>
            <p className="text-slate-500 text-sm mt-1">
              Fill in the details below to launch your fundraiser.
            </p>
          </div>
        )}

        {submitted ? (
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
                  setSelectedFiles([])
                  setVisible(true)
                  setError('')
                }}
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 font-semibold text-sm transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <StepIndicator steps={STEPS} currentStep={currentStep} />
            </div>

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
                        initialImages={previewImages}
                        onChange={(images) => handleFormChange({ images })}
                        onFilesChange={setSelectedFiles}
                        maxFiles={5}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <div className="w-4 h-4 rounded-full bg-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
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