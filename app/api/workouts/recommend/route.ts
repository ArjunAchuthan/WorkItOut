import { NextResponse } from "next/server"
import { SurveyResponse } from "@/lib/db/models"
import { recommendWorkouts } from "@/lib/api/workout-recommendation"
import { getAuthUserId } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Get authenticated user ID
    const userId = await getAuthUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's survey response
    const surveyResponse = await SurveyResponse.findOne({
      where: { user_id: userId },
    })

    if (!surveyResponse) {
      return NextResponse.json({ error: "Survey not found. Please complete the survey first." }, { status: 404 })
    }

    // Generate workout recommendations
    const userProfile = {
      experienceLevel: surveyResponse.experience_level,
      healthConditions: surveyResponse.health_conditions,
      workoutEnvironment: surveyResponse.workout_environment,
      equipment: surveyResponse.equipment,
      workoutDuration: surveyResponse.workout_duration,
      fitnessGoal: surveyResponse.fitness_goal || 'general-fitness',
    }

    const recommendedWorkouts = await recommendWorkouts(userProfile)

    return NextResponse.json({
      workouts: recommendedWorkouts,
    })
  } catch (error) {
    console.error("Workout recommendation error:", error)
    return NextResponse.json({ error: "Failed to generate workout recommendations" }, { status: 500 })
  }
}

