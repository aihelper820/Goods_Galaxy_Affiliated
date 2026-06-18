import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const USER_ID_COOKIE_NAME = 'gga_user_id';

export async function POST() {
  try {
    console.log('[API] Logout called');

    // Clear the user ID cookie
    const cookieStore = await cookies();
    cookieStore.delete(USER_ID_COOKIE_NAME);
    
    console.log('[API] User ID cookie deleted');

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Logout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Logout failed' },
      { status: 500 }
    );
  }
}
