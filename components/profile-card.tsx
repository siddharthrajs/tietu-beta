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
  };
};

import React, { useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useRouter } from "next/navigation";

export function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

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

  useOutsideClick(ref, () => setModalOpen(false));

  const [status, setStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'connected' | 'loading'>("loading");
  const [connId, setConnId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  const acceptRequest = async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    if (!connId) return;
    const { error } = await supabase.from('connections').update({ type: 'accepted' }).eq('id', connId);
    if (error) {
      setError("Failed to accept");
      setStatus("pending_received");
    } else {
      setStatus("connected");
    }
  };
  const declineRequest = async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    if (!connId) return;
    const { error } = await supabase.from('connections').update({ type: 'declined' }).eq('id', connId);
    if (error) {
      setError("Failed to decline");
      setStatus("pending_received");
    } else {
      setStatus("none");
    }
  };

  // Collapsed card (summary)
  return (
    <>
      <motion.div
        layoutId={`card-${user.id}-${id}`}
        className="p-3 flex items-center gap-3 rounded-xl border bg-card shadow-md cursor-pointer hover:bg-muted/40 transition"
        onClick={() => router.push(`/protected/profile/${user.username}`)}
      >
        <Avatar className="size-10 flex-shrink-0">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{user.username}</div>
          <div className="text-xs text-muted-foreground truncate">{user.branch}{user.height ? ` \u2022 ${user.height}` : ''}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.interests.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">{tag}</Badge>
            ))}
            {user.interests.length > 3 && (
              <span className="text-xs text-muted-foreground">+{user.interests.length - 3} more</span>
            )}
          </div>
        </div>
      </motion.div>
      {/* Modal overlay */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 h-full w-full z-40"
            />
            <div className="fixed inset-0 grid place-items-center z-50">
              <motion.div
                layoutId={`card-${user.id}-${id}`}
                ref={ref}
                className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-card dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="flex flex-col items-center p-6 pb-2">
                  <Avatar className="size-20 mb-2">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="font-bold text-lg mb-1">{user.username}</div>
                  <div className="text-xs text-muted-foreground mb-1">{user.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{user.branch}{user.height ? ` • ${user.height}` : ''}</div>
                  <div className="flex flex-wrap gap-1 mb-2 justify-center">
                    {user.interests.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>
                    ))}
                  </div>
                  <div className="text-sm mb-2 text-center whitespace-pre-line max-h-32 overflow-auto">{user.bio}</div>
                </div>
                <div className="flex flex-col gap-2 px-6 pb-6">
                  {status === "loading" ? (
                    <Button size="sm" className="w-full" disabled>Loading...</Button>
                  ) : status === "none" ? (
                    <Button size="sm" className="w-full" onClick={sendRequest}>Connect</Button>
                  ) : status === "pending_sent" ? (
                    <Button size="sm" className="w-full" variant="outline" disabled>Pending</Button>
                  ) : status === "pending_received" ? (
                    <>
                      <Button size="sm" className="w-full" onClick={acceptRequest}>Accept</Button>
                      <Button size="sm" className="w-full" variant="destructive" onClick={declineRequest}>Decline</Button>
                    </>
                  ) : status === "connected" ? (
                    <Button size="sm" className="w-full" variant="secondary" disabled>Connected</Button>
                  ) : null}
                  {status === "pending_sent" && (
                    <Button size="sm" variant="ghost" className="w-full" onClick={cancelRequest}>Cancel</Button>
                  )}
                  {error && <div className="text-xs text-red-500 mt-1 text-center">{error}</div>}
                </div>
                <button
                  className="absolute top-4 right-4 flex items-center justify-center bg-white dark:bg-neutral-800 rounded-full h-8 w-8 z-10 shadow"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-black dark:text-white"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
