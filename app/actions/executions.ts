"use server";

import { cacheTag } from "next/cache";
import { api } from "@/lib/fetch";
import type { ExecutionsResponse, WorkflowRunDetails } from "@/types/worflow";

export async function getExecutions(
  token: string,
  searchParams?: {
    workflowId?: string;
    page?: number;
    limit?: number;
  },
): Promise<ExecutionsResponse> {
  "use cache";
  cacheTag("executions");
  try {
    const response = await api.get("/workflows/runs/all", {
      params: searchParams || {},
      useCache: true,
      token,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response as ExecutionsResponse;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch executions",
    };
  }
}

export async function getExecutionDetails(
  token: string,
  workflowId: string,
  runId: string,
): Promise<WorkflowRunDetails | { error: string }> {
  "use cache";
  cacheTag(`execution-${runId}`, "executions");
  try {
    const response = await api.get(`/workflows/${workflowId}/runs/${runId}`, {
      useCache: true,
      token,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response as WorkflowRunDetails;
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch execution details",
    };
  }
}
