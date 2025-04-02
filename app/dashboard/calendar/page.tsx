"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

// Mock data for workouts
const mockWorkouts = [
  {
    id: 1,
    date: new Date(2023, 3, 10),
    name: "Full Body Strength",
    duration: "45 min",
    exercises: [
      { name: "Push-ups", sets: 3, reps: 12 },
      { name: "Squats", sets: 3, reps: 15 },
      { name: "Dumbbell Rows", sets: 3, reps: 10 },
      { name: "Lunges", sets: 3, reps: 10 },
      { name: "Plank", sets: 3, reps: "30 sec" },
    ],
    completed: true,
  },
  {
    id: 2,
    date: new Date(2023, 3, 12),
    name: "Upper Body Focus",
    duration: "30 min",
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10 },
      { name: "Pull-ups", sets: 3, reps: 8 },
      { name: "Shoulder Press", sets: 3, reps: 10 },
      { name: "Tricep Dips", sets: 3, reps: 12 },
    ],
    completed: true,
  },
  {
    id: 3,
    date: new Date(2023, 3, 15),
    name: "Lower Body & Core",
    duration: "45 min",
    exercises: [
      { name: "Deadlifts", sets: 3, reps: 10 },
      { name: "Leg Press", sets: 3, reps: 12 },
      { name: "Calf Raises", sets: 3, reps: 15 },
      { name: "Russian Twists", sets: 3, reps: 20 },
      { name: "Leg Raises", sets: 3, reps: 15 },
    ],
    completed: false,
  },
  {
    id: 4,
    date: new Date(2023, 3, 18),
    name: "HIIT Cardio",
    duration: "25 min",
    exercises: [
      { name: "Jumping Jacks", sets: 4, reps: "30 sec" },
      { name: "Mountain Climbers", sets: 4, reps: "30 sec" },
      { name: "Burpees", sets: 4, reps: "30 sec" },
      { name: "High Knees", sets: 4, reps: "30 sec" },
      { name: "Jump Squats", sets: 4, reps: "30 sec" },
    ],
    completed: false,
  },
]

export default function WorkoutCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDateClick = (day: Date) => {
    setSelectedDate(day)

    // Find workouts for the selected date
    const workoutsForDay = mockWorkouts.filter((workout) => isSameDay(workout.date, day))

    if (workoutsForDay.length > 0) {
      setSelectedWorkout(workoutsForDay[0])
    } else {
      setSelectedWorkout(null)
    }
  }

  const closeWorkoutDetails = () => {
    setSelectedWorkout(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Workout Calendar</h1>
              <p className="text-muted-foreground">View and manage your scheduled workouts</p>
            </div>

            <Card className="dashboard-tile">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Calendar</CardTitle>
                  <CardDescription>{format(currentDate, "MMMM yyyy")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2 text-sm font-medium">
                      {day}
                    </div>
                  ))}

                  {monthDays.map((day, i) => {
                    // Find workouts for this day
                    const workoutsForDay = mockWorkouts.filter((workout) => isSameDay(workout.date, day))

                    const hasWorkout = workoutsForDay.length > 0
                    const isCompleted = hasWorkout && workoutsForDay[0].completed
                    const isSelected = selectedDate && isSameDay(day, selectedDate)

                    return (
                      <div
                        key={i}
                        className={`
                          relative flex aspect-square flex-col items-center justify-center rounded-md p-2 text-sm
                          ${isSameMonth(day, currentDate) ? "" : "text-muted-foreground opacity-50"}
                          ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                          cursor-pointer transition-colors
                        `}
                        onClick={() => handleDateClick(day)}
                      >
                        <span>{format(day, "d")}</span>
                        {hasWorkout && (
                          <div
                            className={`
                              mt-1 h-1.5 w-1.5 rounded-full
                              ${isCompleted ? "bg-green-500" : "bg-blue-500"}
                              ${isSelected ? "bg-primary-foreground" : ""}
                            `}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h2 className="mb-4 text-xl font-bold">
                {selectedDate ? <>Workouts for {format(selectedDate, "MMMM d, yyyy")}</> : <>Upcoming Workouts</>}
              </h2>

              {selectedWorkout ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="dashboard-tile">
                      <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div>
                          <CardTitle>{selectedWorkout.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {selectedWorkout.duration}
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={closeWorkoutDetails}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedWorkout.exercises.map((exercise: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {exercise.sets} sets × {exercise.reps}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button className="flex-1">
                            {selectedWorkout.completed ? "Completed" : "Start Workout"}
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Edit Workout
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="text-center text-muted-foreground">
                  {selectedDate ? (
                    <>No workouts scheduled for this day. Click to add a workout.</>
                  ) : (
                    <>Select a date to view or add workouts.</>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

