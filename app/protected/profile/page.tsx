"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Pencil, CheckCircle2, User2, Heart, Users, Eye, Lock, Edit3 } from 'lucide-react'
import { createClient } from '@/lib/client'

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

const Profile = () => {
  const [profile, setProfile] = useState<any>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
        if (profileError) throw profileError
        if (!data) {
          setProfile({ ...defaultProfile, email: user.email, handle: '', name: '' })
        } else {
          setProfile({ ...defaultProfile, ...data })
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev: any) => ({ ...prev, interests: e.target.value.split(',').map((i) => i.trim()) }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const email = user.email ?? '';
      const updateData = { ...profile, id: user.id, email, is_verified: email.endsWith('@thapar.edu') }
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(updateData)
      if (updateError) throw updateError
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>
  if (error) return <div className="text-destructive text-center mt-8">{error}</div>

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 py-8 relative">
      {/* Top Section */}
      <Card className="p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="size-28">
            <AvatarImage src={profile.avatar || '/avatar.png'} alt={profile.handle} />
            <AvatarFallback>{profile.handle?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex items-center gap-2 w-full justify-center">
            <span className="text-2xl font-bold">{profile.name}</span>
            {profile.is_verified && (
              <span title="Verified @thapar.edu">
                <CheckCircle2 className="text-primary size-5" />
              </span>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full justify-center items-center mt-2">
            <span className="text-muted-foreground">@{profile.handle}</span>
            <span className="text-sm text-muted-foreground">{profile.email}</span>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full justify-center items-center mt-2">
            <span className="text-sm text-muted-foreground">{profile.branch}</span>
            <span className="text-sm text-muted-foreground">{profile.year}</span>
            <span className="text-xs text-muted-foreground">{profile.gender}</span>
          </div>
        </div>
      </Card>

      {/* Editable Profile Fields */}
      <Card className="p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Name</label>
            <Input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">@Handle</label>
            <Input
              type="text"
              name="handle"
              value={profile.handle}
              onChange={handleChange}
              placeholder="@handle"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Email</label>
            <Input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Email"
              disabled
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Avatar URL</label>
            <Input
              type="text"
              name="avatar"
              value={profile.avatar}
              onChange={handleChange}
              placeholder="Avatar URL"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Branch</label>
            <select
              name="branch"
              value={profile.branch}
              onChange={handleSelectChange}
              className="border rounded px-2 py-1"
            >
              <option value="">Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EE">EE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="CHE">CHE</option>
              <option value="BT">BT</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Year</label>
            <select
              name="year"
              value={profile.year}
              onChange={handleSelectChange}
              className="border rounded px-2 py-1"
            >
              <option value="">Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleSelectChange}
              className="border rounded px-2 py-1"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Bio</label>
          <Textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            maxLength={200}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Emoji supported</span>
            <span>{profile.bio.length}/200</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Interests</label>
          <Input
            name="interests"
            value={profile.interests?.join(', ') || ''}
            onChange={handleInterestsChange}
            placeholder="e.g. Coding, Music, AI"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.interests?.length > 0 ? profile.interests.slice(0, 10).map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary">#{tag}</Badge>
            )) : <span className="text-muted-foreground">No interests added.</span>}
          </div>
        </div>
      </Card>
      {/* Save Button at bottom right */}
      <div className="flex justify-end sticky bottom-4 z-10 mt-4">
        <Button onClick={handleSave} disabled={saving} className="w-40">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

export default Profile
