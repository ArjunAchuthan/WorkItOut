"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DbConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")
  const [errorDetails, setErrorDetails] = useState<string>("")
  const [envVars, setEnvVars] = useState<Record<string, string> | null>(null)
  const [troubleshooting, setTroubleshooting] = useState<string[]>([])

  const testConnection = async () => {
    try {
      setStatus("loading")
      setMessage("Testing database connection...")
      setErrorDetails("")
      setEnvVars(null)
      setTroubleshooting([])

      const response = await fetch("/api/test-db")
      const data = await response.json()

      if (data.status === "success") {
        setStatus("success")
        setMessage(data.message)
        setEnvVars(data.environmentVariables || null)
      } else {
        setStatus("error")
        setMessage(data.message || "Failed to connect to database")
        setErrorDetails(data.error || "")
        setEnvVars(data.environmentVariables || null)
        setTroubleshooting(data.troubleshooting || [])
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred while testing the connection")
      setErrorDetails(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
        <CardDescription>Test your database connection and view environment variables.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={testConnection} disabled={status === "loading"}>
          {status === "loading" ? "Testing..." : "Test Connection"}
        </Button>

        {status === "success" && <div className="mt-4 text-green-500">{message}</div>}

        {status === "error" && (
          <div className="mt-4 text-red-500">
            {message}
            {errorDetails && <div className="mt-2">Error Details: {errorDetails}</div>}
          </div>
        )}

        {envVars && (
          <div className="mt-4 rounded-md border p-4">
            <h4 className="mb-2 font-medium">Environment Variables</h4>
            <div className="space-y-1">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="font-mono">{key}</span>
                  <span className={value === "not set" ? "text-destructive" : ""}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {troubleshooting.length > 0 && (
          <div className="mt-4 rounded-md border p-4">
            <h4 className="mb-2 font-medium">Troubleshooting Steps</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {troubleshooting.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

