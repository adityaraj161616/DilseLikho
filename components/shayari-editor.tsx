"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/logo"
import { AuthButton } from "@/components/auth-button"
import { AIInsights } from "@/components/ai-insights"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Heart, Lock, Sparkles, PenTool } from "lucide-react"

interface ShayariEditorProps {
  shayariId?: string
}

const moods = [
  { value: "romantic", label: "रोमांटिक", color: "text-pink-500" },
  { value: "sad", label: "उदास", color: "text-blue-500" },
  { value: "happy", label: "खुश", color: "text-yellow-500" },
  { value: "nostalgic", label: "नॉस्टेल्जिक", color: "text-purple-500" },
  { value: "philosophical", label: "दार्शनिक", color: "text-green-500" },
  { value: "motivational", label: "प्रेरणादायक", color: "text-orange-500" },
]

export function ShayariEditor({ shayariId }: ShayariEditorProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "",
    isFavorite: false,
    isSecret: false,
    secretPassword: "",
  })

  const [aiInsights, setAiInsights] = useState<any>(null)

  // Load existing Shayari if editing
  useEffect(() => {
    if (shayariId && session) {
      setIsLoading(true)
      fetch(`/api/shayari/${shayariId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFormData({
              title: data.shayari.title,
              content: data.shayari.content,
              mood: data.shayari.mood || "",
              isFavorite: data.shayari.isFavorite,
              isSecret: data.shayari.isSecret,
              secretPassword: "",
            })
            setLastSaved(new Date(data.shayari.updatedAt))
            if (data.shayari.aiCompliment || data.shayari.aiMoodAnalysis || data.shayari.aiSuggestions) {
              setAiInsights({
                compliment: data.shayari.aiCompliment,
                moodAnalysis: data.shayari.aiMoodAnalysis ? JSON.parse(data.shayari.aiMoodAnalysis) : null,
                suggestions: data.shayari.aiSuggestions || [],
              })
            }
          }
        })
        .catch((error) => {
          console.error("Error loading Shayari:", error)
          toast({
            title: "Error",
            description: "Failed to load Shayari",
            variant: "destructive",
          })
        })
        .finally(() => setIsLoading(false))
    }
  }, [shayariId, session, toast])

  // Auto-save functionality
  const autoSave = useCallback(
    async (data: typeof formData, insights?: any) => {
      if (!session || !data.title.trim() || !data.content.trim()) return

      setIsSaving(true)
      try {
        const url = shayariId ? `/api/shayari/${shayariId}` : "/api/shayari"
        const method = shayariId ? "PUT" : "POST"

        const saveData = {
          ...data,
          ...(insights && {
            aiCompliment: insights.compliment,
            aiMoodAnalysis: insights.moodAnalysis ? JSON.stringify(insights.moodAnalysis) : undefined,
            aiSuggestions: insights.suggestions,
          }),
        }

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saveData),
        })

        const result = await response.json()
        if (result.success) {
          setLastSaved(new Date())
          if (!shayariId && result.shayari._id) {
            // Redirect to edit mode after first save
            router.replace(`/editor/${result.shayari._id}`)
          }
        }
      } catch (error) {
        console.error("Auto-save error:", error)
      } finally {
        setIsSaving(false)
      }
    },
    [session, shayariId, router],
  )

  // Auto-save debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title.trim() || formData.content.trim()) {
        autoSave(formData, aiInsights)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [formData, aiInsights, autoSave])

  const triggerConfetti = useCallback(() => {
    if (confettiRef.current) {
      const hearts = Array.from({ length: 20 }, (_, i) => {
        const heart = document.createElement("div")
        heart.innerHTML = "❤️"
        heart.className = "absolute text-2xl pointer-events-none animate-bounce"
        heart.style.left = Math.random() * 100 + "%"
        heart.style.top = Math.random() * 100 + "%"
        confettiRef.current?.appendChild(heart)

        // Remove after animation
        setTimeout(() => heart.remove(), 2000)
        return heart
      })
    }
  }, [])

  // Handle content change with heart easter egg
  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }))

    // Easter egg: trigger confetti on heart emoji
    if (value.includes("❤️") && !formData.content.includes("❤️")) {
      triggerConfetti()
    }
  }

  const handleInsightsGenerated = (insights: any) => {
    setAiInsights(insights)
    // Auto-save with insights
    autoSave(formData, insights)
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      })
      return
    }

    await autoSave(formData, aiInsights)
    toast({
      title: "Saved!",
      description: "Your Shayari has been saved successfully",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Confetti container */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          {isSaving && <span className="text-sm text-gray-600 dark:text-gray-400">Saving...</span>}
          {lastSaved && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <AuthButton />
        </div>
      </header>

      {/* Editor */}
      <main className="container mx-auto px-6 py-8">
        <div ref={editorRef} className="max-w-6xl mx-auto opacity-100">
          <Tabs defaultValue="editor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger
                value="editor"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <PenTool className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Sparkles className="w-4 h-4" />
                AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="font-playfair text-2xl flex items-center gap-2 text-gray-900 dark:text-white">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    {shayariId ? "Edit Your Shayari" : "Create New Shayari"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-lg font-medium text-gray-900 dark:text-white">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Give your Shayari a beautiful title..."
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="text-lg font-playfair bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-lg font-medium text-gray-900 dark:text-white">
                      Your Shayari
                    </Label>
                    <div className="relative">
                      <Textarea
                        ref={textareaRef}
                        id="content"
                        placeholder="दिल से लिखें अपनी बात,&#10;हर शब्द में हो जज़्बात,&#10;यहाँ संजोएं अपने ख्याल,&#10;बनाएं यादों का खजाना..."
                        value={formData.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="min-h-[300px] text-lg leading-relaxed font-playfair resize-none bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white pl-12"
                        style={{
                          lineHeight: "25px",
                        }}
                      />
                      <div className="absolute left-2 top-2 bottom-2 w-8 bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800 dark:to-transparent rounded-l-lg"></div>
                    </div>
                  </div>

                  {/* Mood Selection */}
                  <div className="space-y-2">
                    <Label className="text-lg font-medium text-gray-900 dark:text-white">Mood</Label>
                    <Select
                      value={formData.mood}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, mood: value }))}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Select the mood of your Shayari" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600">
                        {moods.map((mood) => (
                          <SelectItem key={mood.value} value={mood.value} className="text-gray-900 dark:text-white">
                            <span className={mood.color}>{mood.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="favorite"
                        checked={formData.isFavorite}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFavorite: checked }))}
                      />
                      <Label htmlFor="favorite" className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Heart className="w-4 h-4 text-red-500" />
                        Mark as Favorite
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="secret"
                        checked={formData.isSecret}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isSecret: checked }))}
                      />
                      <Label htmlFor="secret" className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Lock className="w-4 h-4 text-blue-600" />
                        Secret Mode
                      </Label>
                    </div>
                  </div>

                  {/* Secret Password */}
                  {formData.isSecret && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-lg font-medium text-gray-900 dark:text-white">
                        Secret Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter a password to protect this Shayari"
                        value={formData.secretPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, secretPassword: e.target.value }))}
                        className="bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dashboard")}
                      className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Shayari"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <AIInsights
                shayari={{ title: formData.title, content: formData.content }}
                onInsightsGenerated={handleInsightsGenerated}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
