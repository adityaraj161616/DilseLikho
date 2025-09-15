"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/app/providers"

function DashboardPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Navigation />
      <Dashboard />
    </>
  )
}

export default function DashboardPage() {
  return (
    <Providers>
      <DashboardPageContent />
    </Providers>
  )
}
