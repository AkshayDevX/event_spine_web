"use server";

import { cacheTag, updateTag } from "next/cache";
import { api } from "@/lib/fetch";
import type {
  GetWorkflowByIdResponse,
  WorkflowsResponse,
} from "@/types/worflow";

export async function createWorkflowAction(data: any) {
  try {
    const response = await api.post("/workflows/", data);
    updateTag("workflows");
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create workflow",
    };
  }
}

export async function updateWorkflowAction(id: string, data: any) {
  try {
    const response = await api.patch(`/workflows/${id}`, data);
    updateTag("workflows");
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update workflow",
    };
  }
}

export async function getWorkflows(
  search: string,
  page: number,
  limit: number,
  sessionToken: string,
): Promise<WorkflowsResponse> {
  "use cache";
  cacheTag("workflows");
  try {
    const response = await api.get("/workflows/", {
      params: { search, page, limit },
      useCache: true,
      token: sessionToken,
    });

    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  } catch (error) {
    console.error("Error fetching detailing work:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch detailing work",
    };
  }
}

export async function getWorkflow(
  id: string,
  sessionToken: string,
): Promise<GetWorkflowByIdResponse> {
  "use cache";
  cacheTag(`workflow-${id}`, "workflows");
  try {
    const response = await api.get(`/workflows/${id}`, {
      useCache: true,
      token: sessionToken,
    });

    if (response.error) {
      throw new Error(response.error);
    }
    return response;
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch workflow",
    };
  }
}
