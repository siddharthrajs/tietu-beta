import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Users, Image as ImageIcon, File, MapPin, Settings, Download, User, Hash, Music, Utensils, Mountain } from 'lucide-react'
import { ProfileCard } from '@/components/profile-card'

const profiles = [
  {
    avatarUrl: '/avatar.png',
    username: 'kladenstien',
    bio: 'I am a software engineer',
    height: '180cm',
    branch: 'CSE',
    interests: ['Coding', 'Gaming', 'Traveling']
  },
  {
    avatarUrl: '/avatar2.png',
    username: 'randomUser',
    bio: 'Passionate about technology and art',
    height: '175cm',
    branch: 'EEE',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
  {
    avatarUrl: '/avatar3.png',
    username: 'randomUser',
    bio: 'Passionate about technology and art',
    height: '175cm',
    branch: 'ME',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
  {
    avatarUrl: '/avatar4.png',
    username: 'randomUser',
    bio: 'Passionate about technology and art',
    height: '175cm',
    branch: 'CE',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
  {
    avatarUrl: '/avatar5.png',
    username: 'randomUser',
    bio: 'Passionate about technology and art',
    height: '175cm',
    branch: 'CHE',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
  {
    avatarUrl: '/avatar6.png',
    username: 'randomUser',
    bio: 'Passionate about technology and art',
    height: '175cm',
    branch: 'Mechanical Engineering',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
]

const Home = () => {
  return (
    <div className="flex w-full gap-8">
      <div className="flex-1 flex flex-col gap-6">
        {/* Feed Header */}
        <div className="flex items-center gap-8 px-2">
          <h2 className="text-2xl font-bold">Feeds</h2>
          <div className="flex gap-4 text-muted-foreground font-semibold">
            <span className="cursor-pointer">Recents</span>
            <span className="cursor-pointer">Friends</span>
            <span className="cursor-pointer">Popular</span>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
        {profiles.map((profile, index) => (
          <ProfileCard user={profile} key={index} />
        ))}
        </div>
        {/* Feed Card */}
        <Card className="bg-muted/60 p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback>GL</AvatarFallback>
            </Avatar>
            <div>
              <span className="font-semibold">kladenstien</span>
              <span className="block text-xs text-muted-foreground">2 hours ago</span>
            </div>
          </div>
          <div className="text-base">
            Hi everyone, today I was on the most beautiful mountain in the world <span role="img" aria-label="smile">😍</span>, I also want to say hi to <span className="text-primary font-semibold">Silena</span>, <span className="text-primary font-semibold">Olya</span> and <span className="text-primary font-semibold">Davis!</span>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="mountain1" className="rounded-xl object-cover h-28 w-full" />
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="mountain2" className="rounded-xl object-cover h-28 w-full" />
            <img src="https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80" alt="mountain3" className="rounded-xl object-cover h-28 w-full" />
          </div>
          <div className="flex gap-6 items-center text-muted-foreground text-sm">
            <span className="flex items-center gap-1"><Heart className="size-4" /> 6355</span>
            <span className="flex items-center gap-1"><MessageCircle className="size-4" /> 14</span>
            <Button size="sm" variant="ghost" className="ml-auto">Like</Button>
            <Button size="sm" variant="ghost">Comment</Button>
          </div>
        </Card>
        {/* Second Feed Card */}
        <Card className="bg-yellow-100/80 dark:bg-yellow-900/30 p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback>VB</AvatarFallback>
            </Avatar>
            <div>
              <span className="font-semibold">Vitaliy Boyko</span>
              <span className="block text-xs text-muted-foreground">3 hours ago</span>
            </div>
          </div>
          <div className="text-base">
            I chose a wonderful coffee today, I wanted to tell you what product they have in stock - it's a latte with coconut <span role="img" aria-label="coffee">☕</span> milk... delicious... it's really incredibly tasty!!!
          </div>
          <div className="flex gap-6 items-center text-muted-foreground text-sm">
            <span className="flex items-center gap-1"><Heart className="size-4" /> 6355</span>
            <span className="flex items-center gap-1"><MessageCircle className="size-4" /> 8</span>
            <Button size="sm" variant="ghost" className="ml-auto">Like</Button>
            <Button size="sm" variant="ghost">Comment</Button>
          </div>
        </Card>
        {/* Share Something Box */}
        <Card className="p-4 rounded-2xl flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>GL</AvatarFallback>
          </Avatar>
          <input className="flex-1 bg-transparent outline-none px-3" placeholder="Share something" />
          <Button size="icon" variant="ghost"><File /></Button>
          <Button size="icon" variant="ghost"><ImageIcon /></Button>
          <Button size="icon" variant="ghost"><MapPin /></Button>
          <Button size="sm" className="ml-2">Send</Button>
        </Card>
      </div>
      {/* Right Sidebar (Stories, Suggestions, Recommendations) */}
      {/* <div className="flex flex-col gap-6 min-w-[280px] max-w-[320px]"> */}
        {/* Stories */}
        {/* <Card className="p-4 rounded-2xl flex flex-col gap-3">
          <CardTitle className="mb-2">Stories</CardTitle>
          <div className="flex gap-3">
            <Avatar className="size-14">
              <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
            <Avatar className="size-14">
              <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
              <AvatarFallback>LE</AvatarFallback>
            </Avatar>
          </div>
        </Card> */}
        {/* Suggestions */}
        {/* <Card className="p-4 rounded-2xl flex flex-col gap-3">
          <CardTitle className="mb-2">Suggestions</CardTitle>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-8"><AvatarImage src="https://randomuser.me/api/portraits/men/12.jpg" /><AvatarFallback>NS</AvatarFallback></Avatar>
              <span className="flex-1">Nick Shelburne</span>
              <Button size="sm" variant="secondary">Follow</Button>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="size-8"><AvatarImage src="https://randomuser.me/api/portraits/women/13.jpg" /><AvatarFallback>BL</AvatarFallback></Avatar>
              <span className="flex-1">Brittni Lando</span>
              <Button size="sm" variant="secondary">Follow</Button>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="size-8"><AvatarImage src="https://randomuser.me/api/portraits/men/14.jpg" /><AvatarFallback>IS</AvatarFallback></Avatar>
              <span className="flex-1">Ivan Shevchenko</span>
              <Button size="sm" variant="secondary">Follow</Button>
            </div>
          </div>
        </Card> */}
        {/* Recommendations */}
        {/* <Card className="p-4 rounded-2xl flex flex-col gap-4">
          <CardTitle className="mb-2">Recommendations</CardTitle>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-xl px-6 py-4 flex flex-col items-center"><Hash className="size-6 mb-1" /> UI/UX</Button>
            <Button variant="outline" className="rounded-xl px-6 py-4 flex flex-col items-center"><Music className="size-6 mb-1" /> Music</Button>
            <Button variant="outline" className="rounded-xl px-6 py-4 flex flex-col items-center"><Utensils className="size-6 mb-1" /> Cooking</Button>
            <Button variant="outline" className="rounded-xl px-6 py-4 flex flex-col items-center"><Mountain className="size-6 mb-1" /> Hiking</Button>
          </div>
        </Card> */}
      {/* </div> */}
    </div>
  )
}

export default Home
