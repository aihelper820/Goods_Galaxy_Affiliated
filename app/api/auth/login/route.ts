import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { users } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';

const USER_ID_COOKIE_NAME = 'gga_user_id';

/**
 * POST /api/auth/login
 * Server-side authentication endpoint
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API] Login POST called');

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('[API] Authenticating user:', email);

    // Create session via Appwrite REST API
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account/sessions/email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
          'X-Appwrite-Key': process.env.APPWRITE_API_KEY || '',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      console.log('[API] Authentication failed:', errorData);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const session = await authResponse.json();
    console.log('[API] Session created:', session.$id);

    // Get user details from Appwrite users list by email
    const usersList = await users.list([Query.equal('email', email)]);
    
    if (!usersList.users || usersList.users.length === 0) {
      console.log('[API] User not found in Appwrite users');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const user = usersList.users[0];
    console.log('[API] User logged in:', user.email, 'ID:', user.$id);

    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set(USER_ID_COOKIE_NAME, user.$id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    console.log('[API] User ID cookie set');

    return NextResponse.json(
      {
        success: true,
        user: {
          $id: user.$id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
