'use client'

import { useState, useCallback } from 'react'

type Step = 'address' | 'shipping' | 'payment' | 'confirmation'

export function useCheckout() {
  const [currentStep, setCurrentStep] = useState<Step>('address')
  const [isProcessing, setIsProcessing] = useState(false)

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      const steps: Step[] = ['address', 'shipping', 'payment', 'confirmation']
      const index = steps.indexOf(prev)
      return steps[Math.min(index + 1, steps.length - 1)]
    })
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => {
      const steps: Step[] = ['address', 'shipping', 'payment', 'confirmation']
      const index = steps.indexOf(prev)
      return steps[Math.max(index - 1, 0)]
    })
  }, [])

  const placeOrder = useCallback(async () => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCurrentStep('confirmation')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return { currentStep, isProcessing, nextStep, prevStep, placeOrder }
}
