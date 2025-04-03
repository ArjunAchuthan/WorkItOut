import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, age, weight, height, userId, currentEmail } = await request.json();
    
    if (!name || !email || !age || !weight || !height || !userId || !currentEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const connection = await connectDB();
    
    try {
      // Begin transaction
      await connection.beginTransaction();
      
      // Update users table
      await connection.execute(
        'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, email, userId]
      );
      
      // Update survey_responses table
      await connection.execute(
        'UPDATE survey_responses SET weight = ?, height = ?, age = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [weight, height, age, currentEmail]
      );
      
      // If email changed, update the user_id reference in survey_responses
      if (email !== currentEmail) {
        await connection.execute(
          'UPDATE survey_responses SET user_id = ? WHERE user_id = ?',
          [email, currentEmail]
        );
      }
      
      await connection.commit();
      connection.end();
      
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      await connection.rollback();
      connection.end();
      throw error;
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}