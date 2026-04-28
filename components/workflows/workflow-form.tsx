"use client";

import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  Switch,
  TextField,
} from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createWorkflowAction,
  updateWorkflowAction,
} from "@/app/actions/workflows";
import type { Workflow } from "@/types/worflow";

export function WorkflowForm({ initialData }: { initialData?: Workflow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name || "");
  const [triggerType, setTriggerType] = useState(
    initialData?.triggerType || "webhook",
  );
  const [actionType, setActionType] = useState(
    initialData?.steps?.[0]?.actionType || "http_request",
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Config states
  const config = initialData?.steps?.[0]?.config || {};

  // http_request config
  const [url, setUrl] = useState(config.url || "");
  const [method, setMethod] = useState(config.method || "POST");
  const [headersJson, setHeadersJson] = useState(
    config.headers
      ? JSON.stringify(config.headers, null, 2)
      : '{\n  "Content-Type": "application/json"\n}',
  );

  // filter config
  const [filterKey, setFilterKey] = useState(config.key || "");
  const [operator, setOperator] = useState(config.operator || "equals");
  const [filterValue, setFilterValue] = useState(config.value || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let finalConfig: Record<string, any> = {};

    if (actionType === "http_request") {
      let parsedHeaders = {};
      try {
        parsedHeaders = JSON.parse(headersJson);
      } catch (err) {
        setError("Headers must be valid JSON");
        return;
      }
      finalConfig = {
        url,
        method,
        headers: parsedHeaders,
      };
    } else if (actionType === "filter") {
      finalConfig = {
        key: filterKey,
        operator,
        value: filterValue,
      };
    }

    const payload = {
      name,
      triggerType,
      actionType,
      config: finalConfig,
      ...(isEdit ? { isActive } : {}),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateWorkflowAction(initialData.id, payload)
        : await createWorkflowAction(payload);

      if (result.success) {
        router.push("/workflows");
      } else {
        setError(result.error);
      }
    });
  };

  const inputClass =
    "w-full bg-white/[0.02] border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white";

  return (
    <div className="max-w-3xl w-full mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/workflows">
          <Button
            isIconOnly
            variant="ghost"
            className="text-white/70 hover:text-white border-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isEdit ? "Edit Workflow" : "New Workflow"}
          </h2>
          <p className="text-foreground/70 text-sm">
            {isEdit
              ? "Update your workflow settings"
              : "Create a new automated flow"}
          </p>
        </div>
      </div>

      <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl">
        <Card.Content className="p-6 md:p-8">
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            validationBehavior="native"
          >
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-lg text-sm w-full">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <TextField
                isRequired
                className="flex flex-col gap-2"
                value={name}
                onChange={setName}
              >
                <Label className="text-sm font-medium text-white/80">
                  Workflow Name
                </Label>
                <Input
                  placeholder="e.g. User Signup Sync"
                  className={inputClass}
                />
                <FieldError className="text-xs text-danger" />
              </TextField>

              <TextField
                isRequired
                className="flex flex-col gap-2"
                value={triggerType}
                onChange={setTriggerType}
              >
                <Label className="text-sm font-medium text-white/80">
                  Trigger Type
                </Label>
                <Input className={inputClass} />
                <p className="text-xs text-white/50">
                  Currently only 'webhook' is supported
                </p>
                <FieldError className="text-xs text-danger" />
              </TextField>
            </div>

            <div className="w-full h-px bg-white/5 my-2" />

            <Select
              isRequired
              className="flex flex-col gap-2"
              selectedKey={actionType}
              onSelectionChange={(key) => setActionType(key as string)}
            >
              <Label className="text-sm font-medium text-white/80">
                Action Type
              </Label>
              <Select.Trigger className={inputClass}>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="http_request" textValue="HTTP Request">
                    HTTP Request
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="filter" textValue="Event Filter">
                    Event Filter
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
              <FieldError className="text-xs text-danger" />
            </Select>

            {/* Dynamic Config Area */}
            <div className="w-full p-6 rounded-xl bg-black/20 border border-white/5 flex flex-col gap-4 mt-2">
              <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
                Action Configuration
              </h4>

              {actionType === "http_request" && (
                <>
                  <TextField
                    isRequired
                    className="flex flex-col gap-2"
                    type="url"
                    value={url}
                    onChange={setUrl}
                  >
                    <Label className="text-sm font-medium text-white/80">
                      Target URL
                    </Label>
                    <Input
                      placeholder="https://api.example.com/endpoint"
                      className={inputClass}
                    />
                    <FieldError className="text-xs text-danger" />
                  </TextField>

                  <Select
                    isRequired
                    className="flex flex-col gap-2"
                    selectedKey={method}
                    onSelectionChange={(key) => setMethod(key as string)}
                  >
                    <Label className="text-sm font-medium text-white/80">
                      HTTP Method
                    </Label>
                    <Select.Trigger className={inputClass}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="GET" textValue="GET">
                          GET
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="POST" textValue="POST">
                          POST
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="PUT" textValue="PUT">
                          PUT
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="PATCH" textValue="PATCH">
                          PATCH
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="DELETE" textValue="DELETE">
                          DELETE
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                    <FieldError className="text-xs text-danger" />
                  </Select>

                  <TextField
                    className="flex flex-col gap-2"
                    value={headersJson}
                    onChange={setHeadersJson}
                  >
                    <Label className="text-sm font-medium text-white/80">
                      Headers (JSON format)
                    </Label>
                    <textarea
                      className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white rounded-lg p-3 font-mono text-sm h-32"
                      value={headersJson}
                      onChange={(e) => setHeadersJson(e.target.value)}
                    />
                    <FieldError className="text-xs text-danger" />
                  </TextField>
                </>
              )}

              {actionType === "filter" && (
                <>
                  <TextField
                    isRequired
                    className="flex flex-col gap-2"
                    value={filterKey}
                    onChange={setFilterKey}
                  >
                    <Label className="text-sm font-medium text-white/80">
                      Filter Key
                    </Label>
                    <Input
                      placeholder="e.g. event.type"
                      className={inputClass}
                    />
                    <FieldError className="text-xs text-danger" />
                  </TextField>

                  <Select
                    isRequired
                    className="flex flex-col gap-2"
                    selectedKey={operator}
                    onSelectionChange={(key) => setOperator(key as string)}
                  >
                    <Label className="text-sm font-medium text-white/80">
                      Operator
                    </Label>
                    <Select.Trigger className={inputClass}>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="equals" textValue="Equals">
                          Equals
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="not_equals" textValue="Not Equals">
                          Not Equals
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="contains" textValue="Contains">
                          Contains
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="exists" textValue="Exists">
                          Exists
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                    <FieldError className="text-xs text-danger" />
                  </Select>

                  {operator !== "exists" && (
                    <TextField
                      className="flex flex-col gap-2"
                      value={filterValue}
                      onChange={setFilterValue}
                    >
                      <Label className="text-sm font-medium text-white/80">
                        Value
                      </Label>
                      <Input
                        placeholder="Value to compare against"
                        className={inputClass}
                      />
                      <FieldError className="text-xs text-danger" />
                    </TextField>
                  )}
                </>
              )}
            </div>

            {isEdit && (
              <>
                <div className="w-full h-px bg-white/5 my-2" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      Active Status
                    </h4>
                    <p className="text-xs text-white/50">
                      Turn this workflow on or off
                    </p>
                  </div>
                  <Switch isSelected={isActive} onChange={setIsActive} />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Link href="/workflows">
                <Button
                  variant="ghost"
                  className="bg-white/5 text-white hover:bg-white/10 border-transparent"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                className="font-medium shadow-[0_0_15px_rgba(0,255,255,0.2)] bg-cyan text-black hover:bg-cyan/90"
                isPending={isPending}
              >
                {!isPending && <Save className="h-4 w-4 mr-2" />}
                {isEdit ? "Save Changes" : "Create Workflow"}
              </Button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
