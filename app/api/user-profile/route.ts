import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const db = await connectDB();
    
    // Get survey data
    const userProfile = await db.collection('survey_responses').findOne({ user_id: email });
    
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    
    // MongoDB already stores objects directly, no need to parse JSON fields
    // But we'll keep this logic in case data was stored as strings
    if (typeof userProfile.health_conditions === 'string') {
      userProfile.health_conditions = JSON.parse(userProfile.health_conditions);
    }
    if (typeof userProfile.equipment === 'string') {
      userProfile.equipment = JSON.parse(userProfile.equipment);
    }
    
    // Fetch user details from users collection using email
    const userEmail = userProfile.user_id;
    const userData = await db.collection('users').findOne(
      { email: userEmail },
      { projection: { 
          name: 1, 
          email: 1, 
          profile_photo: 1, 
          created_at: 1, 
          updated_at: 1 
        }
      }
    );
    
    // Convert MongoDB document to plain JavaScript object and handle _id serialization
    const serializedProfile = { ...userProfile, _id: userProfile._id.toString() };
    
    if (userData) {
      // Convert userData to plain object and serialize _id
      const serializedUserData = { ...userData, _id: userData._id.toString() };
      
      // Merge user details with profile
      const mergedProfile = {
        ...serializedProfile,
        userData: serializedUserData
      };
      
      return NextResponse.json(mergedProfile);
    }
    
    return NextResponse.json(serializedProfile);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}