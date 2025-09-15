import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateCompliment, analyzeMood, generateSuggestions } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 })
    }

    const shayari = { title: title.trim(), content: content.trim() }

    // Generate AI insights in parallel
    const [compliment, moodAnalysis, suggestions] = await Promise.all([
      generateCompliment(shayari),
      analyzeMood(shayari),
      generateSuggestions(shayari),
    ])

    return NextResponse.json({
      success: true,
      ai: {
        compliment,
        moodAnalysis,
        suggestions,
      },
    })
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return NextResponse.json({ success: false, error: "Failed to generate AI insights" }, { status: 500 })
  }
}
