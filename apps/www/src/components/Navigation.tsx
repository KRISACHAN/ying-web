'use client';

import { NAV_LINKS } from '@/lib/constants';
import { Locale } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

type NavigationProps = {
    locale: Locale;
    dictionary: any;
};

export default function Navigation({ locale, dictionary }: NavigationProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const nav = dictionary.nav;
    const languages = dictionary.languages;

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link
                    href={locale === 'en' ? '/' : '/zh'}
                    className="text-blue-600 font-bold text-xl flex items-center overflow-ellipsis overflow-hidden whitespace-nowrap"
                >
                    <i className="fas fa-code mr-2"></i>
                    {dictionary.hero.name}
                </Link>

                <div className="flex items-center space-x-6">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6">
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.id}
                                href={link.href}
                                className="text-gray-700 hover:text-blue-600 transition flex items-center"
                            >
                                <i className={`${link.icon} mr-1`}></i>
                                {nav[link.id]}
                            </a>
                        ))}
                    </div>

                    {/* Language Switcher */}
                    <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
                        <a
                            href="/en"
                            className={`px-3 py-1 text-sm language-btn flex items-center overflow-ellipsis overflow-hidden whitespace-nowrap ${locale === 'en' ? 'active bg-blue-50 text-blue-600' : 'text-blue-600'}`}
                        >
                            <i className="fas fa-globe-americas mr-1"></i>
                            {languages.en}
                        </a>
                        <a
                            href="/zh"
                            className={`px-3 py-1 text-sm language-btn flex items-center overflow-ellipsis overflow-hidden whitespace-nowrap ${locale === 'zh' ? 'active bg-blue-50 text-blue-600' : 'text-blue-600'}`}
                        >
                            <i className="fas fa-globe-asia mr-1"></i>
                            {languages.zh}
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden text-gray-500 hover:text-blue-600 transition"
                    >
                        <i
                            className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}
                        ></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`${mobileMenuOpen ? '' : 'hidden'} md:hidden bg-white border-t`}
            >
                <div className="container mx-auto px-4 py-2 space-y-1">
                    {NAV_LINKS.map(link => (
                        <a
                            key={link.id}
                            href={link.href}
                            className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded flex items-center"
                            onClick={toggleMobileMenu}
                        >
                            <i
                                className={`${link.icon} mr-2 text-blue-500`}
                            ></i>
                            {nav[link.id]}
                        </a>
                    ))}

                    {/* Mobile language switcher */}
                    <div className="flex py-2 px-4 space-x-4 border-t mt-2 pt-2">
                        <a
                            href="/en"
                            className={
                                locale === 'en'
                                    ? 'text-blue-600 font-medium flex items-center'
                                    : 'text-gray-700 hover:text-blue-600 flex items-center'
                            }
                        >
                            <i className="fas fa-globe-americas mr-1"></i>
                            {languages.en}
                        </a>
                        <a
                            href="/zh"
                            className={
                                locale === 'zh'
                                    ? 'text-blue-600 font-medium flex items-center'
                                    : 'text-gray-700 hover:text-blue-600 flex items-center'
                            }
                        >
                            <i className="fas fa-globe-asia mr-1"></i>
                            {languages.zh}
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
