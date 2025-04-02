"use client"

import { useState } from "react"
import { ChevronRight, Play, Clock, Flame, Award, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { WorkoutModal } from "@/components/workout-modal"

// Mock data for charts
const workoutData = [
  { day: "Mon", minutes: 45, calories: 320 },
  { day: "Tue", minutes: 0, calories: 0 },
  { day: "Wed", minutes: 60, calories: 450 },
  { day: "Thu", minutes: 30, calories: 220 },
  { day: "Fri", minutes: 0, calories: 0 },
  { day: "Sat", minutes: 75, calories: 520 },
  { day: "Sun", minutes: 45, calories: 350 },
]

const progressData = [
  { exercise: "Push-ups", week1: 10, week2: 12, week3: 15, week4: 18 },
  { exercise: "Pull-ups", week1: 5, week2: 6, week3: 8, week4: 10 },
  { exercise: "Squats", week1: 15, week2: 20, week3: 25, week4: 30 },
  { exercise: "Plank (sec)", week1: 30, week2: 45, week3: 60, week4: 90 },
]

// Today's workout
const todaysWorkout = {
  name: "Full Body Strength",
  duration: "45 min",
  exercises: [
    { name: "Push-ups", sets: 3, reps: 12 },
    { name: "Squats", sets: 3, reps: 15 },
    { name: "Dumbbell Rows", sets: 3, reps: 10 },
    { name: "Lunges", sets: 3, reps: 10 },
    { name: "Plank", sets: 3, reps: "30 sec" },
  ],
}

// Upcoming workouts
const upcomingWorkouts = [
  { day: "Tomorrow", name: "Upper Body Focus", duration: "30 min" },
  { day: "Wednesday", name: "Lower Body & Core", duration: "45 min" },
  { day: "Friday", name: "HIIT Cardio", duration: "25 min" },
]

export default function Dashboard() {
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)
  // Add state for expanded tiles
  const [expandedTile, setExpandedTile] = useState<string | null>(null)

  // Add a function to toggle tile expansion
  const toggleTileExpansion = (tileId: string) => {
    if (expandedTile === tileId) {
      setExpandedTile(null)
    } else {
      setExpandedTile(tileId)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Button onClick={() => setShowWorkoutModal(true)} className="gap-2">
                <Play className="h-4 w-4" /> Start Workout
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* User Profile Tile */}
              <Card
                className={`dashboard-tile transition-all duration-300 ${
                  expandedTile === "profile" ? "fixed inset-4 z-50 overflow-auto" : ""
                }`}
                onClick={() => toggleTileExpansion("profile")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Demo</p>
                      <p className="text-sm text-muted-foreground">Intermediate Level</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">75kg</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">178cm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Weekly Goal</span>
                      <span className="font-medium">4/5 workouts</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </CardContent>
                {expandedTile === "profile" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedTile(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>

              {/* Today's Workout Tile */}
              <Card
                className={`dashboard-tile transition-all duration-300 ${
                  expandedTile === "workout" ? "fixed inset-4 z-50 overflow-auto" : ""
                }`}
                onClick={() => toggleTileExpansion("workout")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today's Workout</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium">{todaysWorkout.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{todaysWorkout.duration}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {todaysWorkout.exercises.slice(0, 3).map((exercise, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border border-border p-2"
                      >
                        <span>{exercise.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {exercise.sets} × {exercise.reps}
                        </span>
                      </div>
                    ))}
                    {todaysWorkout.exercises.length > 3 && (
                      <div className="text-center text-sm text-primary">
                        +{todaysWorkout.exercises.length - 3} more exercises
                      </div>
                    )}
                  </div>
                  <Button className="mt-4 w-full gap-2" onClick={() => setShowWorkoutModal(true)}>
                    <Play className="h-4 w-4" /> Start Workout
                  </Button>
                </CardContent>
                {expandedTile === "workout" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedTile(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>

              {/* Streak Tile */}
              <Card
                className={`dashboard-tile transition-all duration-300 ${
                  expandedTile === "streak" ? "fixed inset-4 z-50 overflow-auto" : ""
                }`}
                onClick={() => toggleTileExpansion("streak")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Workout Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <span className="text-2xl font-bold">5</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Day Streak</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span className="text-2xl font-bold">12</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Best Streak</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {workoutData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            day.minutes > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {day.minutes > 0 ? "✓" : "–"}
                        </div>
                        <span className="mt-1 text-xs">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {expandedTile === "streak" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedTile(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>

              {/* Weekly Activity Chart */}
              <Card
                className={`dashboard-tile md:col-span-2 transition-all duration-300 ${
                  expandedTile === "activity" ? "fixed inset-4 z-50 overflow-auto" : ""
                }`}
                onClick={() => toggleTileExpansion("activity")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <Tabs defaultValue="minutes">
                      <TabsList className="mb-4">
                        <TabsTrigger value="minutes">Minutes</TabsTrigger>
                        <TabsTrigger value="calories">Calories</TabsTrigger>
                      </TabsList>
                      <TabsContent value="minutes" className="h-[200px] w-full overflow-hidden">
                        <ChartContainer
                          config={{
                            minutes: {
                              label: "Minutes",
                              color: "hsl(var(--primary))",
                            },
                          }}
                          className="w-full h-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={workoutData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} width={30} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="minutes"
                                stroke="var(--color-minutes)"
                                fill="var(--color-minutes)"
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </TabsContent>
                      <TabsContent value="calories" className="h-[200px] w-full overflow-hidden">
                        <ChartContainer
                          config={{
                            calories: {
                              label: "Calories",
                              color: "hsl(var(--primary))",
                            },
                          }}
                          className="w-full h-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={workoutData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                              <YAxis tick={{ fontSize: 12 }} width={30} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="calories"
                                stroke="var(--color-calories)"
                                fill="var(--color-calories)"
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
                {expandedTile === "activity" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedTile(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>

              {/* Upcoming Workouts */}
              <Card
                className={`dashboard-tile transition-all duration-300 ${
                  expandedTile === "upcoming" ? "fixed inset-4 z-50 overflow-auto" : ""
                }`}
                onClick={() => toggleTileExpansion("upcoming")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingWorkouts.map((workout, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-muted-foreground">{workout.day}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{workout.duration}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full gap-2">
                    <Plus className="h-4 w-4" /> Add Workout
                  </Button>
                </CardContent>
                {expandedTile === "upcoming" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedTile(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>

              {/* Progress Chart */}
              <Card
                className={`dashboard-tile lg:col-span-2 transition-all duration-300 ${
                  expandedTile === "progress" ? "fixed inset-4 z-50 overflow-auto" : ""
                }`}
                onClick={() => toggleTileExpansion("progress")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Exercise Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full overflow-hidden">
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
                        <BarChart data={progressData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="exercise" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} width={30} />
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
                {expandedTile === "progress" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedTile(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>

      <WorkoutModal open={showWorkoutModal} onClose={() => setShowWorkoutModal(false)} workout={todaysWorkout} />
      {expandedTile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setExpandedTile(null)} />
      )}
    </div>
  )
}

