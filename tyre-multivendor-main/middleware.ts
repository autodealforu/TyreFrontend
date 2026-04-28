import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /checkout, /account)
  const pathname = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ["/checkout", "/account", "/order-confirmation", "/vendor/dashboard"]

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Get the token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: ["/checkout/:path*", "/account/:path*", "/order-confirmation/:path*", "/vendor/dashboard/:path*"],
}
