// This file contains the AI-based workout recommendation logic

import { sequelize } from "@/lib/db/models"
import { QueryTypes } from "sequelize"

interface UserProfile {
  experienceLevel: string
  healthConditions: string[]
  workoutEnvironment: string
  equipment: string[]
  workoutDuration: string
  fitnessGoal: string
}

interface Exercise {
  id?: number
  name: string
  type: string
  equipment: string[]
  targetMuscles: string[]
  contraindications?: string[]
  difficulty: string
  sets?: number
  reps?: number | string
  duration?: string
}

interface Workout {
  name: string
  type: string
  duration: string
  exercises: Exercise[]
}

export async function recommendWorkouts(userProfile: UserProfile): Promise<Workout[]> {
  try {
    // Get suitable workout templates based on user profile
    const templates = await getSuitableWorkoutTemplates(userProfile)

    // If no templates found, fall back to the static recommendation logic
    if (templates.length === 0) {
      return staticRecommendWorkouts(userProfile)
    }

    // Convert templates to workout format
    const workouts: Workout[] = []

    for (const template of templates) {
      const exercises = await getExercisesForTemplate(template.id, userProfile)

      if (exercises.length > 0) {
        workouts.push({
          name: template.name,
          type: template.type,
          duration: `${userProfile.workoutDuration} min`,
          exercises,
        })
      }
    }

    // If no workouts could be created, fall back to static recommendations
    if (workouts.length === 0) {
      return staticRecommendWorkouts(userProfile)
    }

    return workouts
  } catch (error) {
    console.error("Error in dynamic workout recommendation:", error)
    // Fall back to static recommendations in case of error
    return staticRecommendWorkouts(userProfile)
  }
}

async function getSuitableWorkoutTemplates(userProfile: UserProfile) {
  // Map experience level to difficulty
  const difficultyMap: Record<string, string> = {
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
  }

  const difficulty = difficultyMap[userProfile.experienceLevel] || "beginner"

  // Query to get suitable workout templates
  const query = `
    SELECT 
      wt.id, 
      wt.name, 
      wt.type, 
      wt.duration, 
      wt.difficulty, 
      wt.fitness_goal
    FROM 
      workout_templates wt
    WHERE 
      wt.difficulty = :difficulty
      AND (wt.fitness_goal = :fitnessGoal OR wt.fitness_goal = 'general-fitness')
    ORDER BY 
      CASE WHEN wt.fitness_goal = :fitnessGoal THEN 0 ELSE 1 END,
      RAND()
    LIMIT 3
  `

  const templates = await sequelize.query(query, {
    replacements: {
      difficulty,
      fitnessGoal: userProfile.fitnessGoal || "general-fitness",
    },
    type: QueryTypes.SELECT,
  })

  return templates
}

async function getExercisesForTemplate(templateId: number, userProfile: UserProfile) {
  // Get exercises for the template
  const query = `
    SELECT 
      e.id,
      e.name,
      e.type,
      e.difficulty,
      wte.sets,
      wte.reps,
      wte.rest_time
    FROM 
      workout_template_exercises wte
    JOIN 
      exercises e ON wte.exercise_id = e.id
    WHERE 
      wte.workout_template_id = :templateId
    ORDER BY 
      wte.order_index
  `

  const templateExercises = await sequelize.query(query, {
    replacements: { templateId },
    type: QueryTypes.SELECT,
  })

  // Filter exercises based on health conditions
  const exercises: Exercise[] = []

  for (const templateExercise of templateExercises) {
    // Check if exercise has contraindications for user's health conditions
    const contraindicationsQuery = `
      SELECT 
        hc.name
      FROM 
        exercise_contraindications ec
      JOIN 
        health_conditions hc ON ec.condition_id = hc.id
      WHERE 
        ec.exercise_id = :exerciseId
    `

    const contraindications = await sequelize.query(contraindicationsQuery, {
      replacements: { exerciseId: templateExercise.id },
      type: QueryTypes.SELECT,
    })

    const contraindicationNames = contraindications.map((c: any) => c.name.toLowerCase())

    // Skip exercise if it has contraindications for user's health conditions
    if (contraindicationNames.some((c) => userProfile.healthConditions.includes(c))) {
      continue
    }

    // Get equipment for exercise
    const equipmentQuery = `
      SELECT 
        eq.name
      FROM 
        exercise_equipment ee
      JOIN 
        equipment eq ON ee.equipment_id = eq.id
      WHERE 
        ee.exercise_id = :exerciseId
    `

    const equipment = await sequelize.query(equipmentQuery, {
      replacements: { exerciseId: templateExercise.id },
      type: QueryTypes.SELECT,
    })

    const equipmentNames = equipment.map((e: any) => e.name.toLowerCase())

    // Skip exercise if it requires equipment user doesn't have (unless it's "None")
    if (
      !equipmentNames.includes("none") &&
      userProfile.workoutEnvironment !== "gym" &&
      !equipmentNames.some((e) => userProfile.equipment.includes(e))
    ) {
      continue
    }

    // Get target muscles for exercise
    const musclesQuery = `
      SELECT 
        mg.name,
        emg.is_primary
      FROM 
        exercise_muscle_groups emg
      JOIN 
        muscle_groups mg ON emg.muscle_group_id = mg.id
      WHERE 
        emg.exercise_id = :exerciseId
    `

    const muscles = await sequelize.query(musclesQuery, {
      replacements: { exerciseId: templateExercise.id },
      type: QueryTypes.SELECT,
    })

    const targetMuscles = muscles.map((m: any) => m.name.toLowerCase())

    // Add exercise to list
    exercises.push({
      id: templateExercise.id,
      name: templateExercise.name,
      type: templateExercise.type,
      equipment: equipmentNames,
      targetMuscles,
      contraindications: contraindicationNames,
      difficulty: templateExercise.difficulty,
      sets: templateExercise.sets,
      reps: templateExercise.reps,
    })
  }

  return exercises
}

// Original static recommendation logic as fallback
function staticRecommendWorkouts(userProfile: UserProfile): Workout[] {
  // Filter exercises based on user's health conditions
  const safeExercises = exerciseDatabase.filter((exercise) => {
    return !exercise.contraindications?.some((condition) => userProfile.healthConditions.includes(condition))
  })

  // Filter exercises based on available equipment
  const availableExercises = safeExercises.filter((exercise) => {
    // Include bodyweight exercises for everyone
    if (exercise.equipment.includes("none")) {
      return true
    }

    // For gym environment, assume all equipment is available
    if (userProfile.workoutEnvironment === "gym") {
      return true
    }

    // For home workouts, check if the user has the required equipment
    return exercise.equipment.some((eq) => userProfile.equipment.includes(eq))
  })

  // Filter exercises based on experience level
  let suitableExercises = availableExercises
  if (userProfile.experienceLevel === "beginner") {
    suitableExercises = availableExercises.filter((ex) => ex.difficulty === "beginner")
  } else if (userProfile.experienceLevel === "intermediate") {
    suitableExercises = availableExercises.filter(
      (ex) => ex.difficulty === "beginner" || ex.difficulty === "intermediate",
    )
  }

  // Create workouts based on filtered exercises and fitness goal
  const workouts: Workout[] = []

  // Determine number of exercises based on workout duration
  const durationMap: Record<string, number> = {
    "15": 4,
    "30": 6,
    "60": 10,
    "75": 12,
  }

  const exerciseCount = durationMap[userProfile.workoutDuration] || 6

  // Adjust workout structure based on fitness goal
  switch (userProfile.fitnessGoal) {
    case "fat-loss":
      createFatLossWorkouts(workouts, suitableExercises, userProfile, exerciseCount)
      break
    case "muscle-gain":
      createMuscleGainWorkouts(workouts, suitableExercises, userProfile, exerciseCount)
      break
    case "strength-performance":
      createStrengthWorkouts(workouts, suitableExercises, userProfile, exerciseCount)
      break
    case "general-fitness":
    default:
      createGeneralFitnessWorkouts(workouts, suitableExercises, userProfile, exerciseCount)
      break
  }

  return workouts
}

// Sample exercise database for fallback
const exerciseDatabase: Exercise[] = [
  // Bodyweight exercises
  {
    id: 1,
    name: "Push-ups",
    type: "strength",
    equipment: ["none"],
    targetMuscles: ["chest", "shoulders", "triceps"],
    contraindications: ["shoulder-pain", "wrist-pain"],
    difficulty: "beginner",
  },
  {
    id: 2,
    name: "Squats",
    type: "strength",
    equipment: ["none"],
    targetMuscles: ["quadriceps", "hamstrings", "glutes"],
    contraindications: ["knee-issues"],
    difficulty: "beginner",
  },
  {
    id: 3,
    name: "Lunges",
    type: "strength",
    equipment: ["none"],
    targetMuscles: ["quadriceps", "hamstrings", "glutes"],
    contraindications: ["knee-issues"],
    difficulty: "beginner",
  },
  {
    id: 4,
    name: "Plank",
    type: "strength",
    equipment: ["none"],
    targetMuscles: ["core", "shoulders"],
    contraindications: ["back-pain", "shoulder-pain"],
    difficulty: "beginner",
  },
  {
    id: 5,
    name: "Mountain Climbers",
    type: "cardio",
    equipment: ["none"],
    targetMuscles: ["core", "shoulders", "quadriceps"],
    contraindications: ["back-pain", "shoulder-pain"],
    difficulty: "beginner",
  },

  // Dumbbell exercises
  {
    id: 6,
    name: "Dumbbell Bench Press",
    type: "strength",
    equipment: ["dumbbells", "bench"],
    targetMuscles: ["chest", "shoulders", "triceps"],
    contraindications: ["shoulder-pain"],
    difficulty: "intermediate",
  },
  {
    id: 7,
    name: "Dumbbell Rows",
    type: "strength",
    equipment: ["dumbbells"],
    targetMuscles: ["back", "biceps"],
    contraindications: ["back-pain"],
    difficulty: "intermediate",
  },
  {
    id: 8,
    name: "Goblet Squats",
    type: "strength",
    equipment: ["dumbbells", "kettlebells"],
    targetMuscles: ["quadriceps", "hamstrings", "glutes"],
    contraindications: ["knee-issues"],
    difficulty: "intermediate",
  },

  // Resistance band exercises
  {
    id: 9,
    name: "Band Pull-Aparts",
    type: "strength",
    equipment: ["resistance-bands"],
    targetMuscles: ["back", "shoulders"],
    contraindications: ["shoulder-pain"],
    difficulty: "beginner",
  },
  {
    id: 10,
    name: "Banded Glute Bridges",
    type: "strength",
    equipment: ["resistance-bands"],
    targetMuscles: ["glutes", "hamstrings"],
    contraindications: ["back-pain"],
    difficulty: "beginner",
  },

  // Pull-up bar exercises
  {
    id: 11,
    name: "Pull-ups",
    type: "strength",
    equipment: ["pull-up-bar"],
    targetMuscles: ["back", "biceps"],
    contraindications: ["shoulder-pain"],
    difficulty: "advanced",
  },
  {
    id: 12,
    name: "Hanging Leg Raises",
    type: "strength",
    equipment: ["pull-up-bar"],
    targetMuscles: ["core"],
    contraindications: ["shoulder-pain", "back-pain"],
    difficulty: "advanced",
  },

  // Cardio exercises
  {
    id: 13,
    name: "Jumping Jacks",
    type: "cardio",
    equipment: ["none"],
    targetMuscles: ["full-body"],
    contraindications: ["knee-issues", "ankle-issues"],
    difficulty: "beginner",
  },
  {
    id: 14,
    name: "High Knees",
    type: "cardio",
    equipment: ["none"],
    targetMuscles: ["core", "quadriceps"],
    contraindications: ["knee-issues", "high-blood-pressure"],
    difficulty: "intermediate",
  },

  // Mobility exercises
  {
    id: 15,
    name: "Cat-Cow Stretch",
    type: "mobility",
    equipment: ["yoga-mat"],
    targetMuscles: ["back", "core"],
    contraindications: [],
    difficulty: "beginner",
  },
  {
    id: 16,
    name: "Hip Flexor Stretch",
    type: "mobility",
    equipment: ["yoga-mat"],
    targetMuscles: ["hip-flexors"],
    contraindications: [],
    difficulty: "beginner",
  },
]

// Helper functions for static recommendations
function createFatLossWorkouts(
  workouts: Workout[],
  exercises: Exercise[],
  userProfile: UserProfile,
  exerciseCount: number,
) {
  const strengthExercises = exercises.filter((ex) => ex.type === "strength")
  const cardioExercises = exercises.filter((ex) => ex.type === "cardio")
  const mobilityExercises = exercises.filter((ex) => ex.type === "mobility")

  // For fat loss, prioritize cardio and circuit training
  // HIIT Workout
  const hiitWorkout: Workout = {
    name: "HIIT Fat Burning",
    type: "cardio",
    duration: `${userProfile.workoutDuration} min`,
    exercises: [],
  }

  // Add cardio exercises (50% of workout)
  const cardioCount = Math.floor(exerciseCount * 0.5)
  for (let i = 0; i < cardioCount && i < cardioExercises.length; i++) {
    const exercise = cardioExercises[i]
    hiitWorkout.exercises.push({
      ...exercise,
      sets: 4,
      reps: "30 sec",
    })
  }

  // Add strength exercises (50% of workout)
  const strengthCount = Math.floor(exerciseCount * 0.5)
  for (let i = 0; i < strengthCount && i < strengthExercises.length; i++) {
    const exercise = strengthExercises[i]
    hiitWorkout.exercises.push({
      ...exercise,
      sets: 3,
      reps: 15,
    })
  }

  workouts.push(hiitWorkout)

  // Circuit Training Workout
  const circuitWorkout: Workout = {
    name: "Full Body Circuit",
    type: "circuit",
    duration: `${userProfile.workoutDuration} min`,
    exercises: [],
  }

  // Mix of strength and cardio
  for (let i = 0; i < Math.min(exerciseCount, strengthExercises.length); i++) {
    if (i < strengthExercises.length) {
      circuitWorkout.exercises.push({
        ...strengthExercises[i],
        sets: 3,
        reps: 12,
      })
    }

    if (i < cardioExercises.length) {
      circuitWorkout.exercises.push({
        ...cardioExercises[i],
        sets: 3,
        reps: "45 sec",
      })
    }
  }

  workouts.push(circuitWorkout)
}

function createMuscleGainWorkouts(
  workouts: Workout[],
  exercises: Exercise[],
  userProfile: UserProfile,
  exerciseCount: number,
) {
  const strengthExercises = exercises.filter((ex) => ex.type === "strength")
  const mobilityExercises = exercises.filter((ex) => ex.type === "mobility")

  // Upper Body Workout
  const upperBodyExercises = strengthExercises.filter((ex) =>
    ex.targetMuscles.some((muscle) => ["chest", "back", "shoulders", "triceps", "biceps"].includes(muscle)),
  )

  if (upperBodyExercises.length >= 4) {
    const upperBodyWorkout: Workout = {
      name: "Upper Body Strength",
      type: "strength",
      duration: `${userProfile.workoutDuration} min`,
      exercises: upperBodyExercises.slice(0, Math.ceil(exerciseCount * 0.7)).map((ex) => ({
        ...ex,
        sets: 4,
        reps: 8,
      })),
    }
    workouts.push(upperBodyWorkout)
  }

  // Lower Body Workout
  const lowerBodyExercises = strengthExercises.filter((ex) =>
    ex.targetMuscles.some((muscle) => ["quadriceps", "hamstrings", "glutes", "calves"].includes(muscle)),
  )

  if (lowerBodyExercises.length >= 4) {
    const lowerBodyWorkout: Workout = {
      name: "Lower Body Strength",
      type: "strength",
      duration: `${userProfile.workoutDuration} min`,
      exercises: lowerBodyExercises.slice(0, Math.ceil(exerciseCount * 0.7)).map((ex) => ({
        ...ex,
        sets: 4,
        reps: 8,
      })),
    }
    workouts.push(lowerBodyWorkout)
  }

  // Full Body Workout
  const fullBodyWorkout: Workout = {
    name: "Full Body Hypertrophy",
    type: "strength",
    duration: `${userProfile.workoutDuration} min`,
    exercises: [],
  }

  // Add strength exercises (80% of workout)
  const strengthCount = Math.floor(exerciseCount * 0.8)
  for (let i = 0; i < strengthCount && i < strengthExercises.length; i++) {
    const exercise = strengthExercises[i]
    fullBodyWorkout.exercises.push({
      ...exercise,
      sets: 3,
      reps: 10,
    })
  }

  // Add mobility exercises (20% of workout)
  const mobilityCount = Math.floor(exerciseCount * 0.2)
  for (let i = 0; i < mobilityCount && i < mobilityExercises.length; i++) {
    const exercise = mobilityExercises[i]
    fullBodyWorkout.exercises.push({
      ...exercise,
      sets: 2,
      reps: "30 sec",
    })
  }

  workouts.push(fullBodyWorkout)
}

function createStrengthWorkouts(
  workouts: Workout[],
  exercises: Exercise[],
  userProfile: UserProfile,
  exerciseCount: number,
) {
  const strengthExercises = exercises.filter((ex) => ex.type === "strength")
  const mobilityExercises = exercises.filter((ex) => ex.type === "mobility")

  // Power Workout
  const powerWorkout: Workout = {
    name: "Strength & Power",
    type: "strength",
    duration: `${userProfile.workoutDuration} min`,
    exercises: [],
  }

  // Add compound strength exercises (70% of workout)
  const compoundExercises = strengthExercises.filter((ex) => ex.targetMuscles.length > 1)

  const compoundCount = Math.floor(exerciseCount * 0.7)
  for (let i = 0; i < compoundCount && i < compoundExercises.length; i++) {
    const exercise = compoundExercises[i]
    powerWorkout.exercises.push({
      ...exercise,
      sets: 5,
      reps: 5,
    })
  }

  // Add isolation exercises (20% of workout)
  const isolationExercises = strengthExercises.filter((ex) => ex.targetMuscles.length === 1)

  const isolationCount = Math.floor(exerciseCount * 0.2)
  for (let i = 0; i < isolationCount && i < isolationExercises.length; i++) {
    const exercise = isolationExercises[i]
    powerWorkout.exercises.push({
      ...exercise,
      sets: 3,
      reps: 8,
    })
  }

  // Add mobility exercises (10% of workout)
  const mobilityCount = Math.floor(exerciseCount * 0.1)
  for (let i = 0; i < mobilityCount && i < mobilityExercises.length; i++) {
    const exercise = mobilityExercises[i]
    powerWorkout.exercises.push({
      ...exercise,
      sets: 2,
      reps: "30 sec",
    })
  }

  workouts.push(powerWorkout)

  // Functional Strength Workout
  const functionalWorkout: Workout = {
    name: "Functional Strength",
    type: "strength",
    duration: `${userProfile.workoutDuration} min`,
    exercises: [],
  }

  // Mix of compound movements
  for (let i = 0; i < Math.min(exerciseCount, strengthExercises.length); i++) {
    if (i < strengthExercises.length) {
      functionalWorkout.exercises.push({
        ...strengthExercises[i],
        sets: 4,
        reps: 6,
      })
    }
  }

  workouts.push(functionalWorkout)
}

function createGeneralFitnessWorkouts(
  workouts: Workout[],
  exercises: Exercise[],
  userProfile: UserProfile,
  exerciseCount: number,
) {
  const strengthExercises = exercises.filter((ex) => ex.type === "strength")
  const cardioExercises = exercises.filter((ex) => ex.type === "cardio")
  const mobilityExercises = exercises.filter((ex) => ex.type === "mobility")

  // Create a full body workout
  const fullBodyWorkout: Workout = {
    name: "Full Body Workout",
    type: "strength",
    duration: `${userProfile.workoutDuration} min`,
    exercises: [],
  }

  // Add strength exercises (60% of workout)
  const strengthCount = Math.floor(exerciseCount * 0.6)
  for (let i = 0; i < strengthCount && i < strengthExercises.length; i++) {
    const exercise = strengthExercises[i]
    fullBodyWorkout.exercises.push({
      ...exercise,
      sets: 3,
      reps: exercise.type === "strength" ? 12 : "30 sec",
    })
  }

  // Add cardio exercises (20% of workout)
  const cardioCount = Math.floor(exerciseCount * 0.2)
  for (let i = 0; i < cardioCount && i < cardioExercises.length; i++) {
    const exercise = cardioExercises[i]
    fullBodyWorkout.exercises.push({
      ...exercise,
      sets: 3,
      reps: "30 sec",
    })
  }

  // Add mobility exercises (20% of workout)
  const mobilityCount = Math.floor(exerciseCount * 0.2)
  for (let i = 0; i < mobilityCount && i < mobilityExercises.length; i++) {
    const exercise = mobilityExercises[i]
    fullBodyWorkout.exercises.push({
      ...exercise,
      sets: 2,
      reps: "30 sec",
    })
  }

  workouts.push(fullBodyWorkout)

  // Add more specialized workouts if we have enough exercises
  if (strengthExercises.length >= 5) {
    // Upper Body Workout
    const upperBodyExercises = strengthExercises.filter((ex) =>
      ex.targetMuscles.some((muscle) => ["chest", "back", "shoulders", "triceps", "biceps"].includes(muscle)),
    )

    if (upperBodyExercises.length >= 4) {
      const upperBodyWorkout: Workout = {
        name: "Upper Body Focus",
        type: "strength",
        duration: `${userProfile.workoutDuration} min`,
        exercises: upperBodyExercises.slice(0, 5).map((ex) => ({
          ...ex,
          sets: 3,
          reps: 12,
        })),
      }
      workouts.push(upperBodyWorkout)
    }

    // Lower Body Workout
    const lowerBodyExercises = strengthExercises.filter((ex) =>
      ex.targetMuscles.some((muscle) => ["quadriceps", "hamstrings", "glutes", "calves"].includes(muscle)),
    )

    if (lowerBodyExercises.length >= 4) {
      const lowerBodyWorkout: Workout = {
        name: "Lower Body & Core",
        type: "strength",
        duration: `${userProfile.workoutDuration} min`,
        exercises: lowerBodyExercises.slice(0, 5).map((ex) => ({
          ...ex,
          sets: 3,
          reps: 15,
        })),
      }
      workouts.push(lowerBodyWorkout)
    }
  }

  // Add a HIIT workout if we have enough cardio exercises
  if (cardioExercises.length >= 4) {
    const hiitWorkout: Workout = {
      name: "HIIT Cardio",
      type: "cardio",
      duration: "25 min",
      exercises: cardioExercises.slice(0, 6).map((ex) => ({
        ...ex,
        sets: 4,
        reps: "30 sec",
      })),
    }
    workouts.push(hiitWorkout)
  }
}

