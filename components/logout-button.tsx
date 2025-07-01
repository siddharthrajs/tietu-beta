'use client'

import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <Button onClick={logout} variant="ghost" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold w-full justify-start" asChild>
      <span>
        <LogOut className="size-6 inline-block mr-2" />
      </span>
    </Button>
  )
}
