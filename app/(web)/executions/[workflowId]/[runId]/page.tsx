import { Button, Card, Chip } from "@heroui/react";
import { format } from "date-fns";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  TerminalSquare,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getCookieValue } from "@/app/actions/cookies";
import { getExecutionDetails } from "@/app/actions/executions";

async function ExecutionDetailsPageComponent({
  params,
}: {
  params: Promise<{ workflowId: string; runId: string }>;
}) {
  const resolvedParams = await params;
  const sessionToken = await getCookieValue("token");

  const runDetails = await getExecutionDetails(
    sessionToken || "",
    resolvedParams.workflowId,
    resolvedParams.runId,
  );

  if ("error" in runDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <XCircle className="h-16 w-16 text-danger mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">
          Error Loading Execution
        </h3>
        <p className="text-white/50">{runDetails.error}</p>
        <Link href="/executions" className="mt-6">
          <Button variant="ghost" className="text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Executions
          </Button>
        </Link>
      </div>
    );
  }

  const duration =
    runDetails.completedAt && runDetails.startedAt
      ? `${new Date(runDetails.completedAt).getTime() - new Date(runDetails.startedAt).getTime()}ms`
      : "-";

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/executions">
            <Button
              isIconOnly
              variant="ghost"
              className="text-white/50 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              Execution Details
              <Chip
                color={
                  runDetails.status === "failed"
                    ? "danger"
                    : runDetails.status === "completed"
                      ? "success"
                      : "default"
                }
                variant="soft"
                className="capitalize font-mono text-xs"
              >
                {runDetails.status}
              </Chip>
            </h1>
            <p className="text-foreground/50 font-mono text-sm mt-1">
              ID: {runDetails.id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl">
            <Card.Header className="px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan" /> Execution Timeline
              </h3>
            </Card.Header>
            <Card.Content className="p-6">
              <div className="flex flex-col gap-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-6 bottom-6 w-px bg-white/10" />

                {/* Event Trigger */}
                <div className="relative flex gap-6">
                  <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 border border-primary/50 text-primary shrink-0 shadow-[0_0_15px_rgba(104,34,255,0.2)]">
                    <TerminalSquare className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col flex-1 pt-1">
                    <h4 className="text-white font-medium text-lg">
                      Webhook Triggered
                    </h4>
                    <p className="text-foreground/50 text-sm mb-3 font-mono">
                      {runDetails.event?.createdAt
                        ? format(
                            new Date(runDetails.event.createdAt),
                            "MMM d, yyyy HH:mm:ss.SSS",
                          )
                        : "Unknown"}
                    </p>
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 overflow-auto max-h-60">
                      <pre className="text-xs font-mono text-white/70">
                        {JSON.stringify(runDetails.event?.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                {runDetails.steps.map((stepRun, index) => {
                  const isFailed = stepRun.status === "failed";
                  const isCompleted = stepRun.status === "completed";
                  const stepDuration =
                    stepRun.completedAt && stepRun.startedAt
                      ? `${new Date(stepRun.completedAt).getTime() - new Date(stepRun.startedAt).getTime()}ms`
                      : "-";

                  return (
                    <div key={stepRun.id} className="relative flex gap-6">
                      <div
                        className={`z-10 flex h-12 w-12 items-center justify-center rounded-full shrink-0 shadow-lg ${
                          isFailed
                            ? "bg-danger/20 border-danger/50 text-danger"
                            : isCompleted
                              ? "bg-success/20 border-success/50 text-success"
                              : "bg-white/5 border-white/10 text-white/50"
                        }`}
                      >
                        {isFailed ? (
                          <XCircle className="h-5 w-5" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="font-mono">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 pt-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium text-lg flex items-center gap-2">
                            <span className="capitalize">
                              {stepRun.step?.actionType.replace("_", " ")}
                            </span>
                            <Chip
                              size="sm"
                              variant="soft"
                              className="bg-white/5 text-white/40"
                            >
                              Step {index + 1}
                            </Chip>
                          </h4>
                          <span className="text-xs font-mono text-white/30 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {stepDuration}
                          </span>
                        </div>
                        <p className="text-foreground/50 text-sm mb-3 font-mono">
                          {stepRun.startedAt
                            ? format(
                                new Date(stepRun.startedAt),
                                "HH:mm:ss.SSS",
                              )
                            : "Pending"}
                        </p>

                        {/* Error Box */}
                        {isFailed && stepRun.error && (
                          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 text-danger-300 font-mono text-sm mt-2">
                            <strong>Error:</strong> {stepRun.error}
                          </div>
                        )}

                        {/* Logs Box */}
                        {stepRun.logs && (
                          <div className="bg-black/40 rounded-xl p-4 border border-white/5 mt-3 overflow-auto max-h-60">
                            <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">
                              Output / Logs
                            </p>
                            <pre className="text-xs font-mono text-white/70 whitespace-pre-wrap break-all">
                              {JSON.stringify(stepRun.logs, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl">
            <Card.Header className="px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Execution Info</h3>
            </Card.Header>
            <Card.Content className="p-6 flex flex-col gap-4">
              <div>
                <p className="text-sm text-foreground/50 mb-1">Workflow</p>
                <p className="text-white font-medium">
                  {runDetails.workflow?.name || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/50 mb-1">
                  Total Duration
                </p>
                <p className="text-white font-mono">{duration}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/50 mb-1">Started</p>
                <p className="text-white font-mono text-sm">
                  {runDetails.startedAt
                    ? format(
                        new Date(runDetails.startedAt),
                        "MMM d, yyyy HH:mm:ss",
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/50 mb-1">Completed</p>
                <p className="text-white font-mono text-sm">
                  {runDetails.completedAt
                    ? format(
                        new Date(runDetails.completedAt),
                        "MMM d, yyyy HH:mm:ss",
                      )
                    : "-"}
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function ExecutionDetailsPage({
  params,
}: {
  params: Promise<{ workflowId: string; runId: string }>;
}) {
  return (
    <Suspense>
      <ExecutionDetailsPageComponent params={params} />
    </Suspense>
  );
}
