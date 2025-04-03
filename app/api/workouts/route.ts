import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET() {
  try {
    const connection = await connectDB()
    
    // Query to get workouts with template information
    const [rows] = await connection.execute(`
      SELECT 
        w.id, 
        w.name, 
        w.type, 
        w.duration, 
        w.exercises,
        wt.difficulty
      FROM 
        workouts w
      LEFT JOIN 
        workout_templates wt ON w.template_id = wt.id
      ORDER BY 
        w.id DESC
    `)
    
    // Parse the exercises JSON string
    const workouts = (rows as any[]).map(workout => ({
      ...workout,
      exercises: JSON.parse(workout.exercises)
    }))
    
    await connection.end()
    
    return NextResponse.json({ workouts })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 })
  }
} 