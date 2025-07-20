// File: app/api/auth/[...nextauth]/route.js
import NextAuthModule            from 'next-auth';
import CredentialsProviderModule from 'next-auth/providers/credentials';
import bcrypt                    from 'bcryptjs';
import { timingSafeEqual }       from 'crypto';

const NextAuth    = NextAuthModule.default ?? NextAuthModule;
const Credentials = CredentialsProviderModule.default ?? CredentialsProviderModule;
const dev         = process.env.NODE_ENV !== 'production';

/* ── helpers ────────────────────────────────────────────── */
const safeCompare = (a, b) => {
  const x = Buffer.from(a.toLowerCase());
  const y = Buffer.from(b.toLowerCase());
  return x.length === y.length && timingSafeEqual(x, y);
};

/* ── env pulls ──────────────────────────────────────────── */
const ADMIN_USER  = (process.env.ADMIN_USERNAME      ?? '').trim();
const ADMIN_HASH  = (process.env.ADMIN_PASSWORD_HASH ?? '').trim();
const NEXT_SECRET =  process.env.NEXTAUTH_SECRET         ?? '';

console.log('[auth] env check →', {
  ADMIN_USER_PRESENT : !!ADMIN_USER,
  ADMIN_HASH_LENGTH  : ADMIN_HASH.length,
  NEXT_SECRET_PRESENT: !!NEXT_SECRET,
});

/* ── NextAuth options ───────────────────────────────────── */
export const authOptions = {
  secret: NEXT_SECRET || undefined,

  providers: [
    Credentials({
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize({ username = '', password = '' }) {
        if (!(ADMIN_USER && ADMIN_HASH && NEXT_SECRET)) {
          console.error('[auth] Missing critical env at runtime');
          throw new Error('Server mis-configuration');
        }

        if (!safeCompare(username, ADMIN_USER)) {
          console.warn('[auth] login fail → username NG');
          throw new Error('Invalid credentials');
        }

        const ok = await bcrypt.compare(password, ADMIN_HASH).catch(() => false);
        if (!ok) {
          console.warn('[auth] login fail → bcrypt NG');
          throw new Error('Invalid credentials');
        }

        console.log('[auth] login OK for', ADMIN_USER);
        return { id: ADMIN_USER, name: 'Administrator' };
      },
    }),
  ],

  session: { strategy: 'jwt', maxAge: 24 * 60 * 60, updateAge: 30 * 60 },

  cookies: {
    sessionToken: {
      name: dev ? 'next-auth.session-token' : '__Secure-next-auth.session-token',
      options: { httpOnly: true, sameSite: 'lax', secure: !dev, path: '/' },
    },
  },

  pages: { signIn: '/admin/login' },
  debug: false,
};

/* ── core handler ───────────────────────────────────────── */
const nextAuthHandler = NextAuth(authOptions);

/* ── single GET wrapper avoids duplicate export ─────────── */
export async function GET(req, ctx) {
  // ── OPTIONAL health probe (only in dev / preview) ──
  if (dev && new URL(req.url).searchParams.get('health') === '1') {
    return new Response(
      JSON.stringify({
        ADMIN_USER_PRESENT : !!ADMIN_USER,
        ADMIN_HASH_PRESENT : !!ADMIN_HASH,
        NEXT_SECRET_PRESENT: !!NEXT_SECRET,
        bcryptMatches      : ADMIN_HASH &&
          (await bcrypt.compare('MyN3wP@ss!', ADMIN_HASH).catch(()=>false)),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // normal NextAuth flow
  return nextAuthHandler(req, ctx);
}

/* ── POST stays unchanged ──────────────────────────────── */
export const POST = nextAuthHandler;
