import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET() {
  try {
    const db = await connectDB()
    
    // MongoDB aggregation pipeline to join workouts with workout_templates
    const workouts = await db.collection('workouts').aggregate([
      {
        $lookup: {
          from: 'workout_templates',
          localField: 'template_id',
          foreignField: '_id',
          as: 'template'
        }
      },
      {
        $unwind: {
          path: '$template',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          type: 1,
          duration: 1,
          exercises: 1,
          difficulty: '$template.difficulty'
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]).toArray();
    
    // Convert ObjectId to string and handle exercises parsing if needed
    const serializedWorkouts = workouts.map(workout => {
      // Handle exercises if stored as a string (unlikely in MongoDB, but just in case)
      let parsedExercises = workout.exercises;
      if (typeof workout.exercises === 'string') {
        try {
          parsedExercises = JSON.parse(workout.exercises);
        } catch (e) {
          console.error('Error parsing exercises JSON:', e);
        }
      }
      
      return {
        ...workout,
        _id: workout._id.toString(), // Convert ObjectId to string
        exercises: parsedExercises
      };
    });
    
    return NextResponse.json({ workouts: serializedWorkouts })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 })
  }
}