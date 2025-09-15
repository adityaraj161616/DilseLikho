"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import Calendar from "react-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { AuthButton } from "@/components/auth-button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CalendarIcon, BookOpen, Heart } from "lucide-react"
import type { IShayari } from "@/lib/models/Shayari"
import "react-calendar/dist/Calendar.css"

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export function CalendarView() {
  const router = useRouter()
  const { toast } = useToast()
  const [shayaris, setShayaris] = useState<IShayari[]>([])
  const [selectedDate, setSelectedDate] = useState<Value>(new Date())
  const [selectedDateShayaris, setSelectedDateShayaris] = useState<IShayari[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Fetch all Shayaris for calendar
  useEffect(() => {
    const fetchShayaris = async () => {
      try {
        const response = await fetch("/api/shayari?limit=1000") // Get all for calendar
        const data = await response.json()

        if (data.success) {
          setShayaris(data.shayaris)
        } else {
          toast({
            title: "Error",
            description: "Failed to load Shayaris",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching Shayaris:", error)
        toast({
          title: "Error",
          description: "Failed to load Shayaris",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchShayaris()
  }, [toast])

  // Update selected date Shayaris
  useEffect(() => {
    if (selectedDate && selectedDate instanceof Date) {
      const dateStr = selectedDate.toDateString()
      const dayShayaris = shayaris.filter((shayari) => new Date(shayari.createdAt).toDateString() === dateStr)
      setSelectedDateShayaris(dayShayaris)
    }
  }, [selectedDate, shayaris])

  // GSAP animation
  useEffect(() => {
    if (calendarRef.current) {
      gsap.from(calendarRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      })
    }
  }, [])

  // Check if date has Shayaris
  const hasShayariOnDate = (date: Date) => {
    const dateStr = date.toDateString()
    return shayaris.some((shayari) => new Date(shayari.createdAt).toDateString() === dateStr)
  }

  // Get Shayari count for date
  const getShayariCountForDate = (date: Date) => {
    const dateStr = date.toDateString()
    return shayaris.filter((shayari) => new Date(shayari.createdAt).toDateString() === dateStr).length
  }

  // Custom tile content for calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const count = getShayariCountForDate(date)
      if (count > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
        )
      }
    }
    return null
  }

  // Custom tile class name
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && hasShayariOnDate(date)) {
      return "has-shayari"
    }
    return ""
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="ink-drop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Logo />
        </div>
        <AuthButton />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div ref={calendarRef} className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Your Poetic Journey
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Visualize your creative moments and revisit your beautiful Shayaris
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Calendar View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="calendar-container">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    className="react-calendar-custom"
                  />
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Days with Shayari</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {selectedDate instanceof Date ? formatDate(selectedDate) : "Select a Date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateShayaris.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No Shayaris written on this date. Why not create one today?
                    </p>
                    <Button onClick={() => router.push("/editor")} className="mt-4 ink-drop">
                      Write New Shayari
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {selectedDateShayaris.length} Shayari{selectedDateShayaris.length > 1 ? "s" : ""} written on this
                      day
                    </p>
                    {selectedDateShayaris.map((shayari) => (
                      <div
                        key={shayari._id}
                        className="p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                        onClick={() => router.push(`/shayari/${shayari._id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-playfair font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                            {shayari.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            {shayari.isFavorite && <Heart className="w-4 h-4 text-primary fill-current" />}
                            {shayari.mood && (
                              <Badge variant="outline" className="text-xs">
                                {shayari.mood}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 font-playfair">
                          {shayari.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(shayari.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glassmorphism text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{shayaris.length}</div>
                <div className="text-gray-600 dark:text-gray-300">Total Shayaris</div>
              </CardContent>
            </Card>

            <Card className="glassmorphism text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-secondary mb-2">
                  {new Set(shayaris.map((s) => new Date(s.createdAt).toDateString())).size}
                </div>
                <div className="text-gray-600 dark:text-gray-300">Active Days</div>
              </CardContent>
            </Card>

            <Card className="glassmorphism text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-accent mb-2">{shayaris.filter((s) => s.isFavorite).length}</div>
                <div className="text-gray-600 dark:text-gray-300">Favorites</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .react-calendar-custom {
          width: 100%;
          background: transparent;
          border: none;
          font-family: inherit;
        }

        .react-calendar-custom .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }

        .react-calendar-custom .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: hsl(var(--foreground));
        }

        .react-calendar-custom .react-calendar__navigation button:hover {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
          border-radius: 6px;
        }

        .react-calendar-custom .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: hsl(var(--muted-foreground));
        }

        .react-calendar-custom .react-calendar__month-view__weekdays__weekday {
          padding: 0.5em;
        }

        .react-calendar-custom .react-calendar__month-view__days__day {
          position: relative;
          background: none;
          border: none;
          padding: 0.75em 0.5em;
          font-size: 0.875em;
          color: hsl(var(--foreground));
          border-radius: 6px;
        }

        .react-calendar-custom .react-calendar__month-view__days__day:hover {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }

        .react-calendar-custom .react-calendar__month-view__days__day--active {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }

        .react-calendar-custom .react-calendar__month-view__days__day.has-shayari {
          font-weight: bold;
          background-color: hsl(var(--primary) / 0.1);
        }

        .react-calendar-custom .react-calendar__month-view__days__day--neighboringMonth {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  )
}
