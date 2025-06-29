import React from 'react'
import { LogoutButton } from './logout-button'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Home, Heart, Users, User, LogOut, Plus, UserPlus } from 'lucide-react'
import { ModeToggle } from './theme-toggle'

const navLinks = [
  { label: 'Home', icon: Home, href: '/protected/home' },
  { label: 'Love', icon: Heart, href: '/protected/love' },
  { label: 'Collaborate', icon: Users, href: '/protected/friends' },
  { label: 'Communities', icon: UserPlus, href: '/protected/requests' },
  { label: 'Profile', icon: User, href: '/protected/profile' },
]

const Sidebar = () => {
  return (
    <aside className="sticky top-10 flex flex-col h-full w-[320px] bg-background text-foreground rounded-2xl shadow-lg p-4 gap-4 min-h-[90vh] max-h-[98vh] border">
      
      {/* Navigation */}
      <nav className="flex flex-col gap-1 bg-muted/60 rounded-xl p-2">
        {navLinks.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold hover:bg-primary/10 transition-colors focus:bg-primary/10 focus:outline-none"
          >
            <Icon className="size-6" />
            <span>{label}</span>
          </Link>
        ))}
        <div className="border-t border-muted my-2" />
        <LogoutButton />
      </nav>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Theme Switcher */}
      <div className="flex justify-center mb-4">
        <ModeToggle />
      </div>
      {/* User Info */}
      <Card className="mb-2 bg-muted/70 border-none shadow-none">
        <div className="flex items-center gap-4 p-4">
          <Avatar className="size-12">
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback>JW</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg leading-tight">Joshua Wells</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">@joswells</CardDescription>
          </div>
        </div>
      </Card>
    </aside>
  )
}

export default Sidebar
