import { type NextRequest, NextResponse } from "next/server"

const hardcodedShayaris = [
  "दिल से लिखो, दुनिया तक पहुंचाओ ✍️",
  "हर शब्द में छुपी है एक कहानी 📖",
  "मोहब्बत के अल्फाज़ दिल से निकलते हैं 💕",
  "शायरी में बयां है जिंदगी का हर रंग 🌈",
  "कलम से निकले जज्बात, दिल तक पहुंचे बात 🖋️",
  "इश्क़ की दास्तान, शायरी की जुबान 💝",
  "हर लफ्ज़ में छुपा है प्यार का एहसास 🌹",
  "दिल की बात कहने का सबसे खूबसूरत तरीका 💫",
  "शायरी है दिल की आवाज़, सुनो इसे खामोशी से 🎵",
  "मोहब्बत के नाम पर लिखी गई हर शायरी अमर है 🌟",
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      shayaris: hardcodedShayaris,
      count: hardcodedShayaris.length,
    })
  } catch (error) {
    console.error("Error fetching top shayaris:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shayaris",
        fallback: ["Dil se likho… ✍️"],
      },
      { status: 500 },
    )
  }
}
