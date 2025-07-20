// File: app/admin/login/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn, useSession }          from 'next-auth/react';
import { useRouter }                   from 'next/navigation';

export default function AdminLoginPage() {
  const { status } = useSession();
  const router     = useRouter();

  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const userRef = useRef(null);          // auto-focus

  /* already authenticated → redirect */
  useEffect(() => {
    if (status === 'authenticated') router.replace('/admin/upload');
  }, [status, router]);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  /* handle sign-in */
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      redirect : false,
      username : form.username.trim(),
      password : form.password,
      callbackUrl: '/admin/upload',
    });

    setLoading(false);

    if (res?.error) {
      // Map common NextAuth error to friendly text
      const friendly =
        res.error === 'CredentialsSignin'
          ? 'Invalid username or password'
          : res.error;
      setError(friendly);
    } else if (res?.ok) {
      router.replace(res.url || '/admin/upload');
    } else {
      setError('Unexpected error. Please try again.');
    }
  };

  const disabled = loading || !form.username || !form.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Admin Login</h2>

        <input
          ref={userRef}
          name="username"
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        <button
          type="submit"
          disabled={disabled}
          className={`w-full py-2 rounded text-white transition
            ${disabled
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'}
          `}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
