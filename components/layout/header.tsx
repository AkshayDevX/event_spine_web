"use client";

import { Button } from "@heroui/react";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Simple breadcrumb logic based on pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentPage =
    pathSegments.length > 0
      ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
      : "Dashboard";

  return (
    <header className="h-20 w-full flex items-center justify-between px-8 bg-transparent relative z-10 border-b border-white/5">
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {currentPage}
        </h1>
        <div className="flex items-center text-sm text-foreground/50 mt-1">
          <span className="hover:text-white/80 transition-colors cursor-pointer">
            Home
          </span>
          <span className="mx-2">/</span>
          <span className="text-cyan">{currentPage}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-foreground/40 group-focus-within:text-cyan transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search workflows..."
            className="w-64 bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-foreground/40 focus:outline-none focus:border-cyan/50 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          isIconOnly
          className="rounded-full text-foreground/60 hover:text-white hover:bg-white/10 relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(104,34,255,0.8)]"></span>
        </Button>
      </div>
    </header>
  );
}
