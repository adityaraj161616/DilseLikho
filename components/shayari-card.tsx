"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MoreVertical, Edit, Trash2, Lock, Eye, Share } from "lucide-react"
import type { IShayari } from "@/lib/models/Shayari"

interface ShayariCardProps {
  shayari: IShayari
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
  className?: string
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

export function ShayariCard({ shayari, onDelete, onToggleFavorite, className = "" }: ShayariCardProps) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseEnter = () => {
      setIsHovered(true)
      gsap.to(card, {
        rotateY: 5,
        rotateX: 5,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shayari.title,
          text: shayari.content,
          url: window.location.origin,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shayari.title}\n\n${shayari.content}`)
    }
  }

  return (
    <Card
      ref={cardRef}
      className={`glassmorphism hover:shadow-2xl transition-all duration-300 cursor-pointer group ${className}`}
      style={{ perspective: "1000px" }}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-playfair text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
              {shayari.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
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
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/shayari/${shayari._id}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/editor/${shayari._id}`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite(shayari._id!, shayari.isFavorite)}>
                <Heart className={`w-4 h-4 mr-2 ${shayari.isFavorite ? "fill-current" : ""}`} />
                {shayari.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(shayari._id!)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className="font-playfair text-gray-700 dark:text-gray-300 leading-relaxed mb-4 cursor-pointer"
          onClick={() => router.push(`/shayari/${shayari._id}`)}
        >
          {truncateContent(shayari.content)}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Created: {formatDate(shayari.createdAt)}</span>
          {shayari.updatedAt !== shayari.createdAt && <span>Updated: {formatDate(shayari.updatedAt)}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
