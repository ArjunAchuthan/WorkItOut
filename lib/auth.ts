import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

interface JwtPayload {
  userId: number
  email: string
}

export async function getAuthUserId(request: Request | NextRequest): Promise<number | null> {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    // Extract token
    const token = authHeader.split(" ")[1]
    if (!token) {
      return null
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload

    return decoded.userId
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

