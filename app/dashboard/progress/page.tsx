"use client"

import type React from "react"

import { useState } from "react"
import { format, subDays } from "date-fns"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Plus, TrendingUp, Scale, Ruler, CalendarDays } from "lucide-react"

// Mock data for weight tracking
const weightData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), "MMM dd"),
  weight: 75 - Math.random() * 2 + Math.sin(i / 5) * 1.5,
}))

// Mock data for exercise progress
const exerciseProgressData = [
  { exercise: "Bench Press", week1: 60, week2: 65, week3: 70, week4: 75 },
  { exercise: "Squat", week1: 80, week2: 85, week3: 90, week4: 95 },
  { exercise: "Deadlift", week1: 100, week2: 105, week3: 110, week4: 115 },
  { exercise: "Pull-ups", week1: 8, week2: 9, week3: 10, week4: 12 },
]

// Mock data for body measurements
const measurementsData = [
  { date: "Week 1", chest: 95, waist: 82, hips: 98, arms: 35, thighs: 55 },
  { date: "Week 2", chest: 96, waist: 81, hips: 97, arms: 36, thighs: 54 },
  { date: "Week 3", chest: 97, waist: 80, hips: 96, arms: 37, thighs: 53 },
  { date: "Week 4", chest: 98, waist: 79, hips: 95, arms: 38, thighs: 52 },
]

// Mock data for workout consistency
const consistencyData = Array.from({ length: 12 }, (_, i) => ({
  month: format(new Date(2023, i, 1), "MMM"),
  workouts: Math.floor(Math.random() * 10) + 10,
  target: 16,
}))

export default function ProgressTracking() {
  const [activeTab, setActiveTab] = useState("weight")
  const [showAddWeight, setShowAddWeight] = useState(false)
  const [newWeight, setNewWeight] = useState("")

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would add the weight to the database
    setShowAddWeight(false)
    setNewWeight("")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Progress Tracking</h1>
              <p className="text-muted-foreground">Track your fitness journey and see your improvements over time</p>
            </div>

            <Tabs defaultValue="weight" onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="weight" className="flex items-center gap-2">
                    <Scale className="h-4 w-4" /> Weight
                  </TabsTrigger>
                  <TabsTrigger value="strength" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Strength
                  </TabsTrigger>
                  <TabsTrigger value="measurements" className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" /> Measurements
                  </TabsTrigger>
                  <TabsTrigger value="consistency" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Consistency
                  </TabsTrigger>
                </TabsList>

                {activeTab === "weight" && (
                  <Button size="sm" onClick={() => setShowAddWeight(!showAddWeight)} className="gap-1">
                    <Plus className="h-4 w-4" /> Add Weight
                  </Button>
                )}
              </div>

              <TabsContent value="weight" className="space-y-6">
                {showAddWeight && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="dashboard-tile">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Add Weight Entry</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddWeight} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                          <div className="grid flex-1 gap-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                              id="weight"
                              type="number"
                              step="0.1"
                              placeholder="75.5"
                              value={newWeight}
                              onChange={(e) => setNewWeight(e.target.value)}
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit">Save</Button>
                            <Button type="button" variant="outline" onClick={() => setShowAddWeight(false)}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Weight Tracking</CardTitle>
                    <CardDescription>Your weight progress over the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full overflow-hidden">
                      <ChartContainer
                        config={{
                          weight: {
                            label: "Weight (kg)",
                            color: "hsl(var(--primary))",
                          },
                        }}
                        className="w-full h-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={weightData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 12 }} width={40} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                              type="monotone"
                              dataKey="weight"
                              stroke="var(--color-weight)"
                              fill="var(--color-weight)"
                              fillOpacity={0.2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="strength" className="space-y-6">
                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Strength Progress</CardTitle>
                    <CardDescription>Your strength improvements over the last 4 weeks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full overflow-hidden">
                      <ChartContainer
                        config={{
                          week1: {
                            label: "Week 1",
                            color: "hsl(var(--muted-foreground))",
                          },
                          week2: {
                            label: "Week 2",
                            color: "hsl(var(--accent))",
                          },
                          week3: {
                            label: "Week 3",
                            color: "hsl(var(--primary) / 0.7)",
                          },
                          week4: {
                            label: "Week 4",
                            color: "hsl(var(--primary))",
                          },
                        }}
                        className="w-full h-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={exerciseProgressData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="exercise" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} width={40} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            <Bar dataKey="week1" fill="var(--color-week1)" />
                            <Bar dataKey="week2" fill="var(--color-week2)" />
                            <Bar dataKey="week3" fill="var(--color-week3)" />
                            <Bar dataKey="week4" fill="var(--color-week4)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="measurements" className="space-y-6">
                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Body Measurements</CardTitle>
                    <CardDescription>Track changes in your body measurements over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full overflow-hidden">
                      <ChartContainer
                        config={{
                          chest: {
                            label: "Chest (cm)",
                            color: "hsl(var(--primary))",
                          },
                          waist: {
                            label: "Waist (cm)",
                            color: "hsl(var(--destructive))",
                          },
                          hips: {
                            label: "Hips (cm)",
                            color: "hsl(var(--accent))",
                          },
                          arms: {
                            label: "Arms (cm)",
                            color: "hsl(var(--muted-foreground))",
                          },
                          thighs: {
                            label: "Thighs (cm)",
                            color: "hsl(var(--secondary))",
                          },
                        }}
                        className="w-full h-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={measurementsData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} width={40} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            <Line type="monotone" dataKey="chest" stroke="var(--color-chest)" />
                            <Line type="monotone" dataKey="waist" stroke="var(--color-waist)" />
                            <Line type="monotone" dataKey="hips" stroke="var(--color-hips)" />
                            <Line type="monotone" dataKey="arms" stroke="var(--color-arms)" />
                            <Line type="monotone" dataKey="thighs" stroke="var(--color-thighs)" />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="consistency" className="space-y-6">
                <Card className="dashboard-tile">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Workout Consistency</CardTitle>
                    <CardDescription>Your monthly workout completion vs. target</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full overflow-hidden">
                      <ChartContainer
                        config={{
                          workouts: {
                            label: "Completed Workouts",
                            color: "hsl(var(--primary))",
                          },
                          target: {
                            label: "Target Workouts",
                            color: "hsl(var(--muted-foreground))",
                          },
                        }}
                        className="w-full h-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={consistencyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} width={30} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            <Bar dataKey="workouts" fill="var(--color-workouts)" />
                            <Bar dataKey="target" fill="var(--color-target)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

