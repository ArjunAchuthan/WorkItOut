import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email,weight,height,age,gender,experienceLevel,activityLevel,workoutDuration,healthConditions, workoutEnvironment,fitnessGoal,equipment} = await request.json();
    
    const db = await connectDB();
    
    // Check if email already exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM survey_responses WHERE user_id = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      await db.end();
      return NextResponse.json(
        { error: 'Survey already taken' },
        { status: 400 }
      );
    }

    // Insert new user
    await db.execute(
      'INSERT INTO survey_responses (user_id, weight, height,age,gender,experience_level, activity_level,workout_duration,health_conditions,workout_environment,fitness_goal,equipment, created_at, updated_at) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?, NOW(), NOW())',
      [email,weight,height,age,gender,experienceLevel,activityLevel,workoutDuration,healthConditions, workoutEnvironment,fitnessGoal,equipment]
    );

    await db.end();
    
    return NextResponse.json(
      { message: 'Survey Updated successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Survey error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}