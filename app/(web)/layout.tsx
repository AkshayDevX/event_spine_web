import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden text-foreground">
      {/* Background Ambient Glow Effects (Same as Auth for consistency) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Persistent Sidebar */}
      <Suspense>
        <Sidebar />
      </Suspense>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-transparent">
        <Suspense>
          <Header />
        </Suspense>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
