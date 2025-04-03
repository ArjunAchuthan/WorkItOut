import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcrypt';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const db = await connectDB();
    
    // Check if user exists
    const [users] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      await db.end();
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Compare password with hashed password
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      await db.end();
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await db.end();
    
    return NextResponse.json(
      { message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}