"use client";
import React, { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/profile-card';
import { createClient } from '@/lib/client';

const Home = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id); // Exclude self
        if (fetchError) throw fetchError;
        setProfiles(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading users...</div>;
  if (error) return <div className="text-destructive text-center mt-8">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {profiles.map((profile: any) => (
        <ProfileCard
          key={profile.id}
          user={{
            id: profile.id,
            avatarUrl: profile.avatar || '/avatar.png',
            username: profile.handle || 'unknown',
            bio: profile.bio || '',
            height: profile.height || '',
            branch: profile.branch || '',
            interests: Array.isArray(profile.interests) ? profile.interests : (profile.interests ? profile.interests.split(',') : []),
          }}
        />
      ))}
    </div>
  );
};

export default Home;

