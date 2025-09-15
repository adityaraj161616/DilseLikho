"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { AuthButton } from "@/components/auth-button"
import { ExportOptions } from "@/components/export-options"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Heart, Lock, Share } from "lucide-react"
import type { IShayari } from "@/lib/models/Shayari"

interface ShayariDetailProps {
  shayariId: string
}

const moodColors = {
  romantic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  sad: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  happy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  nostalgic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  philosophical: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  motivational: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

const moodLabels = {
  romantic: "रोमांटिक",
  sad: "उदास",
  happy: "खुश",
  nostalgic: "नॉस्टेल्जिक",
  philosophical: "दार्शनिक",
  motivational: "प्रेरणादायक",
}

const moodBackgrounds = {
  romantic: "from-pink-100 via-rose-50 to-pink-100 dark:from-pink-900 dark:via-rose-900 dark:to-pink-900",
  sad: "from-blue-100 via-sky-50 to-blue-100 dark:from-blue-900 dark:via-sky-900 dark:to-blue-900",
  happy: "from-yellow-100 via-amber-50 to-yellow-100 dark:from-yellow-900 dark:via-amber-900 dark:to-yellow-900",
  nostalgic: "from-purple-100 via-violet-50 to-purple-100 dark:from-purple-900 dark:via-violet-900 dark:to-purple-900",
  philosophical:
    "from-green-100 via-emerald-50 to-green-100 dark:from-green-900 dark:via-emerald-900 dark:to-green-900",
  motivational: "from-orange-100 via-amber-50 to-orange-100 dark:from-orange-900 dark:via-amber-900 dark:to-orange-900",
}

export function ShayariDetail({ shayariId }: ShayariDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [shayari, setShayari] = useState<IShayari | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchShayari = async () => {
      try {
        const response = await fetch(`/api/shayari/${shayariId}`)
        const data = await response.json()

        if (data.success) {
          setShayari(data.shayari)
        } else {
          toast({
            title: "Error",
            description: "Shayari not found",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error fetching Shayari:", error)
        toast({
          title: "Error",
          description: "Failed to load Shayari",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchShayari()
  }, [shayariId, router, toast])

  // Animated text reveal
  useEffect(() => {
    if (shayari && contentRef.current) {
      const lines = contentRef.current.querySelectorAll(".shayari-line")
      gsap.from(lines, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
      })
    }
  }, [shayari])

  const handleShare = async () => {
    if (!shayari) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: shayari.title,
          text: shayari.content,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(`${shayari.title}\n\n${shayari.content}`)
      toast({
        title: "Copied!",
        description: "Shayari copied to clipboard",
      })
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!shayari) {
    return null
  }

  const backgroundClass = shayari.mood
    ? moodBackgrounds[shayari.mood as keyof typeof moodBackgrounds]
    : "from-pink-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass}`}>
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="ink-drop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <ExportOptions shayari={shayari} />
          <Button variant="outline" onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={() => router.push(`/editor/${shayari._id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glassmorphism shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center items-center gap-4 mb-4">
                {shayari.mood && (
                  <Badge className={moodColors[shayari.mood as keyof typeof moodColors] || "bg-gray-100 text-gray-800"}>
                    {moodLabels[shayari.mood as keyof typeof moodLabels] || shayari.mood}
                  </Badge>
                )}
                {shayari.isFavorite && (
                  <Badge variant="outline" className="text-primary border-primary">
                    <Heart className="w-3 h-3 mr-1 fill-current" />
                    Favorite
                  </Badge>
                )}
                {shayari.isSecret && (
                  <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                    <Lock className="w-3 h-3 mr-1" />
                    Secret
                  </Badge>
                )}
              </div>
              <CardTitle className="font-playfair text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                {shayari.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div
                ref={contentRef}
                className="text-center space-y-4 mb-8 font-playfair text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {shayari.content.split("\n").map((line, index) => (
                  <div key={index} className="shayari-line">
                    {line.trim() || <br />}
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex justify-between items-center">
                  <span>Created: {formatDate(shayari.createdAt)}</span>
                  {shayari.updatedAt !== shayari.createdAt && <span>Last edited: {formatDate(shayari.updatedAt)}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
