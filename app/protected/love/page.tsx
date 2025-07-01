"use client"
import React, { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/profile-card';
import { createClient } from '@/lib/client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Love = () => {
  const [profiles, setProfiles] = useState<unknown[]>([]);
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all');

  useEffect(() => {
    const fetchProfiles = async () => {
      const supabase = createClient();
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', (await supabase.auth.getUser()).data.user?.id); // Exclude self
      if (gender !== 'all') {
        query = query.eq('gender', gender);
      }
      const { data } = await query;
      if (data) setProfiles(data);
    };
    fetchProfiles();
  }, [gender]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 justify-center">
        <Label htmlFor="gender-switch">Show only Female</Label>
        <Switch
          id="gender-switch"
          checked={gender === 'female'}
          onCheckedChange={(checked) => setGender(checked ? 'female' : 'all')}
        />
        <Label htmlFor="gender-switch">Show only Male</Label>
        <Switch
          id="gender-switch-male"
          checked={gender === 'male'}
          onCheckedChange={(checked) => setGender(checked ? 'male' : 'all')}
        />
        <Button size="sm" variant="outline" onClick={() => setGender('all')} disabled={gender === 'all'}>
          Show All
        </Button>
      </div>
      <div className="flex flex-wrap gap-6 p-6 justify-center">
        {profiles.map((profile: unknown, idx: number) => (
          <ProfileCard
            key={profile.id || idx}
            user={{
              id: profile.id,
              avatarUrl: profile.avatar || '/avatar.png',
              username: profile.handle || 'unknown',
              bio: profile.bio || '',
              height: profile.height || '',
              branch: profile.branch || '',
              interests: profile.interests ? (Array.isArray(profile.interests) ? profile.interests : profile.interests.split(',')) : [],
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Love;
