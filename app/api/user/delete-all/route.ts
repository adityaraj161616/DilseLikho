import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Shayari from "@/lib/models/Shayari"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Delete all Shayaris for the user
    await Shayari.deleteMany({ userId: session.user.id })

    return NextResponse.json({
      success: true,
      message: "All user data deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user data:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
