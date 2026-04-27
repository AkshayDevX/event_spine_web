/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */
"use client";

import FloatingParticles from "@/components/layout/not-found/floating-particles";
import { Button } from "@heroui/react";
import { animate, createScope, createTimeline, stagger } from "animejs";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";

export default function NotFound() {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      /* ─── Main entrance timeline ─── */
      const tl = createTimeline({
        defaults: { ease: "outExpo" },
      });

      // Glitch text reveal
      tl.add(
        ".nf-digit",
        {
          y: [120, 0],
          opacity: [0, 1],
          scale: [0.6, 1],
          duration: 1000,
          delay: stagger(150),
        },
        0,
      );

      // Subtitle text slide up
      tl.add(
        ".nf-subtitle",
        {
          y: [40, 0],
          opacity: [0, 1],
          duration: 800,
        },
        "-=400",
      );

      // Description fade
      tl.add(
        ".nf-description",
        {
          y: [25, 0],
          opacity: [0, 1],
          duration: 700,
        },
        "-=500",
      );

      // Buttons stagger in
      tl.add(
        ".nf-action",
        {
          y: [30, 0],
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 600,
          delay: stagger(120),
        },
        "-=400",
      );

      // Decorative lines sweep in
      tl.add(
        ".nf-line",
        {
          scaleX: [0, 1],
          opacity: [0, 0.6],
          duration: 900,
          delay: stagger(200),
        },
        "-=600",
      );

      /* ─── Continuous floating particles ─── */
      animate(".nf-particle", {
        y: [
          { to: -20, duration: 2500 },
          { to: 0, duration: 2500 },
        ],
        opacity: [
          { to: 1, duration: 1200 },
          { to: 0.3, duration: 1300 },
        ],
        loop: true,
        alternate: true,
        delay: stagger(400, { start: 800 }),
        ease: "inOutSine",
      });

      /* ─── Glitch flicker on the "4" digits ─── */
      animate(".nf-glitch-target", {
        x: [
          { to: -3, duration: 50 },
          { to: 3, duration: 50 },
          { to: -1, duration: 50 },
          { to: 0, duration: 50 },
        ],
        loop: true,
        loopDelay: 3000,
        ease: "linear",
      });

      /* ─── Pulsing glow ring around the "0" ─── */
      animate(".nf-pulse-ring", {
        scale: [1, 1.3],
        opacity: [0.5, 0],
        duration: 2000,
        loop: true,
        ease: "outQuad",
      });

      /* ─── Circuit line dash animation ─── */
      animate(".nf-circuit-path", {
        strokeDashoffset: [1000, 0],
        duration: 4000,
        loop: true,
        ease: "linear",
      });

      /* ─── Scanline sweep ─── */
      animate(".nf-scanline", {
        y: ["-100%", "800%"],
        duration: 6000,
        loop: true,
        ease: "linear",
      });
    });

    return () => scope.current?.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* ─── Scanline overlay ─── */}
      <div
        className="nf-scanline pointer-events-none absolute left-0 z-10 h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.65 0.25 290 / 0.3), oklch(0.8 0.15 200 / 0.2), transparent)",
          top: 0,
        }}
      />

      {/* ─── Circuit SVG background ─── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Circuit SVG background</title>
        <defs>
          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.25 290)" />
            <stop offset="100%" stopColor="oklch(0.8 0.15 200)" />
          </linearGradient>
        </defs>
        {/* Circuit paths */}
        <path
          className="nf-circuit-path"
          d="M0,200 H300 V400 H600 V200 H900 V500 H1200"
          fill="none"
          stroke="url(#circuitGrad)"
          strokeWidth="1.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        <path
          className="nf-circuit-path"
          d="M0,500 H200 V300 H500 V600 H800 V350 H1100 V700"
          fill="none"
          stroke="url(#circuitGrad)"
          strokeWidth="1"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        <path
          className="nf-circuit-path"
          d="M100,0 V150 H400 V450 H700 V250 H1000 V650"
          fill="none"
          stroke="url(#circuitGrad)"
          strokeWidth="1"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        {/* Circuit node dots */}
        {[
          [300, 200],
          [600, 400],
          [900, 200],
          [200, 500],
          [500, 300],
          [800, 600],
          [400, 450],
          [700, 250],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="3"
            fill="url(#circuitGrad)"
            opacity="0.5"
          />
        ))}
      </svg>

      {/* ─── Floating particles ─── */}
      <Suspense>
        <FloatingParticles />
      </Suspense>
      {/* ─── Main content ─── */}
      <div className="relative z-20 flex flex-col items-center text-center">
        {/* Decorative top line */}
        <div
          className="nf-line mb-10 h-[1px] w-48 origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.65 0.25 290), transparent)",
            opacity: 0,
          }}
        />

        {/* ─── 404 Digits ─── */}
        <div className="relative mb-6 flex items-center gap-2 select-none sm:gap-4">
          {/* First "4" */}
          <span
            className="nf-digit nf-glitch-target font-mono text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]"
            style={{
              opacity: 0,
              background:
                "linear-gradient(135deg, oklch(0.65 0.25 290), oklch(0.8 0.15 200))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: "drop-shadow(0 0 30px oklch(0.65 0.25 290 / 0.3))",
            }}
          >
            4
          </span>

          {/* "0" with pulse ring */}
          <span className="relative">
            <span
              className="nf-pulse-ring pointer-events-none absolute inset-0 rounded-full"
              style={{
                border: "2px solid oklch(0.8 0.15 200 / 0.4)",
                transform: "scale(1)",
              }}
            />
            <span
              className="nf-digit font-mono text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]"
              style={{
                opacity: 0,
                background:
                  "linear-gradient(135deg, oklch(0.8 0.15 200), oklch(0.65 0.25 290))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px oklch(0.8 0.15 200 / 0.3))",
              }}
            >
              0
            </span>
          </span>

          {/* Second "4" */}
          <span
            className="nf-digit nf-glitch-target font-mono text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]"
            style={{
              opacity: 0,
              background:
                "linear-gradient(135deg, oklch(0.65 0.25 290), oklch(0.8 0.15 200))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px oklch(0.65 0.25 290 / 0.3))",
            }}
          >
            4
          </span>
        </div>

        {/* ─── Subtitle ─── */}
        <h2
          className="nf-subtitle mb-4 font-mono text-sm font-medium uppercase tracking-[0.35em] sm:text-base"
          style={{
            opacity: 0,
            color: "oklch(0.8 0.15 200)",
          }}
        >
          Signal Lost · Route Not Found
        </h2>

        {/* ─── Description ─── */}
        <p
          className="nf-description mb-10 max-w-md text-sm leading-relaxed sm:text-base"
          style={{
            opacity: 0,
            color: "oklch(0.7 0 0 / 0.6)",
          }}
        >
          The endpoint you're trying to reach doesn't exist in this dimension.
          It may have been moved, deleted, or never existed at all.
        </p>

        {/* ─── Action Buttons ─── */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/">
            <Button className="nf-action" style={{ opacity: 0 }}>
              <Home size={16} />
              Return Home
            </Button>
          </Link>

          <Button
            variant="outline"
            className="nf-action"
            style={{ opacity: 0 }}
            onPress={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
        </div>

        {/* Decorative bottom line */}
        <div
          className="nf-line mt-10 h-[1px] w-48 origin-right"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.8 0.15 200), transparent)",
            opacity: 0,
          }}
        />
      </div>

      {/* ─── Corner accents ─── */}
      <div
        className="pointer-events-none absolute top-6 left-6 h-12 w-12 border-t-2 border-l-2"
        style={{ borderColor: "oklch(0.65 0.25 290 / 0.2)" }}
      />
      <div
        className="pointer-events-none absolute right-6 bottom-6 h-12 w-12 border-r-2 border-b-2"
        style={{ borderColor: "oklch(0.8 0.15 200 / 0.2)" }}
      />

      {/* ─── Bottom status bar ─── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "oklch(0.5 0 0 / 0.3)" }}
      >
        ERR::404 · EVENTSPINE · ROUTE_UNDEFINED
      </div>
    </div>
  );
}
