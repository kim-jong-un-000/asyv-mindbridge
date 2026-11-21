import React, { useEffect, useState, useRef } from 'react';
import { ASSETS } from '../../utils/assets';

interface AnimatedAsyvBackgroundProps {
  className?: string;
  variant?: 'full' | 'subtle' | 'auth' | 'admin';
  showLogoWatermark?: boolean;
}

/**
 * AnimatedAsyvBackground
 *
 * A crisp, well-seen, premium background with ZERO BLUR reflecting the Agahozo-Shalom
 * Youth Village's core identity: hope, community, youth empowerment, education, and healing.
 *
 * Strictly uses ASYV official brand colors:
 * - Acacia Hillside Green (#245934, #1b4327) - life, healing, and Rwandan rolling hills
 * - Liquidnet Solar Gold (#eec149, #f59e0b) - light, academic excellence, sunrise optimism
 * - Village Earth Clay / Warm Terracotta (#8B5A2B, #d95f18) - family homes, solidarity
 * - Lake Muhazi Azure Sky (#0284c7, #0369a1) - serenity, reflection, and peace
 *
 * For Admin (`variant="admin"`):
 * - 100% Crisp Executive Administrative Command Matrix (Zero cartoon hills, zero floating badges)
 * - Precision architectural blueprint grid with intersection crosshairs
 * - Corner institutional brackets and coordinate markers
 * - Traditional Rwandan Imigongo geometric CAD lines
 * - High-precision official ASYV architectural watermark seal
 *
 * 100% Crisp & Well-Seen:
 * - No blur filters, no fuzzy orbs, no hazy fog
 * - Distinct, sharp lines, zero blur
 */
export const AnimatedAsyvBackground: React.FC<AnimatedAsyvBackgroundProps> = ({
  className = '',
  variant = 'full',
  showLogoWatermark = true
}) => {
  const isAdmin = variant === 'admin';
  const isAuth = variant === 'auth';

  // Responsive, subtle mouse parallax with dampening
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const targetParallax = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (prefersReducedMotion || !isFinePointer) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth - 0.5) * 2;
      const normalizedY = (e.clientY / innerHeight - 0.5) * 2;
      
      targetParallax.current = {
        x: normalizedX * (isAdmin ? 8 : 16),
        y: normalizedY * (isAdmin ? 6 : 14)
      };
    };

    let active = true;
    const animate = () => {
      if (!active) return;
      setParallax((prev) => {
        const dx = targetParallax.current.x - prev.x;
        const dy = targetParallax.current.y - prev.y;
        if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
          return prev;
        }
        return {
          x: prev.x + dx * 0.04,
          y: prev.y + dy * 0.04
        };
      });
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isAdmin]);

  // =========================================================================
  // ADMIN EXECUTIVE COMMAND CENTER BACKGROUND (Zero Blur, Technical, Dignified)
  // =========================================================================
  if (isAdmin) {
    return (
      <div
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 transition-opacity duration-1000 ease-out ${className}`}
      >
        {/* 1. Base Executive Deep Obsidian-Emerald Slate Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4f8f5] via-[#eaf2ec] to-[#dfece3] dark:from-[#06140c] dark:via-[#0c1f14] dark:to-[#040e08]" />

        {/* 2. Precision Architectural Blueprint Grid (SVG Pattern, Zero Blur) */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <defs>
            {/* Minor 48px Grid */}
            <pattern id="admin-blueprint-minor" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#245934" strokeWidth="0.8" strokeOpacity="0.4" />
              <path d="M 24 21 L 24 27 M 21 24 L 27 24" fill="none" stroke="#eec149" strokeWidth="0.8" strokeOpacity="0.3" />
            </pattern>
            {/* Major 192px Coordinate Grid */}
            <pattern id="admin-blueprint-major" width="192" height="192" patternUnits="userSpaceOnUse">
              <rect width="192" height="192" fill="url(#admin-blueprint-minor)" />
              <path d="M 192 0 L 0 0 0 192" fill="none" stroke="#387a4c" strokeWidth="1.2" strokeOpacity="0.6" />
              <circle cx="0" cy="0" r="3" fill="#eec149" fillOpacity="0.7" />
              <circle cx="192" cy="0" r="3" fill="#eec149" fillOpacity="0.7" />
              <circle cx="0" cy="192" r="3" fill="#eec149" fillOpacity="0.7" />
              <circle cx="192" cy="192" r="3" fill="#eec149" fillOpacity="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-blueprint-major)" />
        </svg>

        {/* 3. Perimeter Institutional Engineering Markers & Coordinate Brackets */}
        <div
          className="absolute inset-4 sm:inset-8 border border-[#245934]/30 pointer-events-none transition-transform duration-1000"
          style={{
            transform: `translate3d(${parallax.x * 0.25}px, ${parallax.y * 0.25}px, 0)`
          }}
        >
          {/* Top-Left Bracket */}
          <div className="absolute -top-1 -left-1 flex flex-col">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M 0 30 L 0 0 L 30 0" stroke="#eec149" strokeWidth="2.5" />
            </svg>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#eec149]/80 pl-1 font-bold">
              [ASYV · MASTER ADMIN COMMAND]
            </div>
          </div>

          {/* Top-Right Bracket */}
          <div className="absolute -top-1 -right-1 flex flex-col items-end">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M 10 0 L 40 0 L 40 30" stroke="#eec149" strokeWidth="2.5" />
            </svg>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-emerald-300/80 pr-1 font-bold">
              [CLOUD SQL POSTGRESQL · EUROPE-WEST2]
            </div>
          </div>

          {/* Bottom-Left Bracket */}
          <div className="absolute -bottom-1 -left-1 flex flex-col-reverse">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M 0 10 L 0 40 L 30 40" stroke="#eec149" strokeWidth="2.5" />
            </svg>
            <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-emerald-300/80 pl-1 font-bold">
              [GRADES: INGABE · INGABO · IJABO]
            </div>
          </div>

          {/* Bottom-Right Bracket */}
          <div className="absolute -bottom-1 -right-1 flex flex-col-reverse items-end">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M 10 40 L 40 40 L 40 10" stroke="#eec149" strokeWidth="2.5" />
            </svg>
            <div className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#eec149]/80 pr-1 font-bold">
              [STATUS: REPOSITORY SYNCHRONIZED]
            </div>
          </div>
        </div>

        {/* 4. Traditional Rwandan Imigongo Geometric Engineering Borders (Crisp Zero Blur) */}
        <div className="absolute left-2 top-24 bottom-24 w-6 hidden xl:block opacity-25">
          <svg className="w-full h-full" viewBox="0 0 24 800" preserveAspectRatio="none" fill="none">
            {Array.from({ length: 16 }).map((_, i) => (
              <polygon
                key={i}
                points={`12,${i * 50} 24,${i * 50 + 25} 12,${i * 50 + 50} 0,${i * 50 + 25}`}
                stroke="#eec149"
                strokeWidth="1.2"
                fill="none"
              />
            ))}
          </svg>
        </div>

        <div className="absolute right-2 top-24 bottom-24 w-6 hidden xl:block opacity-25">
          <svg className="w-full h-full" viewBox="0 0 24 800" preserveAspectRatio="none" fill="none">
            {Array.from({ length: 16 }).map((_, i) => (
              <polygon
                key={i}
                points={`12,${i * 50} 24,${i * 50 + 25} 12,${i * 50 + 50} 0,${i * 50 + 25}`}
                stroke="#245934"
                strokeWidth="1.2"
                fill="none"
              />
            ))}
          </svg>
        </div>

        {/* 5. Authoritative ASYV Administrative Seal (Static Watermark, Zero Blur) */}
        {showLogoWatermark && (
          <div
            className="absolute top-1/2 right-12 lg:right-24 -translate-y-1/2 w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] pointer-events-none transition-transform duration-1000"
            style={{
              transform: `translate3d(${parallax.x * -0.3}px, calc(-50% + ${parallax.y * -0.3}px), 0)`
            }}
          >
            <svg viewBox="0 0 500 500" className="w-full h-full opacity-20">
              {/* Concentric Precision Engineering Compass Rings */}
              <circle cx="250" cy="250" r="235" fill="none" stroke="#245934" strokeWidth="2" strokeDasharray="6 6" />
              <circle cx="250" cy="250" r="215" fill="none" stroke="#eec149" strokeWidth="1.5" />
              <circle cx="250" cy="250" r="185" fill="none" stroke="#245934" strokeWidth="1" strokeDasharray="16 8" />
              <circle cx="250" cy="250" r="155" fill="none" stroke="#387a4c" strokeWidth="2" />

              {/* Cardinal Compass Ticks */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1={250 + 215 * Math.cos((deg * Math.PI) / 180)}
                  y1={250 + 215 * Math.sin((deg * Math.PI) / 180)}
                  x2={250 + 235 * Math.cos((deg * Math.PI) / 180)}
                  y2={250 + 235 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#eec149"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* Official ASYV Crest in Core of Administrative Seal */}
            <div className="absolute inset-0 flex items-center justify-center p-20 opacity-25">
              <img
                src={ASSETS.asyvUploadedLogo}
                alt="Agahozo-Shalom Official Seal"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // STUDENT & GENERAL ASYV SCENIC BACKGROUND (Hills, Lake, Sunburst)
  // =========================================================================
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 transition-opacity duration-1000 ease-out ${className}`}
    >
      {/* 1. Base Sky Gradient: Rich, Deep & Non-Blurry */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          isAuth
            ? 'bg-gradient-to-b from-[#f3f8f4] via-[#e7f1ea] to-[#d8e9dd] dark:from-[#0a1e12] dark:via-[#13331c] dark:to-[#1c4827]'
            : 'bg-gradient-to-b from-[#edf4ef] via-[#e2eee5] to-[#d3e5d8] dark:from-[#06120b] dark:via-[#0c2415] dark:to-[#122e1c]'
        }`}
      />

      {/* 2. Crisp Liquidnet Solar Gold Sunburst & Radiating Dawn Arcs (Zero Blur) */}
      <div
        className={`absolute top-0 right-0 sm:right-1/6 w-[560px] h-[560px] pointer-events-none transition-transform duration-1000 ${
          isAuth ? 'opacity-45 dark:opacity-35' : 'opacity-30 dark:opacity-25'
        }`}
        style={{
          transform: `translate3d(${parallax.x * -0.6}px, ${parallax.y * -0.6}px, 0)`
        }}
      >
        <svg viewBox="0 0 500 500" className="w-full h-full animate-asyv-drift-2">
          {/* Solar Core */}
          <circle cx="250" cy="250" r="140" fill="#eec149" fillOpacity={isAuth ? 0.35 : 0.25} />
          <circle cx="250" cy="250" r="200" fill="#f59e0b" fillOpacity={isAuth ? 0.18 : 0.12} />
          {/* Clean Geometric Concentric Rings */}
          <circle cx="250" cy="250" r="230" fill="none" stroke="#eec149" strokeWidth="2.5" strokeOpacity="0.45" strokeDasharray="10 8" />
          <circle cx="250" cy="250" r="260" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="6 6" />
          {/* Radiating Crisp Solar Rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="250"
              y1="250"
              x2={250 + 250 * Math.cos((deg * Math.PI) / 180)}
              y2={250 + 250 * Math.sin((deg * Math.PI) / 180)}
              stroke="#eec149"
              strokeWidth="2"
              strokeOpacity={isAuth ? 0.35 : 0.22}
            />
          ))}
        </svg>
      </div>

      {/* 3. Crisp Scenic Rolling Rwandan Hills & Lake Muhazi Shoreline (Zero Blur) */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${parallax.x * 0.3}px, ${parallax.y * 0.2}px, 0)`
        }}
      >
        <svg
          className="w-full h-[58vh] min-h-[380px]"
          viewBox="0 0 1440 600"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Lake Muhazi Serene Waters Shoreline (#0284c7 / #0369a1) */}
          <path
            d="M0,280 C260,220 540,320 800,250 C1060,180 1280,270 1440,230 L1440,600 L0,600 Z"
            fill={isAuth ? '#0369a1' : '#0284c7'}
            fillOpacity={isAuth ? 0.45 : 0.28}
          />
          {/* Lake Water Surface Waves Accent */}
          <path
            d="M0,310 C320,270 640,350 960,300 C1200,260 1340,320 1440,290"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeOpacity={isAuth ? 0.35 : 0.25}
            strokeDasharray="14 10"
          />

          {/* Layer 2: Rwandan Village Hearth Terracotta Soil (#8B5A2B & #d95f18) */}
          <path
            d="M0,350 C300,280 620,410 940,320 C1180,250 1320,340 1440,310 L1440,600 L0,600 Z"
            fill="#8B5A2B"
            fillOpacity={isAuth ? 0.6 : 0.32}
          />

          {/* Layer 3: Deep Acacia Hillside Forest (#1b4327) */}
          <path
            d="M0,410 C280,360 540,460 840,390 C1140,310 1320,410 1440,380 L1440,600 L0,600 Z"
            fill="#1b4327"
            fillOpacity={isAuth ? 0.9 : 0.65}
          />

          {/* Layer 4: Lush Vibrant Acacia Green Ridge (#245934) with Hill Contour Stripes */}
          <path
            d="M0,470 C360,410 720,510 1080,450 C1280,410 1380,460 1440,440 L1440,600 L0,600 Z"
            fill="#245934"
            fillOpacity={isAuth ? 0.96 : 0.75}
          />

          {/* Hillside Agricultural Terraces Contour Lines (Traditional Rwandan Hillsides) */}
          <path
            d="M0,520 C340,480 700,560 1060,510 C1260,480 1380,520 1440,500"
            stroke="#eec149"
            strokeWidth="2"
            strokeOpacity={isAuth ? 0.35 : 0.25}
          />
          <path
            d="M0,560 C380,530 740,590 1100,550 C1300,530 1400,560 1440,550"
            stroke="#38844f"
            strokeWidth="2.5"
            strokeOpacity={isAuth ? 0.5 : 0.35}
          />
        </svg>
      </div>

      {/* 4. Well-Seen Moving Official ASYV Badge in Upper Left (Sharp, Zero Blur) */}
      {showLogoWatermark && (
        <div
          className="absolute top-6 left-6 sm:top-10 sm:left-12 w-28 h-28 sm:w-40 sm:h-40 pointer-events-none transition-transform duration-1000 animate-asyv-drift-1"
          style={{
            transform: `translate3d(${parallax.x * 0.8}px, ${parallax.y * 0.8}px, 0)`
          }}
        >
          <div className="w-full h-full p-2.5 rounded-2xl bg-white/15 dark:bg-white/10 border-2 border-white/30 dark:border-white/20 shadow-2xl flex items-center justify-center">
            <img
              src={ASSETS.asyvUploadedLogo}
              alt="Official ASYV Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      )}

      {/* 5. Well-Seen Moving Official ASYV Badge in Upper/Mid Right (Sharp, Zero Blur) */}
      {showLogoWatermark && (
        <div
          className="absolute top-10 right-6 sm:top-14 sm:right-14 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none transition-transform duration-1000 animate-asyv-drift-2"
          style={{
            transform: `translate3d(${parallax.x * -0.7}px, ${parallax.y * -0.7}px, 0)`
          }}
        >
          <div className="w-full h-full p-3 rounded-2xl bg-white/15 dark:bg-white/10 border-2 border-[#eec149]/40 shadow-2xl flex items-center justify-center">
            <img
              src={ASSETS.asyvUploadedLogo}
              alt="Official ASYV Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      )}

      {/* 6. Prominent Floating Center ASYV Logo Watermark (Crisp, High Visibility, No Blur) */}
      {showLogoWatermark && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          style={{
            transform: `translate3d(${parallax.x * 0.4}px, ${parallax.y * 0.4}px, 0)`
          }}
        >
          <div
            className={`w-[340px] sm:w-[520px] lg:w-[660px] h-[340px] sm:h-[520px] lg:h-[660px] flex items-center justify-center animate-asyv-watermark transition-all duration-1000 ${
              isAuth
                ? 'opacity-85 dark:opacity-75'
                : 'opacity-40 dark:opacity-35'
            }`}
          >
            <img
              src={ASSETS.asyvUploadedLogo}
              alt="The Agahozo-Shalom Youth Village"
              className="w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.35)] select-none"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
};
