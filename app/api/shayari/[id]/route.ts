import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Shayari from "@/lib/models/Shayari"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const shayari = await Shayari.findOne({
      _id: params.id,
      userId: session.user.id,
    }).select("-secretPassword")

    if (!shayari) {
      return NextResponse.json({ success: false, error: "Shayari not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, shayari })
  } catch (error) {
    console.error("Error fetching Shayari:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { title, content, mood, isFavorite, isSecret, secretPassword } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 })
    }

    const updateData: any = {
      title: title.trim(),
      content: content.trim(),
      mood: mood || "",
      isFavorite: Boolean(isFavorite),
      isSecret: Boolean(isSecret),
    }

    if (isSecret && secretPassword) {
      updateData.secretPassword = secretPassword
    } else if (!isSecret) {
      updateData.$unset = { secretPassword: 1 }
    }

    const shayari = await Shayari.findOneAndUpdate({ _id: params.id, userId: session.user.id }, updateData, {
      new: true,
    }).select("-secretPassword")

    if (!shayari) {
      return NextResponse.json({ success: false, error: "Shayari not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, shayari })
  } catch (error) {
    console.error("Error updating Shayari:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const shayari = await Shayari.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    })

    if (!shayari) {
      return NextResponse.json({ success: false, error: "Shayari not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Shayari deleted successfully" })
  } catch (error) {
    console.error("Error deleting Shayari:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
