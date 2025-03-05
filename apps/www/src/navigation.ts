'use client';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'zh'];

export const pathnames = {
    '/': '/',
    '/about': '/about',
    '/resume': '/resume',
    '/contact': '/contact'
};

export const { Link, redirect, usePathname, useRouter } =
    createSharedPathnamesNavigation({ locales, pathnames });
