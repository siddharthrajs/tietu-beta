'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/client'

interface RealtimeChatProps {
  roomName: string
  username: string
  userId?: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

// Message type based on @/tables/messages.txt
interface Message {
  id: string;
  room: string;
  sender_id: string | null;
  content: string;
  created_at: string;
  sender_name: string | null;
}

/**
 * Realtime chat component
 * @param roomName - The name of the room to join. Each room is a unique chat.
 * @param username - The username of the user
 * @param userId - The userId for persistence
 * @param onMessage - The callback function to handle the messages. Useful if you want to store the messages in a database.
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomName,
  username,
  userId,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const supabase = createClient()

  const {
    messages: realtimeMessages,
    sendMessage: sendRealtimeMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  const [newMessage, setNewMessage] = useState('')

  // Fetch message history from Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room', roomName)
        .order('created_at', { ascending: true })
      if (!error && data) {
        setHistory(
          data.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            user: { name: msg.sender_name || 'Unknown' },
            createdAt: msg.created_at,
          }))
        )
      }
      setLoadingHistory(false)
    }
    fetchHistory()
  }, [roomName])

  // Merge history, initialMessages, and realtimeMessages
  const allMessages = useMemo(() => {
    const mergedMessages = [...history, ...initialMessages, ...realtimeMessages]
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    return sortedMessages
  }, [history, initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  // Persist message to Supabase
  const persistMessage = async (msg: ChatMessage) => {
    if (!userId) return
    await supabase.from('messages').insert({
      id: msg.id,
      room: roomName,
      sender_id: userId,
      sender_name: msg.user.name,
      content: msg.content,
      created_at: msg.createdAt,
    })
  }

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        content: newMessage,
        user: { name: username },
        createdAt: new Date().toISOString(),
      }
      sendRealtimeMessage(newMessage)
      setNewMessage('')
      await persistMessage(msg)
    },
    [newMessage, isConnected, sendRealtimeMessage, username, userId, roomName]
  )

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingHistory ? (
          <div className="text-center text-sm text-muted-foreground">Loading messages...</div>
        ) : allMessages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : null}
        <div className="space-y-1">
          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showHeader = !prevMessage || prevMessage.user.name !== message.user.name
            return (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.user.name === username}
                  showHeader={showHeader}
                />
              </div>
            )
          })}
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="flex w-full gap-2 border-t border-border p-4">
        <Input
          className={cn(
            'rounded-full bg-background text-sm transition-all duration-300',
            isConnected && newMessage.trim() ? 'w-[calc(100%-36px)]' : 'w-full'
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        {isConnected && newMessage.trim() && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
            disabled={!isConnected}
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
