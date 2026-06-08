"use client";

import React from "react";

const SunlightBeams = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Sun Glow */}
            <div 
                className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,var(--color-cafe-accent,rgba(212,163,115,0.25))_0%,transparent_70%)] blur-3xl transition-opacity duration-300" 
                style={{ opacity: 'var(--sun-glow-opacity, 0.35)' }}
            />
            
            {/* Ambient Sunshine overlay */}
            <div 
                className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#b5835a]/5 via-transparent to-transparent transition-opacity duration-300"
                style={{
                    opacity: 'var(--sun-glow-opacity, 0.35)'
                }}
            />
            
            {/* Sunlight Beams / Light Rays */}
            <div 
                className="absolute inset-0 origin-top-left animate-sunshine transition-all duration-300"
                style={{ 
                    mixBlendMode: 'var(--sun-beams-blend, multiply)' as any,
                    opacity: 'var(--sun-beams-opacity, 0.12)' 
                }}
            >
                {/* Ray 1 */}
                <div className="absolute top-0 left-0 w-[16%] h-[200%] bg-gradient-to-r from-transparent via-[rgba(212,163,115,0.35)] to-transparent rotate-[34deg] origin-top-left blur-md" />
                {/* Ray 2 */}
                <div className="absolute top-0 left-[10%] w-[7%] h-[200%] bg-gradient-to-r from-transparent via-[rgba(212,163,115,0.25)] to-transparent rotate-[38deg] origin-top-left blur-sm" />
                {/* Ray 3 */}
                <div className="absolute top-0 left-[24%] w-[22%] h-[200%] bg-gradient-to-r from-transparent via-[rgba(212,163,115,0.3)] to-transparent rotate-[31deg] origin-top-left blur-lg" />
                {/* Ray 4 */}
                <div className="absolute top-0 left-[45%] w-[10%] h-[200%] bg-gradient-to-r from-transparent via-[rgba(212,163,115,0.2)] to-transparent rotate-[36deg] origin-top-left blur-md" />
            </div>
        </div>
    );
};

export default SunlightBeams;
