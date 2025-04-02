"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dumbbell, Clock, Filter, Search, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { WorkoutModal } from "@/components/workout-modal"

// Mock data for workouts
const workouts = [
  {
    id: 1,
    name: "Full Body Strength",
    type: "strength",
    duration: "45 min",
    difficulty: "Intermediate",
    exercises: [
      { name: "Push-ups", sets: 3, reps: 12 },
      { name: "Squats", sets: 3, reps: 15 },
      { name: "Dumbbell Rows", sets: 3, reps: 10 },
      { name: "Lunges", sets: 3, reps: 10 },
      { name: "Plank", sets: 3, reps: "30 sec" },
    ],
  },
  {
    id: 2,
    name: "Upper Body Focus",
    type: "strength",
    duration: "30 min",
    difficulty: "Intermediate",
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10 },
      { name: "Pull-ups", sets: 3, reps: 8 },
      { name: "Shoulder Press", sets: 3, reps: 10 },
      { name: "Tricep Dips", sets: 3, reps: 12 },
      { name: "Bicep Curls", sets: 3, reps: 12 },
    ],
  },
  {
    id: 3,
    name: "Lower Body & Core",
    type: "strength",
    duration: "45 min",
    difficulty: "Intermediate",
    exercises: [
      { name: "Deadlifts", sets: 3, reps: 10 },
      { name: "Leg Press", sets: 3, reps: 12 },
      { name: "Calf Raises", sets: 3, reps: 15 },
      { name: "Russian Twists", sets: 3, reps: 20 },
      { name: "Leg Raises", sets: 3, reps: 15 },
    ],
  },
  {
    id: 4,
    name: "HIIT Cardio",
    type: "cardio",
    duration: "25 min",
    difficulty: "Advanced",
    exercises: [
      { name: "Jumping Jacks", sets: 4, reps: "30 sec" },
      { name: "Mountain Climbers", sets: 4, reps: "30 sec" },
      { name: "Burpees", sets: 4, reps: "30 sec" },
      { name: "High Knees", sets: 4, reps: "30 sec" },
      { name: "Jump Squats", sets: 4, reps: "30 sec" },
    ],
  },
  {
    id: 5,
    name: "Beginner Full Body",
    type: "strength",
    duration: "30 min",
    difficulty: "Beginner",
    exercises: [
      { name: "Wall Push-ups", sets: 2, reps: 10 },
      { name: "Chair Squats", sets: 2, reps: 12 },
      { name: "Standing Row with Band", sets: 2, reps: 12 },
      { name: "Glute Bridges", sets: 2, reps: 15 },
      { name: "Modified Plank", sets: 2, reps: "20 sec" },
    ],
  },
  {
    id: 6,
    name: "Mobility & Stretching",
    type: "mobility",
    duration: "20 min",
    difficulty: "Beginner",
    exercises: [
      { name: "Cat-Cow Stretch", sets: 1, reps: "60 sec" },
      { name: "Hip Flexor Stretch", sets: 1, reps: "45 sec per side" },
      { name: "Shoulder Rolls", sets: 1, reps: "30 sec" },
      { name: "Hamstring Stretch", sets: 1, reps: "45 sec per side" },
      { name: "Quad Stretch", sets: 1, reps: "45 sec per side" },
    ],
  },
]

export default function WorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null)
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)

  // Filter workouts based on search query and active tab
  const filterWorkouts = (workouts: any[], tab: string) => {
    return workouts.filter((workout) => {
      const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab = tab === "all" || workout.type === tab
      return matchesSearch && matchesTab
    })
  }

  const handleWorkoutClick = (workout: any) => {
    setSelectedWorkout(workout)
    setShowWorkoutModal(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Workouts</h1>
                <p className="text-muted-foreground">Browse and start your personalized workout sessions</p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create Workout
              </Button>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search workouts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="strength">Strength</TabsTrigger>
                <TabsTrigger value="cardio">Cardio</TabsTrigger>
                <TabsTrigger value="mobility">Mobility</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filterWorkouts(workouts, "all").map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} onClick={() => handleWorkoutClick(workout)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="strength" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filterWorkouts(workouts, "strength").map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} onClick={() => handleWorkoutClick(workout)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="cardio" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filterWorkouts(workouts, "cardio").map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} onClick={() => handleWorkoutClick(workout)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mobility" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filterWorkouts(workouts, "mobility").map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} onClick={() => handleWorkoutClick(workout)} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {selectedWorkout && (
        <WorkoutModal open={showWorkoutModal} onClose={() => setShowWorkoutModal(false)} workout={selectedWorkout} />
      )}
    </div>
  )
}

interface WorkoutCardProps {
  workout: any
  onClick: () => void
}

function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="workout-card cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-full bg-primary/10 p-2">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{workout.duration}</span>
        </div>
      </div>
      <h3 className="mb-1 text-lg font-bold">{workout.name}</h3>
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{workout.type}</span>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{workout.difficulty}</span>
      </div>
      <div className="space-y-2">
        {workout.exercises.slice(0, 3).map((exercise: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span>{exercise.name}</span>
            <span className="text-muted-foreground">
              {exercise.sets} × {exercise.reps}
            </span>
          </div>
        ))}
        {workout.exercises.length > 3 && (
          <div className="flex items-center justify-between pt-2 text-sm text-primary">
            <span>+{workout.exercises.length - 3} more exercises</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

