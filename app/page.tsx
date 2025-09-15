"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { AuthButton } from "@/components/auth-button"
import { Providers } from "@/app/providers"
import { Heart, PenTool, BookOpen, Sparkles, Lock, Calendar } from "lucide-react"

function LandingPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const diaryRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
      return
    }

    // GSAP animations for landing page
    const tl = gsap.timeline()

    // Hero section animation
    tl.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
    })

    // Diary opening animation
    tl.from(
      diaryRef.current,
      {
        rotateY: -90,
        transformOrigin: "left center",
        duration: 1.5,
        ease: "power2.out",
      },
      "-=0.5",
    )

    // Features stagger animation
    tl.from(
      ".feature-card",
      {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      },
      "-=0.8",
    )

    // Floating hearts animation
    gsap.to(".floating-heart", {
      y: -20,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    })

    return () => {
      tl.kill()
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Floating hearts background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Heart className="floating-heart absolute top-20 left-10 w-6 h-6 text-pink-200 dark:text-pink-800 opacity-60" />
        <Heart className="floating-heart absolute top-40 right-20 w-4 h-4 text-rose-200 dark:text-rose-800 opacity-40" />
        <Heart className="floating-heart absolute bottom-32 left-1/4 w-5 h-5 text-pink-300 dark:text-pink-700 opacity-50" />
        <Heart className="floating-heart absolute bottom-20 right-1/3 w-3 h-3 text-rose-300 dark:text-rose-700 opacity-30" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <Logo />
        <AuthButton />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div ref={heroRef} className="text-center mb-16">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dil Se Likho
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your personal sanctuary for Shayari. Write, preserve, and cherish your poetic expressions with AI-powered
            insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton />
            <Button variant="outline" className="ink-drop bg-transparent">
              Learn More
            </Button>
          </div>
        </div>

        {/* Diary Animation */}
        <div className="flex justify-center mb-16">
          <div
            ref={diaryRef}
            className="relative w-80 h-96 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-r-lg shadow-2xl diary-paper"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-transparent dark:from-amber-800 dark:to-transparent w-8 rounded-l-lg"></div>
            <div className="p-8 pt-12">
              <div className="font-playfair text-2xl text-gray-800 dark:text-gray-200 mb-4">आज का शायरी</div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p className="italic">दिल से लिखे गए अल्फाज़,</p>
                <p className="italic">जो बयां करते हैं हर राज़,</p>
                <p className="italic">यहाँ संजोए जाते हैं,</p>
                <p className="italic">प्रेम के सारे अंदाज़।</p>
              </div>
              <div className="absolute bottom-4 right-4 text-sm text-gray-500 dark:text-gray-400">- आपका दिल</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="feature-card glassmorphism hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Beautiful Editor</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Write your Shayari in a diary-like interface with ink-drop animations and auto-save functionality.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card glassmorphism hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">AI Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get compliments, mood analysis, and poetic suggestions powered by Gemini AI.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card glassmorphism hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Personal Library</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize your Shayari with filters, favorites, and beautiful card layouts.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card glassmorphism hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Secret Mode</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Password-protect your most personal Shayari for complete privacy.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card glassmorphism hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Calendar View</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your creative journey with a beautiful calendar interface.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card glassmorphism hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">Export & Share</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Save as PDF or share as beautiful images with elegant typography.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Start Your Poetic Journey Today
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of poets who trust Dil Se Likho to preserve their most cherished words.
          </p>
          <AuthButton />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-500 dark:text-gray-400">
        <p>&copy; 2024 Dil Se Likho. Made with ❤️ for poetry lovers.</p>
      </footer>
    </div>
  )
}

export default function LandingPage() {
  return (
    <Providers>
      <LandingPageContent />
    </Providers>
  )
}
