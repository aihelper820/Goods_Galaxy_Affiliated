'use server';

import { signIn as appwriteSignIn, getSession } from '@/lib/auth';
import { ApiResponse, AdminUser } from '@/lib/types';

export async function loginAction(
  email: string,
  password: string
): Promise<ApiResponse<AdminUser>> {
  console.log('[LOGIN ACTION] Starting login for:', email);
  const response = await appwriteSignIn(email, password);
  console.log('[LOGIN ACTION] Response:', response);
  
  if (response.success) {
    // Wait a moment for cookies to be set
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('[LOGIN ACTION] Login successful, checking session...');
    const session = await getSession();
    console.log('[LOGIN ACTION] Session after login:', session);
  }
  
  return response;
}
