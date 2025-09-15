"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Share2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface TopShayariCardsProps {
  className?: string
}

export function TopShayariCards({ className = "" }: TopShayariCardsProps) {
  const [shayaris, setShayaris] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const cardsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Fetch shayaris from Google Sheets
  const fetchShayaris = async () => {
    try {
      const response = await fetch("/api/top-shayaris")
      const data = await response.json()

      if (data.success && data.shayaris.length > 0) {
        // Take first 6 shayaris for cards display
        setShayaris(data.shayaris.slice(0, 6))
      } else {
        // Fallback shayaris
        setShayaris([
          "दिल से लिखो, दुनिया तक पहुंचाओ ✍️",
          "शब्दों में छुपे हैं हज़ारों जज़्बात 💫",
          "हर शायरी एक कहानी है 📖",
          "मोहब्बत की भाषा है शायरी 💕",
          "दर्द भी शायरी बन जाता है 🌙",
          "खुशियों को शब्दों में ढालो 🌟",
        ])
      }
    } catch (error) {
      console.error("Error fetching top shayaris:", error)
      setShayaris(["दिल से लिखो, दुनिया तक पहुंचाओ ✍️", "शब्दों में छुपे हैं हज़ारों जज़्बात 💫", "हर शायरी एक कहानी है 📖"])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShayaris()
  }, [])

  // GSAP animations
  useEffect(() => {
    if (cardsRef.current && shayaris.length > 0) {
      gsap.from(".top-shayari-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      })
    }
  }, [shayaris])

  const handleCopy = async (shayari: string, index: number) => {
    try {
      await navigator.clipboard.writeText(shayari)
      toast({
        title: "Copied!",
        description: "Shayari copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy shayari",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (shayari: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Beautiful Shayari",
          text: shayari,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      handleCopy(shayari, 0)
    }
  }

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(index)) {
      newFavorites.delete(index)
    } else {
      newFavorites.add(index)
    }
    setFavorites(newFavorites)

    toast({
      title: favorites.has(index) ? "Removed from favorites" : "Added to favorites",
      description: "Top shayari favorite status updated",
    })
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Top Shayaris</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glassmorphism">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="flex justify-between mt-4">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Top Shayaris</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">Curated from our collection</div>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shayaris.map((shayari, index) => (
          <Card
            key={index}
            className="top-shayari-card glassmorphism hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="space-y-4">
                <p
                  className="text-gray-700 dark:text-gray-200 leading-relaxed text-center font-medium"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {shayari}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(index)}
                    className={`transition-colors ${
                      favorites.has(index) ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(index) ? "fill-current" : ""}`} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(shayari, index)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(shayari)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
