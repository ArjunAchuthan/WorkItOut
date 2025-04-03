import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { name, email, age, weight, height, userId, currentEmail } = await request.json();
    
    if (!name || !email || !age || !weight || !height || !userId || !currentEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const db = await connectDB();
    
    // Update users collection
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          name, 
          email, 
          updated_at: new Date() 
        } 
      }
    );
    
    // Update survey_responses collection
    await db.collection('survey_responses').updateOne(
      { user_id: currentEmail },
      { 
        $set: { 
          weight, 
          height, 
          age, 
          updated_at: new Date() 
        } 
      }
    );
    
    // If email changed, update the user_id reference in survey_responses
    if (email !== currentEmail) {
      await db.collection('survey_responses').updateOne(
        { user_id: currentEmail },
        { $set: { user_id: email } }
      );
    }
    
    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}