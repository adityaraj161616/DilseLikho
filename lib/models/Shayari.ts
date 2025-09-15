import mongoose from "mongoose"

export interface IShayari {
  _id?: string
  title: string
  content: string
  mood?: string
  tags?: string[]
  isFavorite: boolean
  isSecret: boolean
  secretPassword?: string
  aiCompliment?: string
  aiMoodAnalysis?: string
  aiSuggestions?: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

const ShayariSchema = new mongoose.Schema<IShayari>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, default: "" },
    tags: [{ type: String }],
    isFavorite: { type: Boolean, default: false },
    isSecret: { type: Boolean, default: false },
    secretPassword: { type: String },
    aiCompliment: { type: String },
    aiMoodAnalysis: { type: String },
    aiSuggestions: [{ type: String }],
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Shayari || mongoose.model<IShayari>("Shayari", ShayariSchema)
