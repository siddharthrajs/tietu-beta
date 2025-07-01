"use client"

import React, { useEffect, useState } from 'react'
import { RealtimeChat } from '@/components/realtime-chat'
import { createClient } from '@/lib/client'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface ConnectedUser {
  id: string
  handle: string
  avatar: string
}

const Messages = () => {
  const [username, setUsername] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ConnectedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        setUserId(user.id)
        // Get own profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('handle')
          .eq('id', user.id)
          .single()
        if (profileError) throw profileError
        setUsername(profile?.handle || user.email)
        // Get all accepted connections
        const { data: connections, error: connError } = await supabase
          .from('connections')
          .select('*')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .eq('type', 'accepted')
        if (connError) throw connError
        // Get the IDs of connected users
        const otherUserIds = connections.map((conn: any) =>
          conn.user1_id === user.id ? conn.user2_id : conn.user1_id
        )
        if (otherUserIds.length === 0) {
          setConnectedUsers([])
          setSelectedUser(null)
          setLoading(false)
          return
        }
        // Fetch their profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, handle, avatar')
          .in('id', otherUserIds)
        if (profilesError) throw profilesError
        setConnectedUsers(profiles)
        setSelectedUser(profiles[0] || null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchConnections()
  }, [])

  const getRoomName = (id1: string, id2: string) => {
    return ['chat', ...[id1, id2].sort()].join('_')
  }

  if (loading) return <div>Loading chat...</div>
  if (error) return <div>Error: {error}</div>
  if (!username || !userId) return <div>No username found.</div>

  return (
    <div className="flex h-[80vh] w-full max-w-4xl mx-auto border rounded-lg overflow-hidden shadow-lg">
      {/* Sidebar with connected users */}
      <aside className="w-64 bg-muted/40 border-r flex flex-col">
        <div className="p-4 font-bold text-lg border-b">Chats</div>
        <div className="flex-1 overflow-y-auto">
          {connectedUsers.length === 0 ? (
            <div className="p-4 text-muted-foreground text-sm">No connections yet.</div>
          ) : (
            connectedUsers.map((user) => (
              <button
                key={user.id}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left ${selectedUser?.id === user.id ? 'bg-muted font-semibold' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <Avatar className="size-10">
                  <AvatarImage src={user.avatar || '/avatar.png'} alt={user.handle} />
                  <AvatarFallback>{user.handle?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <span>@{user.handle}</span>
              </button>
            ))
          )}
        </div>
      </aside>
      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b font-semibold flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src={selectedUser.avatar || '/avatar.png'} alt={selectedUser.handle} />
                <AvatarFallback>{selectedUser.handle?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <span>@{selectedUser.handle}</span>
            </div>
            <div className="flex-1">
              <RealtimeChat
                roomName={getRoomName(userId, selectedUser.id)}
                username={username}
                userId={userId}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a user to start chatting.</div>
        )}
      </main>
    </div>
  )
}

export default Messages
