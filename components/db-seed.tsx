// components/db-seed.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function DbSeed() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")
  const [errorDetails, setErrorDetails] = useState<string>("")

  const seedDatabase = async () => {
    try {
      setStatus("loading")
      setMessage("Seeding database...")
      setErrorDetails("")

      const response = await fetch("/api/seed-db", {
        method: "POST",
      })
      const data = await response.json()

      if (data.status === "success") {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.message || "Failed to seed database")
        setErrorDetails(data.error || "")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred while seeding the database")
      setErrorDetails(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Database Seeding</CardTitle>
        <CardDescription>
          Seed your database with sample data including exercises, workout templates, and a demo user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            This will populate your database with:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Exercise categories, equipment, and muscle groups</li>
            <li>25+ exercises with detailed metadata</li>
            <li>Workout templates for different fitness levels and goals</li>
            <li>A demo user with sample workouts</li>
          </ul>
        </div>

        <Button onClick={seedDatabase} disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Seeding Database..." : "Seed Database"}
        </Button>

        {status === "success" && (
          <div className="mt-4 flex items-start gap-2 rounded-md bg-green-50 p-3 text-green-600 dark:bg-green-950/50 dark:text-green-400">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <div>{message}</div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 flex items-start gap-2 rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              {message}
              {errorDetails && <div className="mt-2 text-sm">Error Details: {errorDetails}</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

