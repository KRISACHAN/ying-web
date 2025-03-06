import { defaultLocale, locales } from '@/lib/i18n';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // 获取请求路径
    const { pathname } = request.nextUrl;

    // 检查路径是否已经包含有效的语言代码
    const pathnameHasLocale = locales.some(
        locale =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    // 如果路径不包含语言代码，重定向到默认语言
    if (!pathnameHasLocale) {
        return NextResponse.redirect(
            new URL(
                `/${defaultLocale}${pathname === '/' ? '' : pathname}`,
                request.url,
            ),
        );
    }
}

// 配置匹配的路径
export const config = {
    matcher: [
        // 排除不需要重定向的路径
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)',
    ],
};
