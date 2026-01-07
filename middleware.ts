// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/kamar",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public route
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;

  if (!accessToken) {
    return redirectToLogin(req);
  }

  // Decode & cek expiry
  let isExpired = false;
  try {
    const decoded = jwt.decode(accessToken) as { exp?: number };
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      isExpired = true;
    }
  } catch {
    isExpired = true;
  }

  if (isExpired) {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: req.cookies.toString(),
        },
      }
    );

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();

      const res = NextResponse.next();
      res.cookies.set("access_token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return res;
    }

    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("session", "expired");
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
