import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Log the email being searched for
    console.log(`Attempting login for email: ${email}`);
    
    // Connect to MongoDB
    const db = await connectDB();
    
    // Check if users collection exists and has data
    const collections = await db.listCollections().toArray();
    const hasUsersCollection = collections.some(col => col.name === 'users');
    
    if (!hasUsersCollection) {
      console.error('Users collection does not exist in the database');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }
    
    // Check if user exists using MongoDB query (case insensitive)
    const user = await db.collection('users').findOne({ 
      email: { $regex: new RegExp('^' + email + '$', 'i') } 
    });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log(`User found with email: ${email}`);

    // Verify password
    const isPasswordValid = password=== user.password;

    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${email}`);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove password from user object before sending response
    const { password: userPassword, ...userWithoutPassword } = user;

    // Return success response with user data
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}