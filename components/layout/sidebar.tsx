"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, Activity, Settings, Code, Users } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Workflows", href: "/workflows", icon: Zap },
  { name: "Executions", href: "/executions", icon: Activity },
  { name: "Connections", href: "/connections", icon: Code },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col w-64 bg-white/[0.02] backdrop-blur-3xl border-r border-white/5 relative z-20">
      {/* Sidebar Top Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50 pointer-events-none" />

      {/* Logo Area */}
      <div className="p-6 relative z-10 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="EventSpine Logo"
          width={40}
          height={40}
          className="rounded-xl shadow-[0_0_20px_rgba(104,34,255,0.4)]"
        />
        <span className="text-xl font-bold tracking-tight text-white/90">
          EventSpine
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4 relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-cyan border border-cyan/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                  : "text-foreground/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive ? "text-cyan" : "text-foreground/50 group-hover:text-white/80"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Status / Footer */}
      <div className="p-4 relative z-10 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan to-primary flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white/90">Admin User</span>
            <span className="text-xs text-foreground/50">Workspace Owner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
