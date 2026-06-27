import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminEmail } from '@/lib/admin';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  // Authorization, not just authentication: only allow-listed admins (ADMIN_EMAILS)
  // may reach /admin. A merely-authenticated non-admin is treated like a guest and
  // kept on the login page (which also prevents a redirect loop).
  const isAdmin = !!user && isAdminEmail(user.email);
  const isLogin = request.nextUrl.pathname === '/admin/login';

  if (!isAdmin && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }
  if (isAdmin && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = { matcher: ['/admin/:path*'] };
