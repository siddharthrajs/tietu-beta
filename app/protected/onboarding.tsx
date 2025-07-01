"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

const branches = ["CSE", "ECE", "ME", "CE", "EE", "CHE", "BT", "Other"];
const years = ["1st", "2nd", "3rd", "4th"];
const genders = ["Male", "Female", "Other"];
const avatars = [
  "/avatars/1.png",
  "/avatars/2.png",
  "/avatars/3.png",
  "/avatars/4.png",
  "/avatars/5.png"
];

export default function OnboardingForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    handle: "",
    branch: "",
    year: "",
    gender: "",
    avatar: avatars[0],
    bio: "",
    interests: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleAvatar = (src: string) => {
    setForm({ ...form, avatar: src });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...form
      });
      if (error) throw error;
      router.push("/protected/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <Label>Choose Avatar</Label>
              <div className="flex gap-2">
                {avatars.map((src) => (
                  <button
                    key={src}
                    type="button"
                    className={`rounded-full border-2 ${form.avatar === src ? "border-primary" : "border-muted"}`}
                    onClick={() => handleAvatar(src)}
                  >
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={src} />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label>Handle</Label>
                <Input name="handle" value={form.handle} onChange={handleChange} required prefix="@" />
              </div>
              <div>
                <Label>Branch</Label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={(e) => handleSelect("branch", e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Year</Label>
                <select
                  name="year"
                  value={form.year}
                  onChange={(e) => handleSelect("year", e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={(e) => handleSelect("gender", e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select</option>
                  {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Interests</Label>
                <Input name="interests" value={form.interests} onChange={handleChange} placeholder="e.g. Coding, Music" />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea name="bio" value={form.bio} onChange={handleChange} rows={3} maxLength={160} placeholder="Write a cool bio..." required />
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
