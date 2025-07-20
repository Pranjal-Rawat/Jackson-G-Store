// File: app/api/auth/[...nextauth]/route.js
import NextAuthModule            from 'next-auth';
import CredentialsProviderModule from 'next-auth/providers/credentials';
import bcrypt                    from 'bcryptjs';
import { timingSafeEqual }       from 'crypto';

const NextAuth    = NextAuthModule.default ?? NextAuthModule;
const Credentials = CredentialsProviderModule.default ?? CredentialsProviderModule;
const dev         = process.env.NODE_ENV !== 'production';

/* ── helpers ──────────────────────────────────────────────── */
const safeCompare = (a, b) => {
  const x = Buffer.from(a.toLowerCase());
  const y = Buffer.from(b.toLowerCase());
  return x.length === y.length && timingSafeEqual(x, y);
};

/* ── env pulls ─────────────────────────────────────────────── */
const ADMIN_USER  = (process.env.ADMIN_USERNAME      ?? '').trim();
const ADMIN_HASH  = (process.env.ADMIN_PASSWORD_HASH ?? '').trim();
const NEXT_SECRET =  process.env.NEXTAUTH_SECRET         ?? '';

/* log once on cold-start (hash length only) */
console.log('[auth] env check →', {
  ADMIN_USER_PRESENT : !!ADMIN_USER,
  ADMIN_HASH_LENGTH  : ADMIN_HASH.length,
  NEXT_SECRET_PRESENT: !!NEXT_SECRET,
});

/* ── NextAuth options ─────────────────────────────────────── */
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
        /* runtime guard */
        if (!(ADMIN_USER && ADMIN_HASH && NEXT_SECRET)) {
          console.error('[auth] Missing critical env at runtime');
          throw new Error('Server mis-configuration');
        }

        /* username */
        if (!safeCompare(username, ADMIN_USER)) {
          console.warn('[auth] login fail → username NG', { username });
          throw new Error('Invalid credentials');
        }

        /* password */
        let ok = false;
        try { ok = await bcrypt.compare(password, ADMIN_HASH); }
        catch (e) {
          console.error('[auth] bcrypt error', e);
          throw new Error('Auth error');
        }
        if (!ok) {
          console.warn('[auth] login fail → bcrypt NG');
          throw new Error('Invalid credentials');
        }

        console.log('[auth] login OK for', ADMIN_USER);
        return { id: ADMIN_USER, name: 'Administrator' };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   24 * 60 * 60,
    updateAge:30 * 60,
  },

  cookies: {
    sessionToken: {
      name: dev ? 'next-auth.session-token'
                : '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure  : !dev,
        path    : '/',
      },
    },
  },

  pages: { signIn: '/admin/login' },
  debug: false,
};

/* export handlers ------------------------------------------------ */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/* ── lightweight health probe (dev/preview only) ───────────────── */
export const dynamic = 'force-dynamic';   // Vercel edge caches otherwise
export async function GET(req, ctx) {
  if (!dev) return handler(req, ctx);     // prod → normal NextAuth

  // /api/auth/[...nextauth]?health=1 returns env sanity
  if (new URL(req.url).searchParams.get('health')) {
    return new Response(
      JSON.stringify({
        ADMIN_USER      : !!ADMIN_USER,
        ADMIN_HASH      : !!ADMIN_HASH,
        NEXT_SECRET     : !!NEXT_SECRET,
        bcryptMatches   : ADMIN_HASH && await bcrypt.compare('MyN3wP@ss!', ADMIN_HASH).catch(()=>false)
      }),
      { status:200, headers:{'Content-Type':'application/json'} }
    );
  }
  return handler(req, ctx);
}
