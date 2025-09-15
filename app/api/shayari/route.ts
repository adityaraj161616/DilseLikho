import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Shayari from "@/lib/models/Shayari"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { title, content, mood, isFavorite, isSecret, secretPassword, aiCompliment, aiMoodAnalysis, aiSuggestions } =
      body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 })
    }

    const shayari = new Shayari({
      title: title.trim(),
      content: content.trim(),
      mood: mood || "",
      isFavorite: Boolean(isFavorite),
      isSecret: Boolean(isSecret),
      secretPassword: isSecret ? secretPassword : undefined,
      aiCompliment,
      aiMoodAnalysis,
      aiSuggestions,
      userId: session.user.id,
    })

    await shayari.save()

    return NextResponse.json({
      success: true,
      shayari: {
        _id: shayari._id,
        title: shayari.title,
        content: shayari.content,
        mood: shayari.mood,
        isFavorite: shayari.isFavorite,
        isSecret: shayari.isSecret,
        aiCompliment: shayari.aiCompliment,
        aiMoodAnalysis: shayari.aiMoodAnalysis,
        aiSuggestions: shayari.aiSuggestions,
        createdAt: shayari.createdAt,
        updatedAt: shayari.updatedAt,
      },
    })
  } catch (error) {
    console.error("Error creating Shayari:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const mood = searchParams.get("mood")
    const favorite = searchParams.get("favorite")
    const search = searchParams.get("search")
    const secret = searchParams.get("secret")

    const query: any = { userId: session.user.id }

    if (mood) query.mood = mood
    if (favorite === "true") query.isFavorite = true
    if (secret === "true") query.isSecret = true
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }]
    }

    const skip = (page - 1) * limit
    const shayaris = await Shayari.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).select("-secretPassword")

    const total = await Shayari.countDocuments(query)

    return NextResponse.json({
      success: true,
      shayaris,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching Shayaris:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
