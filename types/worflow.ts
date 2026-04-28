/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */
export interface Workflow {
  id: string;
  name: string;
  workspaceId: string;
  triggerType: string;
  webhookPath: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  actionType: string;
  orderNumber: number;
  config: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    key?: string;
    operator?: string;
    value?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowsResponse {
  workflows?: Workflow[];
  meta?: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  error?: string;
  message?: string;
}

export interface GetWorkflowByIdResponse {
  workflow?: Workflow;
  error?: string;
  message?: string;
}

export interface CreateWorkflowRequest {
  name: string;
  triggerType: string;
  steps: {
    actionType: string;
    config: Record<string, any>;
  }[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  triggerType?: string;
  isActive?: boolean;
}

export interface CreateStepRequest {
  actionType: string;
  orderNumber: number;
  config: Record<string, any>;
}

export interface UpdateStepRequest {
  actionType?: string;
  orderNumber?: number;
  config?: Record<string, any>;
}
