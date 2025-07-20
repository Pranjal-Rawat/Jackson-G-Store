// File: app/api/auth/[...nextauth]/route.js
import NextAuthModule            from 'next-auth';
import CredentialsProviderModule from 'next-auth/providers/credentials';
import bcrypt                    from 'bcryptjs';
import { timingSafeEqual }       from 'crypto';

const NextAuth    = NextAuthModule.default ?? NextAuthModule;
const Credentials = CredentialsProviderModule.default ?? CredentialsProviderModule;
const dev         = process.env.NODE_ENV !== 'production';

/* ── critical envs ─────────────────────────────────────────────── */
const ADMIN_USER  = (process.env.ADMIN_USERNAME ?? '').trim();
const ADMIN_HASH  = (process.env.ADMIN_PASSWORD_HASH ?? '').trim();
const NEXT_SECRET = process.env.NEXTAUTH_SECRET;

if (!(ADMIN_USER && ADMIN_HASH && NEXT_SECRET)) {
  throw new Error('[auth] Missing ADMIN_USERNAME, ADMIN_PASSWORD_HASH, or NEXTAUTH_SECRET');
}

/* constant-time string compare (case-insensitive) */
const safeCompare = (a, b) => {
  const x = Buffer.from(a.toLowerCase());
  const y = Buffer.from(b.toLowerCase());
  return x.length === y.length && timingSafeEqual(x, y);
};

/* ── NextAuth options ──────────────────────────────────────────── */
export const authOptions = {
  secret: NEXT_SECRET,

  providers: [
    Credentials({
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize({ username = '', password = '' }) {
        /* user check */
        if (!safeCompare(username, ADMIN_USER)) {
          throw new Error('Invalid credentials');
        }
        /* password check */
        const ok = await bcrypt.compare(password, ADMIN_HASH);
        if (!ok) throw new Error('Invalid credentials');

        return { id: ADMIN_USER, name: 'Administrator' }; // ✅
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   24 * 60 * 60, // 24 h
    updateAge:30 * 60,      // slide 30 min
  },

  cookies: {
    sessionToken: {
      name: dev ? 'next-auth.session-token' : '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev,
        path: '/',
      },
    },
  },

  pages: { signIn: '/admin/login' },

  /* disable noisy logs unless you flip it on */
  debug: false,
};

/* ── handlers ─────────────────────────────────────────────────── */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
