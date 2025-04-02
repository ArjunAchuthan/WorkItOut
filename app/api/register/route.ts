import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    const db = await connectDB();
    
    // Check if email already exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      await db.end();
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Insert new user
    await db.execute(
      'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [name, email, password]
    );

    await db.end();
    
    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}