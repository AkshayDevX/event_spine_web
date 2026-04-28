"use client";

import { Button, Chip, Modal, Spinner } from "@heroui/react";
import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getWorkflowRuns } from "@/app/actions/executions";
import type { Workflow, WorkflowRun } from "@/types/worflow";

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function WorkflowRunsModal({
  workflow,
  token,
}: {
  workflow: Workflow;
  token: string;
}) {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchRuns = async () => {
    if (hasFetched) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWorkflowRuns(token, workflow.id, 10);
      if (response.error) throw new Error(response.error);
      setRuns(response.runs || []);
      setHasFetched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load runs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onOpenChange={(isOpen) => isOpen && fetchRuns()}>
      <Modal.Trigger>
        <Button
          size="sm"
          variant="ghost"
          className="text-white/70 hover:text-white"
        >
          View Runs
        </Button>
      </Modal.Trigger>
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-xl bg-surface border border-white/10 backdrop-blur-2xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-primary/20 text-primary">
                <Activity className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Recent Runs: {workflow.name}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="max-h-[60vh] overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Spinner size="lg" color="accent" />
                </div>
              ) : error ? (
                <div className="text-danger text-center py-10">{error}</div>
              ) : runs.length === 0 ? (
                <div className="text-center py-10 text-white/50">
                  No runs found for this workflow yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {runs.map((run) => (
                    <Link
                      key={run.id}
                      href={`/executions/${workflow.id}/${run.id}`}
                      className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {run.status === "completed" ? (
                            <CheckCircle2 className="size-5 text-success" />
                          ) : run.status === "failed" ? (
                            <XCircle className="size-5 text-danger" />
                          ) : (
                            <Activity className="size-5 text-primary animate-pulse" />
                          )}
                          <div>
                            <div className="font-mono text-sm text-white/90">
                              {run.id.slice(0, 8)}...
                            </div>
                            <div className="text-xs text-white/50 flex items-center gap-1 mt-1">
                              <Clock className="size-3" />
                              {run.createdAt
                                ? getRelativeTime(run.createdAt)
                                : "Unknown time"}
                            </div>
                          </div>
                        </div>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={
                            run.status === "completed"
                              ? "success"
                              : run.status === "failed"
                                ? "danger"
                                : "accent"
                          }
                          className="capitalize"
                        >
                          {run.status}
                        </Chip>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                slot="close"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
