// src/components/campaign/StepIndicator.tsx
import React from 'react'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  steps: string[]
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-between w-full">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isCurrent = stepNum === currentStep

        return (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              {/* Circle */}
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                  ${isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-white border-emerald-600 text-emerald-600 ring-4 ring-emerald-100'
                    : 'bg-white border-gray-300 text-gray-400'}
                `}
              >
                {isCompleted ? <Check size={16} strokeWidth={2.5} /> : stepNum}
              </div>
              {/* Label */}
              <span
                className={`text-xs font-medium text-center max-w-[80px] leading-tight ${
                  isCurrent ? 'text-emerald-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mt-4 mx-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stepNum < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}