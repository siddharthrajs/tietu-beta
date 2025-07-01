"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from '@/lib/client'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from "react"

const BRANCHES = [
  "Computer Science", "Electronics", "Mechanical", "Civil", "Chemical", "Other"
]
const YEARS = ["1st", "2nd", "3rd", "4th", "Other"]
const GENDERS = ["Male", "Female", "Other"]
const INTERESTS = [
  "Music", "Sports", "Coding", "Art", "Travel", "Reading", "Gaming", "Fitness", "Cooking", "Movies",
  "Photography", "Fashion", "Science", "Technology", "Writing", "Dancing", "Gardening", "Volunteering", "Languages", "DIY"
]

const formSchema = z.object({
  handle: z.string().min(2, { message: "Username must be at least 2 characters." }),
  name: z.string().optional(),
  email: z.string().email(),
  avatar: z.string().url().optional().or(z.literal("")),
  branch: z.string().optional(),
  year: z.string().optional(),
  gender: z.string().optional(),
  bio: z.string().max(500, { message: "Bio must be at most 500 characters." }).optional(),
  interests: z.array(z.string()).max(20, { message: "Select up to 20 interests." })
})

type FormValues = z.infer<typeof formSchema>

export default function OnboardingForm() {
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: "",
      name: "",
      email: "",
      avatar: "",
      branch: "",
      year: "",
      gender: "",
      bio: "",
      interests: [],
    },
  })

  // Pre-fill email from Supabase auth
  useEffect(() => {
    const fetchEmail = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        form.setValue("email", user.email)
      }
    }
    fetchEmail()
    // eslint-disable-next-line
  }, [])

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setFormError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: values.email,
        handle: values.handle,
        name: values.name,
        avatar: values.avatar,
        branch: values.branch,
        year: values.year,
        gender: values.gender,
        bio: values.bio,
        interests: values.interests,
      })
      if (error) throw error
      router.push('/protected/home')
    } catch (err: any) {
      setFormError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-5xl flex flex-col md:flex-row md:items-start md:justify-center gap-0 md:gap-0 text-white"
        >
          {/* Left Section */}
          <div className="flex-1 flex flex-col gap-6 p-8 md:p-12">
            <h1 className="text-3xl font-bold mb-2">Complete your profile</h1>
            <FormField
              control={form.control}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your_username" {...field} autoComplete="off" />
                  </FormControl>
                  <FormDescription>Your unique public handle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="opacity-70 cursor-not-allowed" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.png" {...field} />
                  </FormControl>
                  <FormDescription>Paste a link to your profile picture.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <select className="bg-black border rounded px-2 py-2 w-full" {...field}>
                      <option value="">Select branch</option>
                      {BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <select className="bg-black border rounded px-2 py-2 w-full" {...field}>
                      <option value="">Select year</option>
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select className="bg-black border rounded px-2 py-2 w-full" {...field}>
                      <option value="">Select gender</option>
                      {GENDERS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Separator */}
          <Separator orientation="vertical" className="hidden md:block h-auto w-[2px] bg-muted-foreground/30 mx-0" />

          {/* Right Section */}
          <div className="flex-1 flex flex-col gap-6 p-8 md:p-12">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself..." rows={6} {...field} />
                  </FormControl>
                  <FormDescription>Max 500 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Interests</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {INTERESTS.map((interest) => (
                  <FormField
                    key={interest}
                    control={form.control}
                    name="interests"
                    render={({ field }) => {
                      return (
                        <FormItem key={interest} className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(interest)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, interest])
                                } else {
                                  field.onChange(field.value.filter((v: string) => v !== interest))
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer select-none">{interest}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormDescription>Select up to 20 interests.</FormDescription>
              <FormMessage />
            </div>
            {formError && <div className="text-destructive text-sm mt-2">{formError}</div>}
            <Button type="submit" className="mt-4 w-full md:w-auto" disabled={loading}>
              {loading ? 'Saving...' : 'Finish Onboarding'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
