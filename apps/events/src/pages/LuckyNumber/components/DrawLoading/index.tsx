import { useEffect, useRef, useState } from 'react';

import { Fade, useMediaQuery } from '@mui/material';
import type { LottieRefCurrentProps } from 'lottie-react';

function loadMagicSparkleBurst() {
    return Promise.all([
        import('lottie-react'),
        import('@/animations/magic-sparkle-burst.json'),
    ]);
}

export default function DrawLoading({ active }: { active: boolean }) {
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', {
        noSsr: true,
    });
    const lottie = useRef<LottieRefCurrentProps>(null);
    const [asset, setAsset] =
        useState<Awaited<ReturnType<typeof loadMagicSparkleBurst>>>();

    useEffect(() => {
        if (!active || reducedMotion || asset) return;

        let subscribed = true;
        loadMagicSparkleBurst().then(
            result => {
                if (subscribed) setAsset(result);
            },
            () => {
                // The waiting message stays visible if the animation cannot load.
            },
        );

        return () => {
            subscribed = false;
        };
    }, [active, asset, reducedMotion]);

    const Player = asset?.[0].default;

    if (reducedMotion || !Player || !asset) return null;

    return (
        <Fade
            in={active}
            timeout={{ enter: 0, exit: 320 }}
            easing={{ exit: 'ease-out' }}
            mountOnEnter
            unmountOnExit
        >
            <div className="event-draw-loading" aria-hidden="true">
                <Player
                    className="event-draw-loading__art"
                    animationData={asset[1].default}
                    loop
                    lottieRef={lottie}
                    onDOMLoaded={() => lottie.current?.setSpeed(0.55)}
                />
            </div>
        </Fade>
    );
}
