/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */
"use client";

import FloatingParticles from "@/components/layout/not-found/floating-particles";
import { Button } from "@heroui/react";
import { animate, createScope, createTimeline, stagger } from "animejs";
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      /* ─── Main entrance timeline ─── */
      const tl = createTimeline({
        defaults: { ease: "outExpo" },
      });

      // Warning icon slam in
      tl.add(
        ".er-icon",
        {
          scale: [3, 1],
          opacity: [0, 1],
          rotate: [15, 0],
          duration: 800,
          ease: "outBack",
        },
        0,
      );

      // Error code reveal
      tl.add(
        ".er-code",
        {
          y: [80, 0],
          opacity: [0, 1],
          scale: [0.7, 1],
          duration: 900,
        },
        "-=400",
      );

      // Subtitle text slide up
      tl.add(
        ".er-subtitle",
        {
          y: [40, 0],
          opacity: [0, 1],
          duration: 800,
        },
        "-=500",
      );

      // Error message box glitch in
      tl.add(
        ".er-message",
        {
          x: [-20, 0],
          opacity: [0, 1],
          duration: 700,
        },
        "-=400",
      );

      // Buttons stagger in
      tl.add(
        ".er-action",
        {
          y: [30, 0],
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 600,
          delay: stagger(120),
        },
        "-=300",
      );

      // Decorative lines sweep in
      tl.add(
        ".er-line",
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

      /* ─── Warning icon pulse ─── */
      animate(".er-icon-pulse", {
        scale: [1, 1.15],
        opacity: [0.6, 0],
        duration: 2000,
        loop: true,
        ease: "outQuad",
      });

      /* ─── Glitch effect on error code ─── */
      animate(".er-glitch", {
        x: [
          { to: -4, duration: 60 },
          { to: 4, duration: 60 },
          { to: -2, duration: 60 },
          { to: 0, duration: 60 },
        ],
        loop: true,
        loopDelay: 4000,
        ease: "linear",
      });

      /* ─── Circuit line dash animation ─── */
      animate(".er-circuit-path", {
        strokeDashoffset: [1000, 0],
        duration: 4000,
        loop: true,
        ease: "linear",
      });

      /* ─── Scanline sweep ─── */
      animate(".er-scanline", {
        y: ["-100%", "800%"],
        duration: 5000,
        loop: true,
        ease: "linear",
      });

      /* ─── Error message box border shimmer ─── */
      animate(".er-message-border", {
        opacity: [0.3, 0.8, 0.3],
        duration: 3000,
        loop: true,
        ease: "inOutSine",
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
        className="er-scanline pointer-events-none absolute left-0 z-10 h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.6 0.25 25 / 0.4), oklch(0.65 0.25 290 / 0.2), transparent)",
          top: 0,
        }}
      />

      {/* ─── Circuit SVG background ─── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Circuit SVG background</title>
        <defs>
          <linearGradient
            id="errCircuitGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="oklch(0.6 0.25 25)" />
            <stop offset="50%" stopColor="oklch(0.65 0.25 290)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 25)" />
          </linearGradient>
        </defs>
        {/* Circuit paths */}
        <path
          className="er-circuit-path"
          d="M0,150 H250 V350 H550 V150 H850 V450 H1200"
          fill="none"
          stroke="url(#errCircuitGrad)"
          strokeWidth="1.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        <path
          className="er-circuit-path"
          d="M0,450 H180 V280 H480 V550 H780 V320 H1080 V680"
          fill="none"
          stroke="url(#errCircuitGrad)"
          strokeWidth="1"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        <path
          className="er-circuit-path"
          d="M150,0 V120 H450 V420 H750 V220 H1050 V600"
          fill="none"
          stroke="url(#errCircuitGrad)"
          strokeWidth="1"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />
        {/* Circuit node dots */}
        {[
          [250, 150],
          [550, 350],
          [850, 150],
          [180, 450],
          [480, 280],
          [780, 550],
          [450, 420],
          [750, 220],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="3"
            fill="url(#errCircuitGrad)"
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
          className="er-line mb-8 h-[1px] w-48 origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.6 0.25 25), transparent)",
            opacity: 0,
          }}
        />

        {/* ─── Warning Icon ─── */}
        <div className="relative mb-6">
          {/* Pulse ring behind icon */}
          <div
            className="er-icon-pulse pointer-events-none absolute inset-0 rounded-full"
            style={{
              border: "2px solid oklch(0.6 0.25 25 / 0.4)",
              transform: "scale(1)",
            }}
          />
          <div
            className="er-icon flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24"
            style={{
              opacity: 0,
              background: "oklch(0.6 0.25 25 / 0.1)",
              border: "1px solid oklch(0.6 0.25 25 / 0.25)",
              boxShadow: "0 0 40px oklch(0.6 0.25 25 / 0.15)",
            }}
          >
            <AlertTriangle
              size={40}
              style={{ color: "oklch(0.6 0.25 25)" }}
            />
          </div>
        </div>

        {/* ─── Error Code ─── */}
        <span
          className="er-code er-glitch mb-4 font-mono text-[4rem] font-black leading-none tracking-tighter select-none sm:text-[6rem]"
          style={{
            opacity: 0,
            background:
              "linear-gradient(135deg, oklch(0.6 0.25 25), oklch(0.65 0.25 290))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 30px oklch(0.6 0.25 25 / 0.3))",
          }}
        >
          ERROR
        </span>

        {/* ─── Subtitle ─── */}
        <h2
          className="er-subtitle mb-4 font-mono text-sm font-medium uppercase tracking-[0.35em] sm:text-base"
          style={{
            opacity: 0,
            color: "oklch(0.6 0.25 25)",
          }}
        >
          System Fault · Unexpected Exception
        </h2>

        {/* ─── Error Message Box ─── */}
        <div
          className="er-message relative mb-10 max-w-lg overflow-hidden rounded-lg px-5 py-4"
          style={{
            opacity: 0,
            background: "oklch(0.15 0.01 25 / 0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Animated border shimmer */}
          <div
            className="er-message-border pointer-events-none absolute inset-0 rounded-lg"
            style={{
              border: "1px solid oklch(0.6 0.25 25 / 0.3)",
              opacity: 0.3,
            }}
          />

          {/* Terminal-style error content */}
          <div className="relative z-10 text-left font-mono">
            <div
              className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider"
              style={{ color: "oklch(0.6 0.25 25 / 0.7)" }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "oklch(0.6 0.25 25)" }}
              />
              Stack Trace
            </div>
            <p
              className="text-xs leading-relaxed sm:text-sm"
              style={{ color: "oklch(0.7 0 0 / 0.6)" }}
            >
              {error.message || "An unexpected error occurred in the application runtime."}
            </p>
            {error.digest && (
              <p
                className="mt-2 text-[10px] sm:text-xs"
                style={{ color: "oklch(0.5 0 0 / 0.4)" }}
              >
                Digest: {error.digest}
              </p>
            )}
          </div>
        </div>

        {/* ─── Action Buttons ─── */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button
            className="er-action"
            style={{ opacity: 0 }}
            onPress={reset}
          >
            <RotateCcw size={16} />
            Try Again
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="er-action"
              style={{ opacity: 0 }}
            >
              <Home size={16} />
              Return Home
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="er-action"
            style={{ opacity: 0 }}
            onPress={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
        </div>

        {/* Decorative bottom line */}
        <div
          className="er-line mt-10 h-[1px] w-48 origin-right"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.6 0.25 25), transparent)",
            opacity: 0,
          }}
        />
      </div>

      {/* ─── Corner accents ─── */}
      <div
        className="pointer-events-none absolute top-6 left-6 h-12 w-12 border-t-2 border-l-2"
        style={{ borderColor: "oklch(0.6 0.25 25 / 0.2)" }}
      />
      <div
        className="pointer-events-none absolute right-6 bottom-6 h-12 w-12 border-r-2 border-b-2"
        style={{ borderColor: "oklch(0.65 0.25 290 / 0.2)" }}
      />

      {/* ─── Bottom status bar ─── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "oklch(0.5 0 0 / 0.3)" }}
      >
        ERR::RUNTIME · EVENTSPINE · EXCEPTION_UNHANDLED
      </div>
    </div>
  );
}
