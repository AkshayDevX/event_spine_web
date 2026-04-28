import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-8 bg-background overflow-hidden">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan/15 blur-[120px] mix-blend-screen" />
      </div>

      {/* Central Content */}
      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Floating Logo */}
        <div className="mb-8 z-20">
          <Image
            src="/logo.png"
            alt="EventSpine Logo"
            width={120}
            height={120}
            priority
            className="rounded-3xl shadow-[0_0_50px_rgba(104,34,255,0.4)] transform hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Glassmorphism Card */}
        <div className="w-full bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

          <div className="relative z-10">{children}</div>
        </div>

        {/* Footer / System Status */}
        <div className="mt-8 flex flex-col items-center gap-2 font-mono text-xs text-foreground/40">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
            <span className="tracking-widest">SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
