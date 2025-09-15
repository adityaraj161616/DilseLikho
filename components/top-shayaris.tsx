"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"

interface TopShayarisProps {
  className?: string
}

export function TopShayaris({ className = "" }: TopShayarisProps) {
  const [shayaris, setShayaris] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  // Fetch shayaris from Google Sheets
  const fetchShayaris = async () => {
    try {
      const response = await fetch("/api/top-shayaris")
      const data = await response.json()

      if (data.success && data.shayaris.length > 0) {
        // If less than 5 shayaris, duplicate them for smooth infinite scroll
        let finalShayaris = data.shayaris
        if (data.shayaris.length < 5) {
          const repeatCount = Math.ceil(10 / data.shayaris.length)
          finalShayaris = Array(repeatCount).fill(data.shayaris).flat()
        }
        setShayaris(finalShayaris)
      } else {
        // Fallback shayaris
        setShayaris(data.fallback || ["Dil se likho… ✍️"])
      }
    } catch (error) {
      console.error("Error fetching top shayaris:", error)
      setShayaris(["Dil se likho… ✍️"])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShayaris()
  }, [])

  // GSAP Animation Setup
  useEffect(() => {
    if (!scrollRef.current || shayaris.length === 0) return

    const scrollElement = scrollRef.current
    const containerWidth = containerRef.current?.offsetWidth || 0
    const scrollWidth = scrollElement.scrollWidth

    // Create infinite scroll animation
    const createAnimation = () => {
      return gsap.to(scrollElement, {
        x: -scrollWidth + containerWidth,
        duration: scrollWidth / 50, // Adjust speed (lower = faster)
        ease: "none",
        repeat: -1,
        repeatDelay: 0,
      })
    }

    // Initial animation
    animationRef.current = createAnimation()

    // Pause on hover
    const handleMouseEnter = () => {
      if (animationRef.current) {
        animationRef.current.pause()
      }
    }

    const handleMouseLeave = () => {
      if (animationRef.current) {
        animationRef.current.resume()
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [shayaris])

  // Fade in animation for individual shayaris
  useEffect(() => {
    if (scrollRef.current && shayaris.length > 0) {
      const shayariElements = scrollRef.current.querySelectorAll(".shayari-item")

      gsap.fromTo(
        shayariElements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      )
    }
  }, [shayaris])

  if (isLoading) {
    return (
      <div
        className={`w-full overflow-hidden bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 py-4 ${className}`}
      >
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-pink-400 dark:text-pink-300">Loading inspiring shayaris...</div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 py-4 cursor-pointer ${className}`}
    >
      <div ref={scrollRef} className="flex items-center whitespace-nowrap" style={{ width: "max-content" }}>
        {shayaris.map((shayari, index) => (
          <div
            key={`${shayari}-${index}`}
            className="shayari-item px-6 text-pink-600 dark:text-pink-300 font-medium text-lg md:text-xl drop-shadow-sm hover:drop-shadow-lg transition-all duration-300"
            style={{
              textShadow: "0 0 10px rgba(236, 72, 153, 0.3)",
              fontFamily: "var(--font-playfair)",
            }}
          >
            {shayari}
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {shayaris.map((shayari, index) => (
          <div
            key={`duplicate-${shayari}-${index}`}
            className="shayari-item px-6 text-pink-600 dark:text-pink-300 font-medium text-lg md:text-xl drop-shadow-sm hover:drop-shadow-lg transition-all duration-300"
            style={{
              textShadow: "0 0 10px rgba(236, 72, 153, 0.3)",
              fontFamily: "var(--font-playfair)",
            }}
          >
            {shayari}
          </div>
        ))}
      </div>
    </div>
  )
}
