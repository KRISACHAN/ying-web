'use client';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type QRCodePopoverProps = {
    children?: React.ReactNode;
    qrCodeImage: string;
    title?: string;
};

export default function QRCodePopover({
    children,
    qrCodeImage,
    title,
}: QRCodePopoverProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkIfMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // For mobile devices, use Dialog
    if (isMobile) {
        return (
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="w-[300px] sm:w-[425px]">
                    {title && (
                        <DialogTitle className="text-center text-blue-600">
                            {title}
                        </DialogTitle>
                    )}
                    <div className="flex justify-center">
                        <Image
                            src={qrCodeImage}
                            alt={`${title ?? ''} QR Code`}
                            width={250}
                            height={250}
                            className="rounded-md"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // For desktop, use HoverCard
    return (
        <HoverCard>
            {children && (
                <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            )}
            <HoverCardContent className="w-[300px]">
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <Image
                        src={qrCodeImage}
                        alt={`${title} QR Code`}
                        width={200}
                        height={200}
                        className="rounded-md"
                    />
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
