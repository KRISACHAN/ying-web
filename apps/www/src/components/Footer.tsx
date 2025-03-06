'use client';

import { NAV_LINKS } from '@/lib/constants';
import { Locale } from '@/types';
import QRCodePopover from './QRCodePopover';

type FooterProps = {
    locale: Locale;
    dictionary: any;
};

export default function Footer({ dictionary }: FooterProps) {
    const footer = dictionary.footer;
    const nav = dictionary.nav;
    const contact = dictionary.contact;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold mb-3 flex items-center">
                            <i className="fas fa-code text-blue-400 mr-2"></i>
                            {footer.name}
                        </h2>
                        <p className="text-gray-400 max-w-md">
                            {footer.description}
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        {contact.getInTouch.channels.map((channel: any) => {
                            if (channel.showQRCode) {
                                return (
                                    <QRCodePopover
                                        key={channel.type}
                                        qrCodeImage={channel.qrCodeImage}
                                        title={channel.title}
                                    >
                                        <div
                                            className="w-12 h-12 flex items-center justify-center text-white hover:text-blue-100 transition bg-white/10 p-3 rounded-full hover:bg-white/20 cursor-pointer"
                                            title={channel.title}
                                        >
                                            <i
                                                className={`${channel.icon} text-xl`}
                                            ></i>
                                        </div>
                                    </QRCodePopover>
                                );
                            }

                            return (
                                <a
                                    key={channel.type}
                                    href={channel.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 flex items-center justify-center text-white hover:text-blue-100 transition bg-white/10 p-3 rounded-full hover:bg-white/20"
                                    title={channel.title}
                                >
                                    <i
                                        className={`${channel.icon} text-xl`}
                                    ></i>
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center">
                        <i className="far fa-copyright mr-2"></i>
                        {currentYear} {footer.copyright}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.id}
                                href={link.href}
                                className="hover:text-white transition flex items-center"
                            >
                                <i className={`${link.icon} mr-1`}></i>
                                {nav[link.id]}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
