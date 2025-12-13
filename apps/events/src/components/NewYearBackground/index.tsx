import { useEffect, useRef } from 'react';
import './index.less';

interface NewYearBackgroundProps {
    /** 是否显示星星动效 */
    showStars?: boolean;
    /** 是否显示粒子动效 */
    showParticles?: boolean;
}

export default function NewYearBackground({
    showStars = true,
    showParticles = true,
}: NewYearBackgroundProps) {
    const particlesRef = useRef<HTMLDivElement>(null);
    const starsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 创建星星
        if (showStars && starsRef.current) {
            const starCount = window.innerWidth >= 768 ? 100 : 50;
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.width = `${Math.random() * 2 + 2}px`;
                star.style.height = star.style.width;
                star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
                star.style.animationDelay = `${Math.random() * 3}s`;
                starsRef.current.appendChild(star);
            }
        }
    }, [showStars]);

    useEffect(() => {
        if (!showParticles) return;
        const createParticle = () => {
            if (!particlesRef.current) return;

            const particle = document.createElement('div');
            particle.className = 'particle';

            const startX = Math.random() * window.innerWidth;
            const endX = startX + (Math.random() - 0.5) * 200;
            const duration = 3 + Math.random() * 4;
            const delay = Math.random() * 2;
            const size = 4 + Math.random() * 4;

            const colors = [
                '#a8e6cf',
                '#dcedc1',
                '#ffabab',
                '#ffd3b6',
                '#ff677d',
                '#d7aefb',
                '#c4e17f',
                '#80e1b3',
                '#4caf50',
                '#2d572c',
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.left = `${startX}px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = color;
            particle.style.animation = `float-up ${duration}s ease-in ${delay}s forwards`;
            particle.style.boxShadow = `0 0 10px ${color}`;

            particle.style.setProperty('--end-x', `${endX}px`);

            particlesRef.current.appendChild(particle);

            setTimeout(
                () => {
                    particle.remove();
                },
                (duration + delay) * 1000,
            );
        };

        const interval = setInterval(createParticle, 150);

        return () => clearInterval(interval);
    }, [showParticles]);

    return (
        <>
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(to bottom,
                            rgba(10, 10, 30, 1) 0%,
                            rgba(15, 5, 40, 1) 30%,
                            rgba(20, 10, 50, 1) 60%,
                            rgba(5, 5, 25, 1) 100%)`,
                    }}
                >
                    {showStars && (
                        <div
                            ref={starsRef}
                            className="absolute inset-0 stars-container"
                        ></div>
                    )}
                </div>

                {showParticles && (
                    <div ref={particlesRef} className="absolute inset-0"></div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/10"></div>
            </div>
        </>
    );
}
