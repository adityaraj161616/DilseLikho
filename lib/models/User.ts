import clientPromise from "../mongodb-client"

export interface User {
  _id?: string
  name: string
  email: string
  password?: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export class UserModel {
  static async create(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
    try {
      const client = await clientPromise
      const users = client.db().collection("users")

      const now = new Date()
      const user = {
        ...userData,
        createdAt: now,
        updatedAt: now,
      }

      const result = await users.insertOne(user)
      return { ...user, _id: result.insertedId.toString() }
    } catch (error) {
      console.error("Error creating user:", error)
      throw new Error("Failed to create user")
    }
  }

  static async findByEmail(email: string) {
    try {
      const client = await clientPromise
      const users = client.db().collection("users")
      return await users.findOne({ email })
    } catch (error) {
      console.error("Error finding user by email:", error)
      throw new Error("Failed to find user")
    }
  }

  static async findById(id: string) {
    try {
      const client = await clientPromise
      const users = client.db().collection("users")
      const { ObjectId } = require("mongodb")
      return await users.findOne({ _id: new ObjectId(id) })
    } catch (error) {
      console.error("Error finding user by ID:", error)
      throw new Error("Failed to find user")
    }
  }
}
