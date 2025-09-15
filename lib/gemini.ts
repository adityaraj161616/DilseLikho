import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateCompliment(shayari: { title: string; content: string }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
You are a poetry expert and critic who appreciates Shayari (Urdu/Hindi poetry). 
Please provide a warm, encouraging compliment for this Shayari in Hindi/Urdu style.
Keep it brief (1-2 sentences) and focus on the emotional depth, word choice, or imagery.

Title: ${shayari.title}
Content: ${shayari.content}

Respond in Hindi/Urdu with English translation in parentheses.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating compliment:", error)
    return "आपकी शायरी दिल को छू गई। (Your Shayari touched the heart.)"
  }
}

export async function analyzeMood(shayari: { title: string; content: string }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
Analyze the mood and emotions in this Shayari. Provide:
1. Primary mood (romantic, sad, happy, nostalgic, philosophical, motivational)
2. Brief emotional analysis (2-3 sentences in Hindi/English mix)
3. Key emotional themes

Title: ${shayari.title}
Content: ${shayari.content}

Respond in JSON format:
{
  "mood": "primary_mood",
  "analysis": "emotional analysis text",
  "themes": ["theme1", "theme2", "theme3"]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      return JSON.parse(text)
    } catch {
      return {
        mood: "romantic",
        analysis: "इस शायरी में गहरे जज़्बात हैं। (This Shayari has deep emotions.)",
        themes: ["love", "emotions", "poetry"],
      }
    }
  } catch (error) {
    console.error("Error analyzing mood:", error)
    return {
      mood: "romantic",
      analysis: "इस शायरी में गहरे जज़्बात हैं। (This Shayari has deep emotions.)",
      themes: ["love", "emotions", "poetry"],
    }
  }
}

export async function generateSuggestions(shayari: { title: string; content: string }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
Based on this Shayari, provide 3 creative suggestions for the poet:
1. A related theme to explore next
2. A poetic technique to try
3. An inspirational writing prompt

Title: ${shayari.title}
Content: ${shayari.content}

Respond in JSON format with Hindi/Urdu suggestions:
{
  "suggestions": [
    "suggestion 1 in Hindi/Urdu",
    "suggestion 2 in Hindi/Urdu", 
    "suggestion 3 in Hindi/Urdu"
  ]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      const parsed = JSON.parse(text)
      return parsed.suggestions || []
    } catch {
      return [
        "प्रकृति के साथ अपने जज़्बात को जोड़कर लिखें",
        "अपनी यादों को शब्दों में पिरोने की कोशिश करें",
        "रात के सन्नाटे में छुपे हुए राज़ों पर लिखें",
      ]
    }
  } catch (error) {
    console.error("Error generating suggestions:", error)
    return [
      "प्रकृति के साथ अपने जज़्बात को जोड़कर लिखें",
      "अपनी यादों को शब्दों में पिरोने की कोशिश करें",
      "रात के सन्नाटे में छुपे हुए राज़ों पर लिखें",
    ]
  }
}
