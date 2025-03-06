'use client';

import { Locale } from '@/types';
import QRCodePopover from './QRCodePopover';

type ContactSectionProps = {
    locale: Locale;
    dictionary: any;
};

export default function ContactSection({ dictionary }: ContactSectionProps) {
    const contact = dictionary.contact;

    return (
        <section id="contact" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
                    {contact.title}
                    <span className="block w-24 h-1 bg-blue-500 mx-auto mt-4"></span>
                </h2>

                <div className="mx-auto">
                    {/* Contact Information */}
                    <div className="bg-blue-50 rounded-lg p-8 shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <i className="fas fa-address-card text-blue-500 mr-3"></i>
                            {contact.getInTouch.title}
                        </h3>
                        <p className="text-gray-600 mb-8">
                            {contact.getInTouch.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contact.getInTouch.channels.map(
                                (channel: any, index: number) => {
                                    if (channel.showQRCode) {
                                        return (
                                            <QRCodePopover
                                                key={index}
                                                qrCodeImage={
                                                    channel.qrCodeImage
                                                }
                                                title={channel.title}
                                            >
                                                <div className="flex items-start hover:transform hover:translate-x-1 transition-transform duration-300 cursor-pointer">
                                                    <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white p-3 rounded-full mr-4 shadow-md">
                                                        <i
                                                            className={`${channel.icon}`}
                                                        ></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-800">
                                                            {channel.title}
                                                        </h4>
                                                        <p className="text-gray-600">
                                                            {channel.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            </QRCodePopover>
                                        );
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-start hover:transform hover:translate-x-1 transition-transform duration-300"
                                        >
                                            <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white p-3 rounded-full mr-4 shadow-md">
                                                <i
                                                    className={`${channel.icon}`}
                                                ></i>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">
                                                    {channel.title}
                                                </h4>
                                                {channel.link ? (
                                                    <a
                                                        href={channel.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {channel.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-gray-600">
                                                        {channel.value}
                                                    </p>
                                                )}
                                                {channel.items && (
                                                    <div className="mt-1 flex flex-wrap gap-2">
                                                        {channel.items.map(
                                                            (
                                                                item: any,
                                                                i: number,
                                                            ) => (
                                                                <a
                                                                    key={i}
                                                                    href={
                                                                        item.link
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-600 hover:underline mr-3"
                                                                >
                                                                    {item.title}
                                                                </a>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
