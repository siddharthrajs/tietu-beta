"use client"

import { Button } from "@/components/ui/button";
import { Squares } from "@/components/ui/squares-background";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, User, Briefcase, ArrowRight } from 'lucide-react'

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "/", icon: User },
  { name: "Contact", url: "/", icon: Briefcase },
];


export default function LandingPage() {
  return (
    <div className="h-screen relative overflow-hidden">
      <NavBar items={navItems} />
      {/* Background Squares */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares
          direction="diagonal"
          speed={0.25}
          squareSize={60}
          borderColor="#333"
          hoverFillColor="#333"
        />
      </div>
      {/* Hero Section */}
      <div className="border-2 flex flex-col items-center transform mt-32 relative z-10">
        <h1 className="text-5xl font-bold">UniCon</h1>
        <p className="text-2xl">Meet minds before faces.</p>
        <Button className="mt-4 flex items-center gap-2">
          Get Started
          <ArrowRight />
        </Button>
        {/* Dashboard Screenshot Placeholder */}
        <div className="mt-8 w-[70vw] h-[40vw] max-w-5xl max-h-[60vh] flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 text-gray-500 text-lg font-semibold mx-auto">
          Dashboard Screenshot Placeholder
        </div>
      </div>
    </div>
  );
}

