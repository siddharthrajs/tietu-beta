import React from 'react'
import { ProfileCard } from '@/components/profile-card'

const profiles = [
  {
    avatarUrl: '/avatar1.png',
    username: 'kladenstien',
    bio: 'I am a software engineer',
    height: '180cm',
    branch: 'CSE',
    interests: ['Coding', 'Gaming', 'Traveling']
  },
  {
    avatarUrl: '/avatar2.png',
    username: 'randomUser',
    bio: 'I am a photographer',
    height: '175cm',
    branch: 'EEE',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
  {
    avatarUrl: '/avatar3.png',
    username: 'randomUser',
    bio: 'I am a designer',
    height: '175cm',
    branch: 'ME',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
  {
    avatarUrl: '/avatar4.png',
    username: 'randomUser',
    bio: 'I am a musician',
    height: '175cm',
    branch: 'CE',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
  {
    avatarUrl: '/avatar5.png',
    username: 'randomUser',
    bio: 'I am a chef',
    height: '175cm',
    branch: 'CHE',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
  {
    avatarUrl: '/avatar6.png',
    username: 'randomUser',
    bio: 'I am a traveler',
    height: '175cm',
    branch: 'Mechanical Engineering',
    interests: ['Photography', 'Hiking', 'Cooking']
  },
]

const Friends = () => {
  return (
    <div className="flex flex-wrap gap-6 p-6 justify-center">
      {profiles.map((profile, idx) => (
        <ProfileCard user={profile} key={idx} />
      ))}
    </div>
  )
}

export default Friends
