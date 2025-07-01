"use client"
type ProfileCardProps = {
  user: {
    id: string; // Supabase profile id
    avatarUrl: string;
    username: string;
    name: string;
    bio: string;
    height: string;
    branch: string;
    interests: string[];
    gender: string;
    year: string;
    handle?: string;
    email: string;
    is_verified: boolean;
  };
  className?: string;
};

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mars, Venus } from "lucide-react";
import { createClient } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
/**
 * Note: To prevent card overlap, render ProfileCard in a parent with flex-wrap or grid and a gap, e.g.:
 * <div className="flex flex-wrap gap-4"> ... </div>
 */
export function ProfileCard({ user, className = "" }: ProfileCardProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [genderHover, setGenderHover] = useState(false);
  const [status, setStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'connected' | 'loading'>("loading");
  const [connId, setConnId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setModalOpen(false);
    }
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modalOpen]);

  useEffect(() => {
    let ignore = false;
    const fetchStatus = async () => {
      setStatus("loading");
      setError(null);
      const supabase = createClient();
      const { data: { user: me } } = await supabase.auth.getUser();
      if (!me) {
        setStatus("none");
        setError("Not logged in");
        return;
      }
      setCurrentUserId(me.id);
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .or(`and(user1_id.eq.${me.id},user2_id.eq.${user.id}),and(user1_id.eq.${user.id},user2_id.eq.${me.id})`)
        .order('created_at', { ascending: false })
        .limit(1);
      if (ignore) return;
      if (error) {
        setError("Failed to fetch connection");
        setStatus("none");
        return;
      }
      if (!data || data.length === 0) {
        setStatus("none");
        setConnId(null);
        return;
      }
      const conn = data[0];
      setConnId(conn.id);
      if (conn.type === "accepted") {
        setStatus("connected");
      } else if (conn.type === "pending") {
        if (conn.user1_id === me.id) {
          setStatus("pending_sent");
        } else {
          setStatus("pending_received");
        }
      } else {
        setStatus("none");
      }
    };
    fetchStatus();
    return () => { ignore = true; };
  }, [user.id]);

  // Actions
  const sendRequest = async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from('connections').insert({
      user1_id: currentUserId,
      user2_id: user.id,
      type: 'pending',
    });
    if (error) {
      setError("Failed to send request");
      setStatus("none");
    } else {
      setStatus("pending_sent");
    }
  };
  const cancelRequest = async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    if (!connId) return;
    const { error } = await supabase.from('connections').delete().eq('id', connId);
    if (error) {
      setError("Failed to cancel");
      setStatus("pending_sent");
    } else {
      setStatus("none");
    }
  };

  // Gender icon logic
  const gender = (user.gender || '').toLowerCase();
  const genderIcon = gender === 'female' ? <Venus className="w-6 h-6" /> : <Mars className="w-6 h-6" />;
  const genderText = gender === 'female' ? 'Female' : 'Male';

  // Collapsed card (summary)
  return (
    <div
      className={cn("relative bg-card rounded-xl shadow-lg border w-64 h-44 flex flex-col justify-between p-3 overflow-hidden min-w-[16rem] min-h-[11rem] max-w-[16rem] max-h-[11rem] cursor-pointer transition hover:ring-2 hover:ring-primary/40", className)}
      onClick={() => router.push(`/protected/profile/${user.username || user.handle}`)}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${user.username}`}
    >
      {/* Gender icon top right */}
      <div className="absolute top-3 right-3 z-10 group select-none">
        <div
          className="flex items-center justify-center transition-colors cursor-pointer"
          onMouseEnter={() => setGenderHover(true)}
          onMouseLeave={() => setGenderHover(false)}
          tabIndex={0}
          aria-label={genderText}
        >
          {genderHover ? (
            <span className="text-xs font-semibold px-2 py-1 bg-muted rounded transition-all">{genderText}</span>
          ) : (
            genderIcon
          )}
        </div>
      </div>
      {/* Top: Avatar + Username */}
      <div className="flex items-center gap-3 mb-1">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-lg font-bold text-foreground truncate max-w-[8rem] flex items-center">
          {user.username}
          <Tooltip>
            <TooltipTrigger asChild>
              {user.is_verified && (
                <img src="/verify.png" alt="Verified" className="w-5 h-5 ml-1 align-middle inline-block" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              Verfied Thapar Student
            </TooltipContent>
          </Tooltip>

        </span>
      </div>
      {/* Bio */}
      {user.bio && (
        <div className="text-foreground text-xs truncate mb-1 max-w-full" title={user.bio}>{user.bio}</div>
      )}
      {/* Separator */}
      <Separator className="my-1" />
      {/* Height, Branch, Year row with vertical separators */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mb-1">
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-medium truncate">{user.height || "-"}</span>
        </div>
        <Separator orientation="vertical" className="h-4 mx-1" />
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-medium truncate">{user.branch || "-"}</span>
        </div>
        <Separator orientation="vertical" className="h-4 mx-1" />
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-medium truncate">{user.year || "-"}</span>
        </div>
      </div>
      {/* Interests (max 3, 1 line, +N if more) */}
      {user.interests && user.interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1 max-w-full overflow-hidden">
          {user.interests.slice(0, 3).map((tag: string, i: number) => (
            <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5 truncate max-w-[5rem]">{tag}</Badge>
          ))}
          {user.interests.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">+{user.interests.length - 3}</Badge>
          )}
        </div>
      )}
      {/* Connect button */}
      <div className="flex flex-col gap-1 ">
        <Button
          size="sm"
          className="w-full min-h-8 text-sm"
          onClick={e => { e.stopPropagation(); sendRequest(); }}
          disabled={status === 'pending_sent' || status === 'loading'}
        >
          {status === 'pending_sent' ? 'Pending' : status === 'loading' ? 'Connecting...' : 'Connect'}
        </Button>
        {status === "pending_sent" && (
          <Button size="sm" variant="ghost" className="w-full" onClick={e => { e.stopPropagation(); cancelRequest(); }}>Cancel</Button>
        )}
        {error && <div className="text-xs text-red-500 text-center mt-1 truncate">{error}</div>}
      </div>
    </div>
  );
}
