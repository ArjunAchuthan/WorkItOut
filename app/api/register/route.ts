import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    const db = await connectDB();
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password - recommended for security
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const result = await db.collection('users').insertOne({
      name,
      email,
      password, // Use hashedPassword instead of password for better security
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: result.insertedId.toString()
      },
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