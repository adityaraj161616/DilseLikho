import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = Promise.resolve(client)

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
  }

  static async findByEmail(email: string) {
    const client = await clientPromise
    const users = client.db().collection("users")
    return await users.findOne({ email })
  }

  static async findById(id: string) {
    const client = await clientPromise
    const users = client.db().collection("users")
    const { ObjectId } = require("mongodb")
    return await users.findOne({ _id: new ObjectId(id) })
  }
}
