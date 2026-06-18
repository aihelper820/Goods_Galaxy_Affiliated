/**
 * Authentication Module
 * Server-side session management using user ID cookie and Appwrite API key
 */

import 'server-only'
import { cookies } from 'next/headers'
import { users } from './appwrite-server'
import { AdminUser, ApiResponse } from './types'

const USER_ID_COOKIE_NAME = 'gga_user_id'

/**
 * Sign in user with email and password
 * Uses server-side Appwrite API to authenticate
 */
export async function signIn(email: string, password: string): Promise<ApiResponse<AdminUser>> {
  try {
    console.log('[AUTH] SignIn started for:', email);
    
    // Use server-side Appwrite REST API to create a session
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
      console.log('[AUTH] Authentication failed');
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const session = await authResponse.json();
    console.log('[AUTH] Session created with ID:', session.$id);
    
    // Get the user details
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/account`,
      {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
          'Authorization': `Bearer ${session.providerAccessToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      console.log('[AUTH] Failed to get user details');
      return {
        success: false,
        error: 'Failed to retrieve user details',
      };
    }

    const user = await userResponse.json();
    console.log('[AUTH] User authenticated:', user.$id, user.email);
    
    // Store user ID in secure cookie
    const cookieStore = await cookies()
    cookieStore.set(USER_ID_COOKIE_NAME, user.$id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    console.log('[AUTH] User ID cookie set');

    return {
      success: true,
      data: {
        $id: user.$id,
        email: user.email,
        name: user.name,
        $createdAt: user.$createdAt,
      },
    }
  } catch (error) {
    console.error('[AUTH] SignIn error:', error instanceof Error ? error.message : error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign in failed',
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<ApiResponse<null>> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(USER_ID_COOKIE_NAME)
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign out failed',
    }
  }
}

/**
 * Get current session
 * Verifies if user has an active session by checking for the session cookie
 */
export async function getSession(): Promise<{ userId: string; email: string } | null> {
  try {
    console.log('[AUTH] GetSession called');
    const cookieStore = await cookies()
    const userId = cookieStore.get(USER_ID_COOKIE_NAME)
    
    if (!userId?.value) {
      console.log('[AUTH] No user ID cookie found');
      return null
    }
    
    console.log('[AUTH] User ID found, verifying with Appwrite API...');
    
    // Verify the user still exists in Appwrite using API key
    const user = await users.get(userId.value)
    console.log('[AUTH] User verified:', user.email);
    return { userId: user.$id, email: user.email }
  } catch (error) {
    console.log('[AUTH] GetSession error:', error instanceof Error ? error.message : error);
    return null
  }
}

/**
 * Get current admin user
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get(USER_ID_COOKIE_NAME)
    
    if (!userId?.value) {
      return null
    }
    
    const user = await users.get(userId.value)
    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
      $createdAt: user.$createdAt,
    }
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get(USER_ID_COOKIE_NAME)
    
    if (!userId?.value) {
      return false
    }
    
    // Verify with API
    await users.get(userId.value)
    return true
  } catch {
    return false
  }
}
