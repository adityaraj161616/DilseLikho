"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import { AuthButton } from "@/components/auth-button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, User, Palette, Lock, Trash2 } from "lucide-react"

export function Settings() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [secretShayaris, setSecretShayaris] = useState<any[]>([])
  const [passwords, setPasswords] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSecretShayaris = async () => {
      try {
        const response = await fetch("/api/shayari?secret=true")
        const data = await response.json()
        if (data.success) {
          setSecretShayaris(data.shayaris)
        }
      } catch (error) {
        console.error("Error fetching secret Shayaris:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSecretShayaris()
  }, [])

  // GSAP animation
  useEffect(() => {
    if (settingsRef.current) {
      gsap.from(settingsRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      })
    }
  }, [])

  const handlePasswordChange = (shayariId: string, password: string) => {
    setPasswords((prev) => ({ ...prev, [shayariId]: password }))
  }

  const updateSecretPassword = async (shayariId: string) => {
    const password = passwords[shayariId]
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      })
      return
    }

    try {
      const shayari = secretShayaris.find((s) => s._id === shayariId)
      const response = await fetch(`/api/shayari/${shayariId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shayari,
          secretPassword: password,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Password updated successfully",
        })
        setPasswords((prev) => ({ ...prev, [shayariId]: "" }))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    }
  }

  const removeSecret = async (shayariId: string) => {
    try {
      const shayari = secretShayaris.find((s) => s._id === shayariId)
      const response = await fetch(`/api/shayari/${shayariId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shayari,
          isSecret: false,
          secretPassword: undefined,
        }),
      })

      if (response.ok) {
        setSecretShayaris((prev) => prev.filter((s) => s._id !== shayariId))
        toast({
          title: "Success!",
          description: "Shayari is no longer secret",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove secret status",
        variant: "destructive",
      })
    }
  }

  const deleteAllData = async () => {
    if (!confirm("Are you sure you want to delete all your Shayaris? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch("/api/user/delete-all", {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "All data deleted successfully",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete data",
        variant: "destructive",
      })
    }
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
        <div ref={settingsRef} className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Settings
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Customize your Dil Se Likho experience</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback className="text-2xl">
                        {session?.user?.name?.charAt(0) || <User className="w-8 h-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{session?.user?.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={session?.user?.name || ""} disabled className="mt-1" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={session?.user?.email || ""} disabled className="mt-1" />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Profile information is managed through your Google account and cannot be edited here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Theme settings are available in the header
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use the theme toggle button in the top navigation to switch between light, dark, and system
                        themes.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Preview</h4>
                    <div className="p-6 border rounded-lg bg-card text-card-foreground">
                      <h5 className="font-playfair text-xl mb-2">Sample Shayari</h5>
                      <p className="font-playfair text-gray-600 dark:text-gray-300 leading-relaxed">
                        दिल से लिखे गए अल्फाज़,
                        <br />
                        जो बयां करते हैं हर राज़,
                        <br />
                        यहाँ संजोए जाते हैं,
                        <br />
                        प्रेम के सारे अंदाज़।
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <div className="space-y-6">
                {/* Secret Shayaris Management */}
                <Card className="glassmorphism">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Secret Shayaris Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : secretShayaris.length === 0 ? (
                      <div className="text-center py-8">
                        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No secret Shayaris found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {secretShayaris.map((shayari) => (
                          <div key={shayari._id} className="p-4 border rounded-lg space-y-3">
                            <div>
                              <h4 className="font-semibold">{shayari.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{shayari.content}</p>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                type="password"
                                placeholder="New password"
                                value={passwords[shayari._id] || ""}
                                onChange={(e) => handlePasswordChange(shayari._id, e.target.value)}
                                className="flex-1"
                              />
                              <Button onClick={() => updateSecretPassword(shayari._id)} size="sm">
                                Update
                              </Button>
                              <Button
                                onClick={() => removeSecret(shayari._id)}
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                              >
                                Remove Secret
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="glassmorphism border-destructive/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Trash2 className="w-5 h-5" />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-destructive/10 rounded-lg">
                      <h4 className="font-semibold text-destructive mb-2">Delete All Data</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        This will permanently delete all your Shayaris, settings, and account data. This action cannot
                        be undone.
                      </p>
                      <Button onClick={deleteAllData} variant="destructive" size="sm">
                        Delete All Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
