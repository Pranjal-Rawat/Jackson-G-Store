// File: app/api/auth/[...nextauth]/route.js
import NextAuthModule            from 'next-auth';
import CredentialsProviderModule from 'next-auth/providers/credentials';
import bcrypt                    from 'bcryptjs';
import { timingSafeEqual }       from 'crypto';

const NextAuth    = NextAuthModule.default ?? NextAuthModule;
const Credentials = CredentialsProviderModule.default ?? CredentialsProviderModule;
const dev         = process.env.NODE_ENV !== 'production';

/* helpers ------------------------------------------------------- */
const safeCompare = (a, b) => {
  const x = Buffer.from(a.toLowerCase());
  const y = Buffer.from(b.toLowerCase());
  return x.length === y.length && timingSafeEqual(x, y);
};

/* env pulls (may be empty at build-time) ------------------------ */
const ADMIN_USER_ENV  = process.env.ADMIN_USERNAME  ?? '';
const ADMIN_HASH_ENV  = process.env.ADMIN_PASSWORD_HASH ?? '';
const NEXT_SECRET_ENV = process.env.NEXTAUTH_SECRET  ?? '';

/* NextAuth options --------------------------------------------- */
export const authOptions = {
  // secret may be empty in CI, but must be present in runtime env
  secret: NEXT_SECRET_ENV || undefined,

  providers: [
    Credentials({
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize({ username = '', password = '' }) {
        /* runtime validation of critical secrets */
        if (!(ADMIN_USER_ENV && ADMIN_HASH_ENV && NEXT_SECRET_ENV)) {
          console.error(
            '[auth] Missing ADMIN_USERNAME, ADMIN_PASSWORD_HASH, or NEXTAUTH_SECRET'
          );
          throw new Error('Server mis-configuration');
        }

        /* username (constant-time) */
        if (!safeCompare(username, ADMIN_USER_ENV.trim())) {
          throw new Error('Invalid credentials');
        }

        /* password */
        const ok = await bcrypt.compare(password, ADMIN_HASH_ENV.trim());
        if (!ok) throw new Error('Invalid credentials');

        return { id: ADMIN_USER_ENV.trim(), name: 'Administrator' };
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
  debug: false,
};

/* handlers ------------------------------------------------------ */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
