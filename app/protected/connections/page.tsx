"use client"
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Connections = () => {
  const [connections, setConnections] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        // Fetch all accepted connections where current user is involved
        const { data: conns, error: connError } = await supabase
          .from('connections')
          .select('*')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .eq('type', 'accepted')
        if (connError) throw connError
        // Get the other user ids
        const otherUserIds = conns.map((c: unknown) => {
          if (typeof c === 'object' && c !== null && 'user1_id' in c && 'user2_id' in c) {
            // @ts-ignore
            return c.user1_id === user.id ? c.user2_id : c.user1_id;
          }
          return null;
        });
        let profiles: unknown[] = []
        if (otherUserIds.length > 0) {
          const { data } = await supabase.from('profiles').select('id, handle, name, avatar').in('id', otherUserIds)
          profiles = data || []
        }
        // Attach profile info
        setConnections(conns.map((conn: unknown) => ({
          ...conn,
          user: profiles.find((p) => p.id === (conn.user1_id === user.id ? conn.user2_id : conn.user1_id))
        })))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchConnections()
  }, [])

  const handleDisconnect = async (id: string) => {
    const supabase = createClient()
    await supabase.from('connections').delete().eq('id', id)
    window.location.reload()
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading connections...</div>
  if (error) return <div className="text-destructive text-center mt-8">{error}</div>

  return (
    <div className="max-w-2xl mx-auto py-8 flex flex-col gap-8">
      <h2 className="text-xl font-bold mb-4">My Connections</h2>
      {connections.length === 0 ? (
        <div className="text-muted-foreground">No connections yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {connections.map((conn: unknown, idx: number) => (
            <div key={conn.id} className="flex items-center gap-4 bg-muted/40 rounded-lg p-4 cursor-pointer hover:bg-muted" onClick={() => router.push(`/protected/profile/${conn.user?.handle}`)}>
              <Avatar className="size-12">
                <AvatarImage src={conn.user?.avatar || '/avatar.png'} alt={conn.user?.handle} />
                <AvatarFallback>{conn.user?.handle?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">@{conn.user?.handle}</div>
                <div className="text-sm text-muted-foreground">{conn.user?.name}</div>
              </div>
              <Button variant="destructive" onClick={e => { e.stopPropagation(); handleDisconnect(conn.id); }}>Disconnect</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Connections 