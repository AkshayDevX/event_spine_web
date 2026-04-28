import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCookieValue } from "@/app/actions/cookies";
import { getWorkflow } from "@/app/actions/workflows";
import { WorkflowForm } from "@/components/workflows/workflow-form";

export const metadata = {
  title: "Edit Workflow | EventSpine",
};

export default async function EditWorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense>
      <EditWorkflowPageComponent params={params} />
    </Suspense>
  );
}

async function EditWorkflowPageComponent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const sessionToken = await getCookieValue("token");
  const { workflow } = await getWorkflow(resolvedParams.id, sessionToken || "");

  if (!workflow) {
    redirect("/404");
  }

  return <WorkflowForm initialData={workflow} />;
}
