import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/db-config"

// API route to test database connection
export async function GET() {
  try {
    // First, check if environment variables are set
    const envCheck = {
      DB_HOST: process.env.DB_HOST || "not set",
      DB_PORT: process.env.DB_PORT || "not set",
      DB_USER: process.env.DB_USER || "not set",
      DB_PASSWORD: process.env.DB_PASSWORD ? "set (hidden)" : "not set",
      DB_NAME: process.env.DB_NAME || "not set",
    }

    const result = await testDatabaseConnection()

    if (result.success) {
      return NextResponse.json({
        status: "success",
        message: result.message,
        environmentVariables: envCheck,
      })
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: result.message,
          error: result.error,
          environmentVariables: envCheck,
          troubleshooting: [
            "Ensure XAMPP is running with MySQL service started",
            "Verify the database exists and tables are created",
            "Check that your .env.local file contains the correct credentials",
            "Restart the development server after making changes to environment variables",
          ],
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

