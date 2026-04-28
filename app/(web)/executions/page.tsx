import { Activity } from "lucide-react";
import { Suspense } from "react";
import { getCookieValue } from "@/app/actions/cookies";
import { getExecutions } from "@/app/actions/executions";
import { getWorkflows } from "@/app/actions/workflows";
import { ExecutionsTable } from "@/components/executions/executions-table";

export default async function ExecutionsPage({
  searchParams,
}: {
  searchParams: Promise<{ workflowId?: string; page?: string; limit?: string }>;
}) {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-cyan/10 border border-white/10 p-8 flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
            <Activity className="text-cyan h-8 w-8" /> Executions
          </h2>
          <p className="text-foreground/70 max-w-lg">
            Monitor and inspect every single workflow run. View payloads, trace
            step executions, and debug failures instantly.
          </p>
        </div>
      </div>
      <Suspense
        fallback={<div className="h-96 animate-pulse bg-white/5 rounded-2xl" />}
      >
        <ExecutionsPageComponent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ExecutionsPageComponent({
  searchParams,
}: {
  searchParams: Promise<{ workflowId?: string; page?: string; limit?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = parseInt(resolvedParams.limit || "10", 10);
  const workflowId = resolvedParams.workflowId;

  const sessionToken = await getCookieValue("token");

  // Fetch both executions and workflows (for the filter dropdown)
  const [executionsResponse, workflowsResponse] = await Promise.all([
    getExecutions(sessionToken || "", { workflowId, page, limit }),
    getWorkflows("", 1, 100, sessionToken || ""),
  ]);

  const runs = executionsResponse.runs || [];
  const meta = executionsResponse.meta || { totalPages: 1, page: 1, total: 0 };
  const workflows = workflowsResponse.workflows || [];

  return (
    <ExecutionsTable
      runs={runs}
      workflows={workflows}
      meta={meta}
      initialWorkflowId={workflowId || "all"}
    />
  );
}
