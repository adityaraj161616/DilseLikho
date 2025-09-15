import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET(request: NextRequest) {
  try {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    const range = process.env.GOOGLE_SHEETS_RANGE || "Sheet1!A:A" // Default to column A

    if (!spreadsheetId) {
      return NextResponse.json({ success: false, error: "Google Sheets configuration missing" }, { status: 500 })
    }

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    const rows = response.data.values || []

    // Filter out empty rows and header if present
    const shayaris = rows
      .filter((row) => row[0] && row[0].trim() !== "" && row[0].toLowerCase() !== "shayari")
      .map((row) => row[0].trim())

    return NextResponse.json({
      success: true,
      shayaris,
      count: shayaris.length,
    })
  } catch (error) {
    console.error("Error fetching top shayaris:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shayaris from Google Sheets",
        fallback: ["Dil se likho… ✍️"],
      },
      { status: 500 },
    )
  }
}
