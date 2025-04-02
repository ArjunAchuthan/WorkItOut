import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { User } from "@/lib/db/models"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with error handling
    try {
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      })

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "7d",
      })

      // Return success response with token
      return NextResponse.json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    } catch (dbError) {
      console.error("Database error during user creation:", dbError)
      return NextResponse.json(
        {
          error: "Failed to create user in database",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Failed to register user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

