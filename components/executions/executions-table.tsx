"use client";

import {
  Button,
  Chip,
  ListBox,
  Pagination,
  Select,
  Table,
} from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Workflow, WorkflowRun } from "@/types/worflow";

interface ExecutionsTableProps {
  runs: WorkflowRun[];
  workflows: Workflow[];
  meta: { totalPages: number; page: number; total: number };
  initialWorkflowId: string;
}

export function ExecutionsTable({
  runs,
  workflows,
  meta,
  initialWorkflowId,
}: ExecutionsTableProps) {
  const router = useRouter();

  const handleWorkflowChange = (key: import("react").Key | null) => {
    const val = key as string;
    const params = new URLSearchParams(window.location.search);
    if (val && val !== "all") {
      params.set("workflowId", val);
    } else {
      params.delete("workflowId");
    }
    params.set("page", "1"); // Reset to page 1 on filter
    router.push(`/executions?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`/executions?${params.toString()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "failed":
        return "danger";
      case "running":
        return "accent";
      case "halted":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex w-full sm:w-1/3">
          <Select
            aria-label="Filter by Workflow"
            placeholder="All Workflows"
            selectedKey={initialWorkflowId}
            onSelectionChange={handleWorkflowChange}
            className="w-full"
          >
            <Select.Trigger className="bg-white/[0.02] border-white/10 hover:border-cyan/50 text-white rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-foreground/50" />
                <Select.Value />
              </div>
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="all" textValue="All Workflows">
                  All Workflows
                </ListBox.Item>
                {workflows.map((wf) => (
                  <ListBox.Item key={wf.id} id={wf.id} textValue={wf.name}>
                    {wf.name}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
        <div className="text-sm text-foreground/50 font-mono">
          Total Executions: {meta.total}
        </div>
      </div>

      {/* HeroUI Table */}
      <Table className="bg-white/[0.02] border border-white/5 shadow-xl backdrop-blur-xl rounded-2xl p-4">
        <Table.ScrollContainer className="max-h-[800px] overflow-auto">
          <Table.Content aria-label="Executions Table" className="min-w-full">
            <Table.Header>
              <Table.Column
                isRowHeader
                className="bg-transparent text-white/50 border-b border-white/10 font-mono text-xs uppercase tracking-wider py-4"
              >
                Status
              </Table.Column>
              <Table.Column className="bg-transparent text-white/50 border-b border-white/10 font-mono text-xs uppercase tracking-wider py-4">
                Workflow
              </Table.Column>
              <Table.Column className="bg-transparent text-white/50 border-b border-white/10 font-mono text-xs uppercase tracking-wider py-4">
                Trigger
              </Table.Column>
              <Table.Column className="bg-transparent text-white/50 border-b border-white/10 font-mono text-xs uppercase tracking-wider py-4">
                Started At
              </Table.Column>
              <Table.Column className="bg-transparent text-white/50 border-b border-white/10 font-mono text-xs uppercase tracking-wider py-4">
                Duration
              </Table.Column>
              <Table.Column className="bg-transparent text-white/50 border-b border-white/10 font-mono text-xs uppercase tracking-wider py-4 text-center">
                Actions
              </Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="p-4 text-center text-white/50">
                  No executions found.
                </div>
              )}
            >
              {runs.map((run) => {
                const duration =
                  run.completedAt && run.startedAt
                    ? `${new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()}ms`
                    : "-";

                return (
                  <Table.Row
                    key={run.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <Table.Cell className="py-4 border-b border-white/5">
                      <Chip
                        variant="soft"
                        color={getStatusColor(run.status)}
                        className="capitalize border-none pl-0 text-sm flex items-center justify-center font-medium"
                      >
                        {run.status}
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="py-4 border-b border-white/5">
                      <div className="flex flex-col">
                        <span className="text-white font-medium group-hover:text-cyan transition-colors">
                          {run.workflow?.name || "Unknown"}
                        </span>
                        <span className="text-foreground/40 text-xs font-mono">
                          {run.id}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="py-4 border-b border-white/5">
                      <span className="text-white/70 font-mono text-sm">
                        {run.workflow?.triggerType || "webhook"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="py-4 border-b border-white/5">
                      <span className="text-white/70">
                        {run.startedAt
                          ? formatDistanceToNow(new Date(run.startedAt), {
                              addSuffix: true,
                            })
                          : "Pending"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="py-4 border-b border-white/5">
                      <span className="text-white/70 font-mono text-sm">
                        {duration}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="py-4 border-b border-white/5 text-center">
                      <Link href={`/executions/${run.workflowId}/${run.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white/50 hover:text-cyan hover:bg-cyan/10 px-3"
                        >
                          Details
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination className="justify-center">
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={meta.page === 1}
                  onPress={() => handlePageChange(meta.page - 1)}
                >
                  <span>Previous</span>
                </Pagination.Previous>
              </Pagination.Item>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <Pagination.Item key={p}>
                    <Pagination.Link
                      isActive={p === meta.page}
                      onPress={() => handlePageChange(p)}
                    >
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ),
              )}
              <Pagination.Item>
                <Pagination.Next
                  isDisabled={meta.page === meta.totalPages}
                  onPress={() => handlePageChange(meta.page + 1)}
                >
                  <span>Next</span>
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}
