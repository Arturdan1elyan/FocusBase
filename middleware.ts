import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // ԿԱՐԵՎՈՐ. getUser()-ը ստուգում է թոքենը սերվերում
  const { data: { user } } = await supabase.auth.getUser()
  console.log("Middleware-ը տեսնում է օգտատիրոջը:", user?.email || "ՈՉ ՈՔ ՉԿԱ");

  // 1. Եթե մարդը մուտք չի գործել ու փորձում է մտնել գլխավոր էջ
  if (!user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Եթե մարդը մուտք է գործել ու փորձում է մտնել login էջ
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/login'],
}