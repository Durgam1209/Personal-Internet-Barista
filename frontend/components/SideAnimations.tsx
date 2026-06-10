"use client";

import React from "react";

// Coffee Bean SVG path component
export const CoffeeBeanSVG = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.8 2 2.5 6.8 2.5 12C2.5 17.2 6.8 21.5 12,21.5 C17.2,21.5 21.5,17.2 21.5,12 C21.5,6.8 17.2,2 12,2 Z" />
        <path d="M12 4C9 9 15 15 12 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" className="opacity-45" />
    </svg>
);

// Tea Leaf SVG path component
export const TeaLeafSVG = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 22C2 22 7 17 8 13C9 9 14 5 22 2C22 2 18 10 14 13C10 16 2 22 2 22Z" />
        <path d="M2 22C9 15 15 11 18 8" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" className="opacity-45" />
    </svg>
);

// Side floating animation container
export const SideAnimations = () => {
    // Left particles restricted strictly to the left margin (2% to 15%)
    const leftParticles = [
        { id: 'l1', type: 'bean', size: 16, delay: 0, duration: 20, left: '2%', maxOpacity: 0.35, drift: 8 },
        { id: 'l2', type: 'leaf', size: 24, delay: 4, duration: 27, left: '8%', maxOpacity: 0.25, drift: -6 },
        { id: 'l3', type: 'bean', size: 20, delay: 9, duration: 23, left: '14%', maxOpacity: 0.3, drift: 10 },
        { id: 'l4', type: 'leaf', size: 18, delay: 14, duration: 30, left: '5%', maxOpacity: 0.2, drift: -8 },
        { id: 'l5', type: 'bean', size: 14, delay: 19, duration: 25, left: '11%', maxOpacity: 0.35, drift: 5 },
    ];

    // Right particles restricted strictly to the right margin (2% to 15%)
    const rightParticles = [
        { id: 'r1', type: 'leaf', size: 22, delay: 2, duration: 25, right: '3%', maxOpacity: 0.3, drift: -8 },
        { id: 'r2', type: 'bean', size: 18, delay: 6, duration: 22, right: '9%', maxOpacity: 0.35, drift: 10 },
        { id: 'r3', type: 'leaf', size: 20, delay: 11, duration: 29, right: '14%', maxOpacity: 0.25, drift: -6 },
        { id: 'r4', type: 'bean', size: 15, delay: 16, duration: 24, right: '6%', maxOpacity: 0.35, drift: 8 },
        { id: 'r5', type: 'leaf', size: 25, delay: 21, duration: 32, right: '11%', maxOpacity: 0.2, drift: -10 },
    ];

    return (
        <>
            {/* Left side container */}
            <div className="fixed left-0 top-0 bottom-0 w-[60px] md:w-[120px] pointer-events-none overflow-hidden z-20">
                {leftParticles.map(p => (
                    <div
                        key={p.id}
                        className="absolute bottom-[-50px] animate-float-up"
                        style={{
                            left: p.left,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            '--delay': `${p.delay}s`,
                            '--duration': `${p.duration}s`,
                            '--drift-x': `${p.drift}px`,
                            '--rot-deg': `${360 * (p.drift > 0 ? 1 : -1)}deg`,
                            '--max-opacity': p.maxOpacity,
                        } as any}
                    >
                        {p.type === 'bean' ? (
                            <CoffeeBeanSVG className="text-cafe-accent w-full h-full" />
                        ) : (
                            <TeaLeafSVG className="text-cafe-leaf w-full h-full" />
                        )}
                    </div>
                ))}
            </div>

            {/* Right side container */}
            <div className="fixed right-0 top-0 bottom-0 w-[60px] md:w-[120px] pointer-events-none overflow-hidden z-20">
                {rightParticles.map(p => (
                    <div
                        key={p.id}
                        className="absolute bottom-[-50px] animate-float-up"
                        style={{
                            right: p.right,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            '--delay': `${p.delay}s`,
                            '--duration': `${p.duration}s`,
                            '--drift-x': `${p.drift}px`,
                            '--rot-deg': `${360 * (p.drift > 0 ? 1 : -1)}deg`,
                            '--max-opacity': p.maxOpacity,
                        } as any}
                    >
                        {p.type === 'bean' ? (
                            <CoffeeBeanSVG className="text-cafe-accent w-full h-full" />
                        ) : (
                            <TeaLeafSVG className="text-cafe-leaf w-full h-full" />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default SideAnimations;
