import { defaultLocale, locales } from '@/lib/i18n';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // get request path
    const { pathname } = request.nextUrl;

    // check if the path already contains a valid language code
    const pathnameHasLocale = locales.some(
        locale =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    // if the path does not contain a language code, redirect to the default language
    if (!pathnameHasLocale) {
        return NextResponse.redirect(
            new URL(
                `/${defaultLocale}${pathname === '/' ? '' : pathname}`,
                request.url,
            ),
        );
    }
}

// configure matching paths
export const config = {
    matcher: [
        // exclude paths that do not need to be redirected
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)',
    ],
};
