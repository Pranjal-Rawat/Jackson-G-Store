// middleware.js  ✅ already correct
import { NextResponse } from 'next/server'
import { getToken }     from 'next-auth/jwt'

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // block every /admin/* page unless logged in, but allow /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const login = req.nextUrl.clone()
      login.pathname = '/admin/login'
      return NextResponse.redirect(login)
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
