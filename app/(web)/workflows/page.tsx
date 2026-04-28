import { Button, Card, Chip } from "@heroui/react";
import {
  Activity,
  Edit2,
  Filter,
  PlayCircle,
  Plus,
  Webhook,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getCookieValue } from "@/app/actions/cookies";
import { getWorkflows } from "@/app/actions/workflows";
import { WebhookPathDisplay } from "@/components/workflows/webhook-path-display";
import { WorkflowRunsModal } from "@/components/workflows/workflow-runs-modal";
import { WorkflowsControls } from "@/components/workflows/workflows-controls";
import type { Workflow } from "@/types/worflow";

export default async function WorkflowsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-cyan/10 border border-white/10 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
            <Zap className="text-cyan h-8 w-8" /> Workflows
          </h2>
          <p className="text-foreground/70 max-w-lg">
            Manage and monitor your automated workflows. Create new webhooks,
            filters, and HTTP requests to orchestrate your events.
          </p>
        </div>
        <div className="relative z-10">
          <Link href="/workflows/add">
            <Button className="bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
              New Workflow
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <Suspense>
        <WorkflowsPageComponent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function WorkflowsPageComponent({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = parseInt(resolvedParams.limit || "10", 10);
  const search = resolvedParams.search || "";

  const sessionToken = await getCookieValue("token");

  const response = await getWorkflows(search, page, limit, sessionToken || "");
  const workflows = response.workflows || [];
  const meta = response.meta || { totalPages: 1, page: 1 };

  return (
    <>
      {/* Controls */}
      <WorkflowsControls
        totalPages={meta.totalPages}
        currentPage={meta.page}
        initialSearch={search}
      />

      {/* Grid */}
      {workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Activity className="h-16 w-16 text-white/10 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No workflows found
          </h3>
          <p className="text-white/50 mb-6">
            {search
              ? `We couldn't find any workflows matching "${search}".`
              : "You haven't created any workflows yet."}
          </p>
          {!search && (
            <Link href={"/workflows/add"}>
              <Button
                variant="ghost"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Create your first workflow
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workflows.map((workflow: Workflow) => {
            const firstStep = workflow.steps?.[0];
            const actionType = firstStep?.actionType || "unknown";

            return (
              <Card
                key={workflow.id}
                className="bg-white/[0.03] border-white/5 backdrop-blur-xl hover:border-cyan/30 transition-all duration-300 group"
              >
                <Card.Header className="flex flex-row justify-between items-start pt-6 px-6">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan transition-colors line-clamp-1">
                      {workflow.name}
                    </h3>
                    <WebhookPathDisplay path={workflow.webhookPath} />
                  </div>
                  <Chip
                    size="sm"
                    variant="soft"
                    className={
                      workflow.isActive
                        ? "bg-green-500/10 text-green-400 border-green-500/20 border"
                        : "bg-white/5 text-white/50 border-white/10 border"
                    }
                  >
                    {workflow.isActive ? "Active" : "Inactive"}
                  </Chip>
                </Card.Header>
                <Card.Content className="px-6 py-4">
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Webhook className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="text-white/40">Trigger</p>
                        <p className="text-white font-medium capitalize">
                          {workflow.triggerType}
                        </p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-cyan/10 text-cyan">
                        {actionType === "filter" ? (
                          <Filter className="h-4 w-4" />
                        ) : (
                          <PlayCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="text-xs">
                        <p className="text-white/40">Action</p>
                        <p className="text-white font-medium capitalize">
                          {actionType.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer className="px-6 pb-6 pt-2 flex justify-end gap-2">
                  <WorkflowRunsModal
                    workflow={workflow}
                    token={sessionToken || ""}
                  />
                  <Link href={`/workflows/${workflow.id}/edit`}>
                    <Button
                      size="sm"
                      className="bg-white/10 text-white hover:bg-white/20 border border-white/5"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
