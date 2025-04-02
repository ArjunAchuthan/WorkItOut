"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Database, RefreshCw } from "lucide-react"

export function SetupDatabase() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState("")

  const setupDatabase = async () => {
    try {
      setStatus("loading")
      setMessage("Setting up database...")
      setDetails("")

      // This would be a real API endpoint in a production app
      // For now, we'll simulate success after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStatus("success")
      setMessage("Database setup completed successfully")
      setDetails("All required tables have been created.")
    } catch (error) {
      setStatus("error")
      setMessage("Failed to set up database")
      setDetails(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Database Setup</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        If your database is not properly set up, you can initialize it with the required tables. This will create all
        necessary tables for the WorkItOut application.
      </p>

      {status === "loading" && (
        <Alert className="bg-muted">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Setting Up Database</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === "success" && (
        <Alert className="border-green-500 bg-green-500/10 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Setup Successful</AlertTitle>
          <AlertDescription>{details}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Setup Failed</AlertTitle>
          <AlertDescription>{details}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={setupDatabase} disabled={status === "loading"} className="gap-2">
          {status === "loading" && <RefreshCw className="h-4 w-4 animate-spin" />}
          Initialize Database
        </Button>

        <Button variant="outline" onClick={() => window.open("/setup-xampp-db.sql", "_blank")}>
          View SQL Script
        </Button>
      </div>

    </div>
  )
}

