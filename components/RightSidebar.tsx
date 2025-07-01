import React from 'react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Megaphone, Info, Flame } from 'lucide-react';

const announcements = [
  {
    icon: <Megaphone className="text-blue-500 size-5" />, title: 'New Feature!', desc: 'Profile redesign is live. Check it out!', color: 'bg-blue-200', text: 'text-blue-700',
  },
  {
    icon: <Flame className="text-red-500 size-5" />, title: 'Hot', desc: 'Love page now supports gender filters.', color: 'bg-red-200', text: 'text-red-700',
  },
  {
    icon: <Info className="text-green-600 size-5" />, title: 'Info', desc: 'Collaborate with friends in Connections.', color: 'bg-green-100', text: 'text-green-700',
  },
];

const RightSidebar = () => (
  <aside className="w-[340px] hidden lg:block flex-shrink-0 px-2 pt-6">
    <div className="sticky top-4 flex flex-col gap-6">
      <Input placeholder="Search" className="rounded-full px-4 py-2 bg-muted" />
      <Card className="p-4 rounded-2xl shadow-md">
        <div className="font-bold text-2xl mb-4">Announcements</div>
        <div className="flex flex-col gap-4">
          {announcements.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl p-4 ${a.color}`}>
              {a.icon}
              <div>
                <div className={`font-bold text-base mb-1 ${a.text}`}>{a.title}</div>
                <div className="text-sm text-muted-foreground leading-snug">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </aside>
);

export default RightSidebar; 