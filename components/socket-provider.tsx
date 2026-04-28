"use client";

import { toast } from "@heroui/react";
import {
  createContext,
  type ReactNode,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCookieValue } from "@/app/actions/cookies";
import { refreshCache } from "@/app/actions/refreshCache";

interface SocketContextType {
  socket: WebSocket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;

    async function initSocket() {
      try {
        const token = await getCookieValue("token");
        console.log(
          "[SocketProvider] Token retrieved:",
          token ? "✓ present" : "✗ missing",
        );
        if (!token) return;

        // Determine the base WebSocket URL from the API URL
        const wsBaseUrl =
          process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws")?.replace(
            "/api/v1",
            "",
          ) || "ws://localhost:9000";

        // Connect to the live workflow updates endpoint for all workflows
        const wsUrl = `${wsBaseUrl}/api/v1/live/workflows/all?token=${token}`;
        console.log(
          "[SocketProvider] Connecting to:",
          wsUrl.replace(token, "***"),
        );

        ws = new WebSocket(wsUrl);
        setSocket(ws);

        ws.onopen = () => {
          console.log("[SocketProvider] ✓ WebSocket connected");
        };

        ws.onerror = (event) => {
          console.error("[SocketProvider] ✗ WebSocket error:", event);
        };

        ws.onclose = (event) => {
          console.log(
            "[SocketProvider] WebSocket closed:",
            event.code,
            event.reason,
          );
          setSocket(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("[SocketProvider] Received:", data.type, data);

            // If the server sends an error (e.g. auth failure), log and bail
            if (data.error) {
              console.error("[SocketProvider] Server error:", data.error);
              return;
            }

            const actionProps = {
              children: "Dismiss",
              onPress: () => toast.clear(),
              variant: "tertiary" as const,
            };

            if (data.type === "workflow.started") {
              toast("Workflow Started", {
                actionProps,
                description: `Run ${data.runId} has started.`,
                variant: "default",
              });
              startTransition(() => {
                refreshCache("executions");
              });
            } else if (data.type === "workflow.completed") {
              toast.success("Workflow Completed", {
                actionProps,
                description: `Run ${data.runId} completed successfully.`,
              });
              startTransition(() => {
                refreshCache("executions");
              });
            } else if (data.type === "workflow.failed") {
              toast.danger("Workflow Failed", {
                actionProps,
                description: `Run ${data.runId} failed.`,
              });
              startTransition(() => {
                refreshCache("executions");
              });
            } else if (data.type === "workflow.halted") {
              toast.warning("Workflow Halted", {
                actionProps,
                description: `Run ${data.runId} was halted by a filter.`,
              });
              startTransition(() => {
                refreshCache("executions");
              });
            }
          } catch (err) {
            console.error("[SocketProvider] Failed to parse message:", err);
          }
        };
      } catch (err) {
        console.error("[SocketProvider] initSocket failed:", err);
      }
    }

    initSocket();

    return () => {
      if (ws) {
        console.log("[SocketProvider] Cleaning up WebSocket");
        ws.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
