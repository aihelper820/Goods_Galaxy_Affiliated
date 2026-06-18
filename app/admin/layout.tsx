import { ReactNode } from 'react';

/**
 * Admin Root Layout
 * Wraps all admin routes: /admin/(auth)/* and /admin/(protected)/*
 * Authentication is handled by individual route group layouts
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
