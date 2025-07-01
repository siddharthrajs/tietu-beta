"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/client'
import { CheckCircle2, Globe } from 'lucide-react'
import RightSidebar from '@/components/RightSidebar'

const defaultProfile = {
  avatar: '/avatar.png',
  handle: '',
  name: '',
  email: '',
  branch: '',
  year: '',
  gender: '',
  bio: '',
  interests: [],
  is_verified: false,
}

const ProfilePage = () => {
  const { handle } = useParams() as { handle: string }
  const [profile, setProfile] = useState<any>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('handle', handle)
          .maybeSingle()
        if (profileError) throw profileError
        if (!data) {
          setError('Profile not found')
        } else {
          setProfile({ ...defaultProfile, ...data })
          setIsOwnProfile(!!user && user.id === data.id)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (handle) fetchProfile()
  }, [handle])

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>
  if (error) return <div className="text-destructive text-center mt-8">{error}</div>

  return (
    <div className="flex flex-row justify-center w-full min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center">
        <div className="max-w-2xl w-full flex flex-col gap-0 pb-8 relative">
          {/* Banner */}
          <div className="relative h-40 w-full bg-gradient-to-tr from-primary/80 to-secondary/80 rounded-b-2xl overflow-hidden">
            {/* Optionally, use a user banner image here */}
          </div>
          {/* Avatar - overlaps banner */}
          <div className="relative flex justify-between items-end px-6 -mt-16 z-10">
            <div className="flex items-end gap-4">
              <Avatar className="size-32 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar || '/avatar.png'} alt={profile.handle} />
                <AvatarFallback>{profile.handle?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold leading-tight">{profile.name}</span>
                  {profile.is_verified && (
                    <span title="Verified @thapar.edu">
                      <CheckCircle2 className="text-primary size-5" />
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground">@{profile.handle}</span>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2 mb-4">
                <Button variant="outline">Edit profile</Button>
                <Button variant="ghost">Settings</Button>
              </div>
            )}
          </div>
          {/* Info Section */}
          <div className="px-6 mt-4 flex flex-col gap-2">
            <div className="text-base text-foreground whitespace-pre-line">{profile.bio}</div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
              {profile.branch && <span>{profile.branch}</span>}
              {profile.year && <span>{profile.year}</span>}
              {profile.gender && <span>{profile.gender}</span>}
              {profile.email && <span>{profile.email}</span>}
            </div>
            {/* Website and join date */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1 items-center">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                  <Globe className="size-4" />
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {profile.created_at && (
                <span>Joined {new Date(profile.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              )}
            </div>
            {/* Interests */}
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.interests?.length > 0 ? profile.interests.slice(0, 10).map((tag: string, idx: number) => (
                <Badge key={idx} variant="secondary">#{tag}</Badge>
              )) : <span className="text-muted-foreground">No interests added.</span>}
            </div>
          </div>
          {/* Stats Row */}
          <div className="flex gap-8 px-6 mt-4 text-sm">
            <span><span className="font-bold">0</span> Following</span>
            <span><span className="font-bold">0</span> Followers</span>
            <span><span className="font-bold">0</span> Posts</span>
          </div>
          {/* Tabs Row */}
          <div className="flex gap-8 px-6 mt-6 border-b border-muted-foreground/20">
            <button className="py-2 font-semibold border-b-2 border-primary text-primary">Posts</button>
            <button className="py-2 text-muted-foreground">Replies</button>
            <button className="py-2 text-muted-foreground">Highlights</button>
            <button className="py-2 text-muted-foreground">Media</button>
            <button className="py-2 text-muted-foreground">Likes</button>
          </div>
          {/* Posts Placeholder */}
          <div className="px-6 mt-8 text-center text-muted-foreground">No posts yet.</div>
        </div>
      </div>
      <RightSidebar />
    </div>
  )
}

export default ProfilePage 