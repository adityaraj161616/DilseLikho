import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Shayari from "@/lib/models/Shayari"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id

    // Get total count
    const total = await Shayari.countDocuments({ userId })

    // Get favorites count
    const favorites = await Shayari.countDocuments({ userId, isFavorite: true })

    // Get this month's count
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const thisMonth = await Shayari.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth },
    })

    return NextResponse.json({
      success: true,
      stats: {
        total,
        favorites,
        thisMonth,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
