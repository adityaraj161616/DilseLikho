"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, Lightbulb, Brain, RefreshCw } from "lucide-react"

interface AIInsightsProps {
  shayari: {
    title: string
    content: string
  }
  onInsightsGenerated?: (insights: any) => void
}

export function AIInsights({ shayari, onInsightsGenerated }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const insightsRef = useRef<HTMLDivElement>(null)

  const generateInsights = async () => {
    if (!shayari.title.trim() || !shayari.content.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shayari),
      })

      const data = await response.json()
      if (data.success) {
        setInsights(data.ai)
        setHasGenerated(true)
        onInsightsGenerated?.(data.ai)

        // Animate insights appearance
        if (insightsRef.current) {
          gsap.from(insightsRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
          })
        }
      }
    } catch (error) {
      console.error("Error generating insights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate insights when component mounts with valid content
  useEffect(() => {
    if (!hasGenerated && shayari.title.trim() && shayari.content.trim()) {
      const timer = setTimeout(() => {
        generateInsights()
      }, 1000) // Delay to avoid too many API calls

      return () => clearTimeout(timer)
    }
  }, [shayari.title, shayari.content, hasGenerated])

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

  if (!shayari.title.trim() || !shayari.content.trim()) {
    return (
      <Card className="glassmorphism">
        <CardContent className="p-6 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Complete your Shayari to get AI-powered insights and suggestions
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {!insights && !isLoading && (
        <Card className="glassmorphism">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Get AI Insights</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Let AI analyze your Shayari and provide compliments, mood analysis, and creative suggestions
            </p>
            <Button onClick={generateInsights} className="ink-drop">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card className="glassmorphism">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">AI is analyzing your beautiful Shayari...</p>
          </CardContent>
        </Card>
      )}

      {insights && (
        <div ref={insightsRef} className="space-y-6">
          {/* Compliment */}
          <Card className="glassmorphism border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-primary" />
                AI Compliment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-playfair text-lg text-gray-700 dark:text-gray-300 italic">{insights.compliment}</p>
            </CardContent>
          </Card>

          {/* Mood Analysis */}
          {insights.moodAnalysis && (
            <Card className="glassmorphism border-l-4 border-l-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-secondary" />
                  Mood Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Detected Mood:</span>
                  <Badge
                    className={
                      moodColors[insights.moodAnalysis.mood as keyof typeof moodColors] || "bg-gray-100 text-gray-800"
                    }
                  >
                    {moodLabels[insights.moodAnalysis.mood as keyof typeof moodLabels] || insights.moodAnalysis.mood}
                  </Badge>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{insights.moodAnalysis.analysis}</p>
                {insights.moodAnalysis.themes && (
                  <div>
                    <span className="text-sm font-medium mb-2 block">Key Themes:</span>
                    <div className="flex flex-wrap gap-2">
                      {insights.moodAnalysis.themes.map((theme: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {insights.suggestions && insights.suggestions.length > 0 && (
            <Card className="glassmorphism border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Creative Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-playfair">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Regenerate Button */}
          <div className="text-center">
            <Button variant="outline" onClick={generateInsights} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New Insights
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
