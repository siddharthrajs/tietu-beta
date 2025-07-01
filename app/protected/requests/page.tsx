"use client"
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Requests = () => {
  const [incoming, setIncoming] = useState<any[]>([])
  const [outgoing, setOutgoing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        // Fetch all pending connections where current user is involved
        const { data: connections, error: connError } = await supabase
          .from('connections')
          .select('*')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .eq('type', 'pending')
        if (connError) throw connError
        // Separate incoming and outgoing
        const incomingReqs = connections.filter((c: any) => c.user2_id === user.id)
        const outgoingReqs = connections.filter((c: any) => c.user1_id === user.id)
        // Fetch profiles for incoming
        const incomingUserIds = incomingReqs.map((c: any) => c.user1_id)
        const outgoingUserIds = outgoingReqs.map((c: any) => c.user2_id)
        let incomingProfiles: any[] = []
        let outgoingProfiles: any[] = []
        if (incomingUserIds.length > 0) {
          const { data } = await supabase.from('profiles').select('id, handle, name, avatar').in('id', incomingUserIds)
          incomingProfiles = data || []
        }
        if (outgoingUserIds.length > 0) {
          const { data } = await supabase.from('profiles').select('id, handle, name, avatar').in('id', outgoingUserIds)
          outgoingProfiles = data || []
        }
        // Attach profile info
        setIncoming(incomingReqs.map((req: any) => ({
          ...req,
          user: incomingProfiles.find((p) => p.id === req.user1_id)
        })))
        setOutgoing(outgoingReqs.map((req: any) => ({
          ...req,
          user: outgoingProfiles.find((p) => p.id === req.user2_id)
        })))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const handleAccept = async (id: string) => {
    const supabase = createClient()
    await supabase.from('connections').update({ type: 'accepted' }).eq('id', id)
    // Refresh
    window.location.reload()
  }
  const handleDecline = async (id: string) => {
    const supabase = createClient()
    await supabase.from('connections').update({ type: 'declined' }).eq('id', id)
    window.location.reload()
  }
  const handleCancel = async (id: string) => {
    const supabase = createClient()
    await supabase.from('connections').delete().eq('id', id)
    window.location.reload()
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading requests...</div>
  if (error) return <div className="text-destructive text-center mt-8">{error}</div>

  return (
    <div className="max-w-2xl mx-auto py-8 flex flex-col gap-10">
      <div>
        <h2 className="text-xl font-bold mb-4">Incoming Requests</h2>
        {incoming.length === 0 ? (
          <div className="text-muted-foreground">No incoming requests.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {incoming.map((req) => (
              <div key={req.id} className="flex items-center gap-4 bg-muted/40 rounded-lg p-4">
                <Avatar className="size-12">
                  <AvatarImage src={req.user?.avatar || '/avatar.png'} alt={req.user?.handle} />
                  <AvatarFallback>{req.user?.handle?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">@{req.user?.handle}</div>
                  <div className="text-sm text-muted-foreground">{req.user?.name}</div>
                </div>
                <Button onClick={() => handleAccept(req.id)} className="mr-2">Accept</Button>
                <Button variant="destructive" onClick={() => handleDecline(req.id)}>Decline</Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Outgoing Requests</h2>
        {outgoing.length === 0 ? (
          <div className="text-muted-foreground">No outgoing requests.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {outgoing.map((req) => (
              <div key={req.id} className="flex items-center gap-4 bg-muted/40 rounded-lg p-4">
                <Avatar className="size-12">
                  <AvatarImage src={req.user?.avatar || '/avatar.png'} alt={req.user?.handle} />
                  <AvatarFallback>{req.user?.handle?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">@{req.user?.handle}</div>
                  <div className="text-sm text-muted-foreground">{req.user?.name}</div>
                </div>
                <Button variant="ghost" onClick={() => handleCancel(req.id)}>Cancel</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Requests
