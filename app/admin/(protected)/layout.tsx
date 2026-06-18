import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminLayoutClient from '../admin-layout-client';

export const dynamic = 'force-dynamic';

/**
 * Protected Route Group Layout
 * Handles /admin/(protected)/* routes (dashboard, products, categories, settings)
 * Requires valid Appwrite session
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  // Check authentication
  const session = await getSession();
  
  if (!session) {
    // Redirect to login if no session
    redirect('/admin/login');
  }

  // If user is authenticated, wrap with sidebar UI
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
