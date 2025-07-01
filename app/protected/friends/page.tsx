"use client";
import React, { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/profile-card';
import { createClient } from '@/lib/client';

const Friends = () => {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', (await supabase.auth.getUser()).data.user?.id); // Exclude self
      if (data) setProfiles(data);
    };
    fetchProfiles();
  }, []);

  return (
    <div className="flex flex-wrap gap-6 p-6 justify-center">
      {profiles.map((profile: any, idx: number) => (
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
  );
};

export default Friends;

