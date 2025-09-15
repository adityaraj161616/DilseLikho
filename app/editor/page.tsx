"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ShayariEditor } from "@/components/shayari-editor"
import { Navigation } from "@/components/navigation"
import { Providers } from "@/app/providers"

function EditorPageContent() {
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
      <ShayariEditor />
    </>
  )
}

export default function EditorPage() {
  return (
    <Providers>
      <EditorPageContent />
    </Providers>
  )
}
