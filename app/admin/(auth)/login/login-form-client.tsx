'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

/**
 * Login Form Client Component
 * Submits credentials to server-side API endpoint to avoid CORS issues
 */
export default function LoginFormClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Submitting login request to server');

      // Send credentials to server-side API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      console.log('Login successful, redirecting to dashboard');
      
      // Redirect to dashboard - the cookie is now set server-side
      router.push('/admin/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="panel w-full max-w-md overflow-hidden p-6 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
            <Sparkles size={18} />
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-on-surface">Goods Galaxy Affiliated</h1>
          <p className="mt-2 text-sm text-on-surface-muted">Admin login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            placeholder="admin@gga.com"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            placeholder="•••••••"
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="pointer-events-auto text-on-surface-muted hover:text-on-surface"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {error && (
            <div className="rounded-2xl border border-error/20 bg-error/10 p-4">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} disabled={isLoading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-on-surface-muted">
          Demo credentials: admin@gga.com / Password@123
        </p>
      </div>
    </div>
  );
}
