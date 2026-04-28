"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function WorkflowsControls({
  totalPages,
  currentPage,
  initialSearch = "",
}: {
  totalPages: number;
  currentPage: number;
  initialSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(initialSearch);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== initialSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
          params.set("search", searchValue);
        } else {
          params.delete("search");
        }
        params.set("page", "1"); // Reset page on search
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, initialSearch, pathname, router, searchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
      <div className="relative max-w-md w-full h-10 flex items-center bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors backdrop-blur-xl rounded-lg overflow-hidden">
        <div className="pl-3 pointer-events-none">
          <Search className="text-white/50 h-4 w-4" />
        </div>
        <input
          className="w-full h-full bg-transparent border-none outline-none pl-2 text-small text-white placeholder:text-white/50"
          placeholder="Search workflows..."
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded-md text-sm bg-white/[0.02] border border-white/10 hover:border-white/20 text-white disabled:opacity-50 transition-colors"
          >
            Prev
          </button>
          <div className="flex items-center px-3 py-1 rounded-md text-sm bg-cyan text-black font-semibold">
            {currentPage} / {totalPages}
          </div>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded-md text-sm bg-white/[0.02] border border-white/10 hover:border-white/20 text-white disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
