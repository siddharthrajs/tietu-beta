import React from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/client'
import { Calendar, Link as LinkIcon, CheckCircle2 } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', params.handle)
    .single()

  if (!profile) return notFound()

  // Placeholder banner
  const bannerUrl = '/banner-default.jpg' // Place a default banner image in your public folder

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Banner */}
      <div className="relative h-48 w-full bg-muted">
        <img
          src={bannerUrl}
          alt="Banner"
          className="object-cover w-full h-full rounded-b-xl"
        />
        {/* Avatar - overlaps banner */}
        <div className="absolute left-8 -bottom-16 z-10">
          <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
            <AvatarImage src={profile.avatar || '/avatar.png'} alt={profile.name || profile.handle} />
            <AvatarFallback>{profile.name ? profile.name[0] : 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      {/* Main Card */}
      <Card className="max-w-2xl mx-auto mt-0 pt-20 pb-8 px-8 bg-background/90 border-none shadow-none">
        {/* Username, handle, verified, edit/connect */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold leading-tight">{profile.name || profile.handle}</span>
              {/* Verified badge example */}
              {profile.is_verified && (
                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Verfied TIET Student
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground text-base font-mono">@{profile.handle}</div>
          </div>
          {/* Placeholder for Edit/Connect button */}
          <Button variant="outline" className="rounded-full px-5">Edit profile</Button>
        </div>
        {/* Bio */}
        {profile.bio && (
          <div className="mt-4 text-base whitespace-pre-line">{profile.bio}</div>
        )}
        {/* Website, join date, etc. */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground text-sm">
          {/* Placeholder website */}
          <div className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4" />
            <a href="#" className="hover:underline">yourwebsite.com</a>
          </div>
          {/* Join date */}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Joined {profile.created_at ? new Date(profile.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'sometime'}
          </div>
        </div>
        {/* Separator */}
        <Separator className="my-4" />
        {/* Stats (placeholders) */}
        <div className="flex gap-6 text-base">
          <span><span className="font-bold">105</span> Following</span>
          <span><span className="font-bold">26</span> Followers</span>
        </div>
      </Card>
    </div>
  )
}
