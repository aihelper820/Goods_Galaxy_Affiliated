import { ReactNode } from 'react';

/**
 * Auth Route Group Layout
 * Handles /admin/(auth)/* routes (login, signup, etc.)
 * No authentication required
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
