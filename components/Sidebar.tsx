"use client"
import React from 'react'
import { LogoutButton } from './logout-button'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Home, Heart, Users, User, LogOut, Plus, UserPlus, Mail, Link2, MessageCircle } from 'lucide-react'
import { ModeToggle } from './theme-toggle'
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/client';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', icon: Home, href: '/protected/home' },
  { label: 'Love', icon: Heart, href: '/protected/love' },
  { label: 'Collaborate', icon: Users, href: '/protected/friends' },
  { label: 'Requests', icon: Mail, href: '/protected/requests' },
  { label: 'Messages', icon: MessageCircle, href: '/protected/messages' },
  { label: 'Connections', icon: Link2, href: '/protected/connections' },
  { label: 'Profile', icon: User, href: '/protected/profile' },
]

const Sidebar = () => {
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  return (
    <aside className="sticky top-10 flex flex-col h-full w-[320px] bg-background text-foreground rounded-2xl shadow-lg p-4 gap-4 min-h-[90vh] max-h-[98vh] border overflow-hidden">
      {/* Navigation */}
      <nav className="flex flex-col gap-1 bg-muted/60 rounded-xl p-2 overflow-auto max-h-[50vh] scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {navLinks.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors focus:bg-primary/10 focus:outline-none hover:bg-primary/10 ${isActive ? 'bg-primary/20 text-primary' : ''}`}
            >
              <Icon className="size-6" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Theme Switcher */}
      {/* <div className="flex justify-center mb-4">
        <ModeToggle />
      </div> */}
      {/* User Info */}
      <Card className="h-fit mb-2 bg-muted/70 border-none shadow-none w-full overflow-hidden flex flex-row items-center p-0">
        <div className="flex items-center gap-4 p-4 w-full">
          <Avatar className="size-12">
            <AvatarImage src={profile?.avatar || "/avatar.png"} alt="User Avatar" />
            <AvatarFallback>{profile?.name ? profile.name[0] : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">{profile?.name || "Your Name"}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">@{profile?.handle || "handle"}</CardDescription>
          </div>
          <div className="h-full flex items-center justify-end ml-auto pr-6">
            <LogoutButton />
          </div>
        </div>
      </Card>
    </aside>
  );
}

export default Sidebar
