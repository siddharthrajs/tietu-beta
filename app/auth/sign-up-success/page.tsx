"use client" 

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/client'

export default function Page() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Retrieve email from localStorage
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('signup_email') : ''
    if (storedEmail) setEmail(storedEmail)
  }, [])

  const handleComplete = async (value: string) => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: value,
        type: 'email',
      })
      if (error) throw error
      // Remove email from localStorage after successful verification
      localStorage.removeItem('signup_email')
      router.push('/auth/onboarding')
    } catch (err: any) {
      setError('OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to confirm your account
                before signing in.
              </p>
            </CardContent>
          </Card>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleComplete}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {loading && <p className="text-sm text-muted-foreground">Verifying...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  )
}
