import { connectDB } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const connection = await connectDB();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM survey_responses WHERE user_id = ?', 
      [email]
    );
    
    if (!Array.isArray(rows) || rows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    
    const userProfile = rows[0];
    
    // Parse JSON fields
    if (typeof userProfile.health_conditions === 'string') {
      userProfile.health_conditions = JSON.parse(userProfile.health_conditions);
    }
    if (typeof userProfile.equipment === 'string') {
      userProfile.equipment = JSON.parse(userProfile.equipment);
    }
    
    // Fetch user details from users table using email
    const userEmail = userProfile.user_id; // Using the email from profile
    const [userRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, name, email,password, profile_photo, created_at, updated_at FROM users WHERE email = ?',
      [userEmail]
    );
    
    await connection.end();
    
    if (Array.isArray(userRows) && userRows.length > 0) {
      // Merge user details with profile
      const userData = userRows[0];
      const mergedProfile = {
        ...userProfile,
        userData
      };
      
      return NextResponse.json(mergedProfile);
    }
    
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}