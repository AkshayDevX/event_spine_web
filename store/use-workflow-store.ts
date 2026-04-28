/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */
import { create } from "zustand";
import type { Workflow } from "@/types/worflow";

export const generateId = () => Math.random().toString(36).substring(2, 9);

export type StepState = {
  id: string;
  isNew: boolean;
  isDeleted: boolean;
  actionType: string;
  config: Record<string, any>;
};

interface WorkflowStore {
  name: string;
  setName: (name: string) => void;
  triggerType: string;
  setTriggerType: (type: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  steps: StepState[];
  setSteps: (steps: StepState[]) => void;
  addStep: () => void;
  deleteStep: (id: string) => void;
  updateStep: (id: string, updates: Partial<StepState>) => void;
  updateStepConfig: (id: string, configUpdates: Record<string, any>) => void;
  initialize: (initialData?: Workflow) => void;
  isInitialized: boolean;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  name: "",
  setName: (name) => set({ name }),

  triggerType: "webhook",
  setTriggerType: (triggerType) => set({ triggerType }),

  isActive: true,
  setIsActive: (isActive) => set({ isActive }),

  steps: [],
  setSteps: (steps) => set({ steps }),

  addStep: () =>
    set((state) => ({
      steps: [
        ...state.steps,
        {
          id: generateId(),
          isNew: true,
          isDeleted: false,
          actionType: "http_request",
          config: {
            method: "POST",
            headers: '{\n  "Content-Type": "application/json"\n}',
          },
        },
      ],
    })),

  deleteStep: (id) =>
    set((state) => ({
      steps: state.steps.map((s) =>
        s.id === id ? { ...s, isDeleted: true } : s,
      ),
    })),

  updateStep: (id, updates) =>
    set((state) => ({
      steps: state.steps.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  updateStepConfig: (id, configUpdates) =>
    set((state) => ({
      steps: state.steps.map((s) =>
        s.id === id ? { ...s, config: { ...s.config, ...configUpdates } } : s,
      ),
    })),

  isInitialized: false,
  initialize: (initialData) => {
    const initialSteps: StepState[] = initialData?.steps
      ?.sort((a, b) => a.orderNumber - b.orderNumber)
      .map((s) => {
        const config: Record<string, any> = { ...s.config };
        if (
          s.actionType === "http_request" &&
          config.headers &&
          typeof config.headers === "object"
        ) {
          config.headers = JSON.stringify(config.headers, null, 2);
        } else if (s.actionType === "http_request" && !config.headers) {
          config.headers = '{\n  "Content-Type": "application/json"\n}';
        }
        
        if (
          s.actionType === "http_request" &&
          config.body &&
          typeof config.body === "object"
        ) {
          config.body = JSON.stringify(config.body, null, 2);
        }
        return {
          id: s.id,
          isNew: false,
          isDeleted: false,
          actionType: s.actionType,
          config,
        };
      }) || [
      {
        id: generateId(),
        isNew: true,
        isDeleted: false,
        actionType: "http_request",
        config: {
          method: "POST",
          headers: '{\n  "Content-Type": "application/json"\n}',
        },
      },
    ];

    set({
      name: initialData?.name || "",
      triggerType: initialData?.triggerType || "webhook",
      isActive: initialData?.isActive ?? true,
      steps: initialSteps,
      isInitialized: true,
    });
  },
}));
