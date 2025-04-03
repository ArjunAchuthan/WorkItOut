import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { 
      email, weight, height, age, gender, experienceLevel, activityLevel, 
      workoutDuration, healthConditions, workoutEnvironment, fitnessGoal, equipment
    } = await request.json();
    
    const db = await connectDB();
    
    // Check if survey already exists for this user
    const existingSurvey = await db.collection('survey_responses').findOne({ user_id: email });

    if (existingSurvey) {
      return NextResponse.json(
        { error: 'Survey already taken' },
        { status: 400 }
      );
    }

    // Insert new survey response
    const result = await db.collection('survey_responses').insertOne({
      user_id: email,
      weight,
      height,
      age,
      gender,
      experience_level: experienceLevel,
      activity_level: activityLevel,
      workout_duration: workoutDuration,
      health_conditions: healthConditions,
      workout_environment: workoutEnvironment,
      fitness_goal: fitnessGoal,
      equipment,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return NextResponse.json(
      { 
        message: 'Survey updated successfully',
        surveyId: result.insertedId.toString()
      },
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