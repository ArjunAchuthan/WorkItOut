"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Pause, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Exercise {
  name: string
  sets: number
  reps: number | string
}

interface Workout {
  name: string
  duration: string
  exercises: Exercise[]
}

interface WorkoutModalProps {
  open: boolean
  onClose: () => void
  workout: Workout
}

export function WorkoutModal({ open, onClose, workout }: WorkoutModalProps) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completed, setCompleted] = useState(false)

  const totalExercises = workout.exercises.length
  const progress = (currentExercise / totalExercises) * 100

  const handleNext = () => {
    if (currentSet < workout.exercises[currentExercise].sets) {
      setCurrentSet(currentSet + 1)
    } else {
      if (currentExercise < totalExercises - 1) {
        setCurrentExercise(currentExercise + 1)
        setCurrentSet(1)
      } else {
        setCompleted(true)
      }
    }
  }

  const resetWorkout = () => {
    setCurrentExercise(0)
    setCurrentSet(1)
    setIsPlaying(false)
    setCompleted(false)
  }

  const closeModal = () => {
    onClose()
    setTimeout(() => {
      resetWorkout()
    }, 300)
  }

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg"
          >
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={closeModal}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            {!completed ? (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold">{workout.name}</h2>
                  <p className="text-sm text-muted-foreground">{workout.duration}</p>
                </div>

                <div className="mb-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {currentExercise + 1}/{totalExercises}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="mb-8 rounded-xl border border-border bg-muted/30 p-6 text-center">
                  <div className="mb-2 text-sm text-muted-foreground">Current Exercise</div>
                  <h3 className="mb-1 text-2xl font-bold">{workout.exercises[currentExercise].name}</h3>
                  <div className="mb-4 text-lg font-medium">
                    Set {currentSet} of {workout.exercises[currentExercise].sets}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {workout.exercises[currentExercise].reps}{" "}
                    {typeof workout.exercises[currentExercise].reps === "number" ? "reps" : ""}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Start
                      </>
                    )}
                  </Button>
                  <Button className="flex-1 gap-2" onClick={handleNext}>
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-6">
                  <div className="mb-2 text-sm font-medium">Up Next:</div>
                  {currentExercise < totalExercises - 1 ? (
                    <div className="rounded-lg border border-border p-3">
                      <div className="font-medium">{workout.exercises[currentExercise + 1].name}</div>
                      <div className="text-sm text-muted-foreground">
                        {workout.exercises[currentExercise + 1].sets} sets ×{" "}
                        {workout.exercises[currentExercise + 1].reps} reps
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border p-3 text-muted-foreground">End of workout</div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Workout Complete!</h2>
                <p className="mb-6 text-muted-foreground">Great job! You've completed your {workout.name} workout.</p>
                <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{workout.exercises.length}</div>
                    <div className="text-sm text-muted-foreground">Exercises</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{workout.duration.replace(" min", "")}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                </div>
                <Button className="w-full" onClick={closeModal}>
                  Done
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

