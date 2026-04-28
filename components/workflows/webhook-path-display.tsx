"use client";

import { Tooltip } from "@heroui/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function WebhookPathDisplay({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api/v1"}/hooks/${path}`;

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="text-[10px] font-bold bg-success/20 text-success px-1.5 py-0.5 rounded">
        POST
      </span>
      <p className="text-foreground/50 font-mono text-xs truncate max-w-[180px]">
        /{path}
      </p>
      <Tooltip>
        <Tooltip.Trigger>
          <button
            type="button"
            onClick={copyToClipboard}
            className="text-foreground/40 hover:text-cyan transition-colors p-1 -ml-1 rounded-md hover:bg-white/5"
            aria-label="Copy webhook URL"
          >
            {copied ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content className="text-xs px-2 py-1">
          {copied ? "Copied!" : "Copy full URL"}
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
