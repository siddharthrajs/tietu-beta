"use client"

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Pencil, CheckCircle2, User2, Heart, Users, Eye, Lock, Edit3 } from 'lucide-react'

const mockProfile = {
  avatarUrl: '/avatar.png',
  username: 'siddharth',
  isVerified: true,
  handle: '@siddharth',
  year: '3rd Year',
  branch: 'CSE',
  gender: 'Male',
  height: '180cm',
  bio: 'I love building cool stuff! 🚀 Let\'s connect and create something awesome together.',
  bioPublic: true,
  interests: ['Anime', 'AI', 'Startups', 'Coding', 'Music', 'Travel', 'Chess', 'Photography', 'Gaming', 'Reading'],
  preferences: {
    lookingFor: ['❤️', '🤝'],
    genderPref: 'Any',
    sameBranch: false,
    sameYear: false,
  },
  stats: {
    connections: 8,
    likesSent: 24,
    likesReceived: 42,
    collabs: 3,
    views: 120,
  },
  privacy: {
    email: false,
    phone: false,
    height: true,
    bio: true,
    visibility: 'Public',
  },
}

const Profile = () => {
  const [bio, setBio] = useState(mockProfile.bio)
  const [bioPublic, setBioPublic] = useState(mockProfile.bioPublic)
  const [interests, setInterests] = useState(mockProfile.interests)
  const [privacy, setPrivacy] = useState(mockProfile.privacy)
  const [isOwnProfile] = useState(true) // toggle for demo

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 py-8">
      {/* Top Section */}
      <Card className="p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="size-28">
            <AvatarImage src={mockProfile.avatarUrl} alt={mockProfile.username} />
            <AvatarFallback>{mockProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {isOwnProfile && (
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-md">
              <Pencil className="size-5" />
            </Button>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{mockProfile.username}</span>
            {mockProfile.isVerified && (
              <CheckCircle2 className="text-primary size-5" />
            )}
          </div>
          <span className="text-muted-foreground">{mockProfile.handle}</span>
          <span className="text-sm text-muted-foreground">{mockProfile.year}, {mockProfile.branch}</span>
          <div className="flex gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{mockProfile.gender}</span>
            {privacy.height && <span className="text-xs text-muted-foreground">• {mockProfile.height}</span>}
          </div>
        </div>
        {isOwnProfile && (
          <Button variant="outline" className="mt-2"><Edit3 className="size-4 mr-2" /> Edit Profile</Button>
        )}
      </Card>

      {/* Bio Section */}
      <Card className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <CardTitle>Bio</CardTitle>
          <div className="flex items-center gap-2">
            <Switch checked={bioPublic} onCheckedChange={setBioPublic} />
            <span className="text-xs text-muted-foreground">{bioPublic ? 'Public' : 'Private'}</span>
          </div>
        </div>
        <Textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={200}
          rows={3}
          className="resize-none"
          disabled={!isOwnProfile}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Emoji supported</span>
          <span>{bio.length}/200</span>
        </div>
      </Card>

      {/* Interests Section */}
      <Card className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <CardTitle>Interests</CardTitle>
          {isOwnProfile && <Button size="sm" variant="secondary">Edit</Button>}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {interests.slice(0, 10).map((tag, idx) => (
            <Badge key={idx} variant="secondary">#{tag}</Badge>
          ))}
        </div>
      </Card>

      {/* Connection Preferences */}
      <Card className="p-6 flex flex-col gap-4">
        <CardTitle>Connection Preferences</CardTitle>
        <div className="flex gap-4 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1 text-base">
            <Heart className="size-4 text-pink-500" /> Looking for Love
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-base">
            <Users className="size-4 text-blue-500" /> Collaborate
          </Badge>
        </div>
        <div className="flex gap-6 flex-wrap mt-2">
          <span className="text-sm">Gender Preference: <b>{mockProfile.preferences.genderPref}</b></span>
          <span className="text-sm">Same Branch: <b>{mockProfile.preferences.sameBranch ? 'Yes' : 'No'}</b></span>
          <span className="text-sm">Same Year: <b>{mockProfile.preferences.sameYear ? 'Yes' : 'No'}</b></span>
        </div>
      </Card>

      {/* Activity Stats */}
      <Card className="p-6 flex flex-col gap-3">
        <CardTitle>Activity Stats</CardTitle>
        <div className="flex gap-6 flex-wrap mt-2">
          <span className="flex items-center gap-2"><User2 className="size-4" /> Connections: <b>{mockProfile.stats.connections}</b></span>
          <span className="flex items-center gap-2"><Heart className="size-4" /> Likes Sent: <b>{mockProfile.stats.likesSent}</b></span>
          <span className="flex items-center gap-2"><Heart className="size-4 text-pink-500" /> Likes Received: <b>{mockProfile.stats.likesReceived}</b></span>
          <span className="flex items-center gap-2"><Users className="size-4" /> Collabs: <b>{mockProfile.stats.collabs}</b></span>
          <span className="flex items-center gap-2"><Eye className="size-4" /> Profile Views: <b>{mockProfile.stats.views}</b></span>
        </div>
      </Card>

      {/* Privacy Controls */}
      <Card className="p-6 flex flex-col gap-3">
        <CardTitle>Privacy Controls</CardTitle>
        <div className="flex flex-wrap gap-6 mt-2">
          <div className="flex items-center gap-2">
            <Switch checked={privacy.email} onCheckedChange={v => setPrivacy(p => ({ ...p, email: v }))} />
            <span className="text-sm">Show Email</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={privacy.phone} onCheckedChange={v => setPrivacy(p => ({ ...p, phone: v }))} />
            <span className="text-sm">Show Phone</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={privacy.height} onCheckedChange={v => setPrivacy(p => ({ ...p, height: v }))} />
            <span className="text-sm">Show Height</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={privacy.bio} onCheckedChange={v => setPrivacy(p => ({ ...p, bio: v }))} />
            <span className="text-sm">Show Bio</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm">Visibility:</span>
          <select
            className="border rounded px-2 py-1 bg-background text-foreground"
            value={privacy.visibility}
            onChange={e => setPrivacy(p => ({ ...p, visibility: e.target.value }))}
          >
            <option value="Public">Public</option>
            <option value="College Only">College Only</option>
            <option value="Private">Private</option>
          </select>
        </div>
      </Card>

      {/* Connected Projects/Dates (Optional) */}
      <Card className="p-6 flex flex-col gap-3">
        <CardTitle>Connected Projects / Dates</CardTitle>
        <div className="flex gap-4 flex-wrap mt-2">
          <Card className="min-w-[160px] p-3 flex flex-col items-center gap-2 bg-muted/70">
            <CardTitle className="text-base">Dinner Date</CardTitle>
            <CardDescription>❤️ 2nd July, 7PM</CardDescription>
          </Card>
          <Card className="min-w-[160px] p-3 flex flex-col items-center gap-2 bg-muted/70">
            <CardTitle className="text-base">Hackathon</CardTitle>
            <CardDescription>🤝 Ongoing</CardDescription>
          </Card>
        </div>
      </Card>
    </div>
  )
}

export default Profile
