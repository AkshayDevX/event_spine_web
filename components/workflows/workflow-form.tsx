/** biome-ignore-all lint/suspicious/noExplicitAny: false positive*/
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
import {
  ArrowLeft,
  Filter,
  PlayCircle,
  Plus,
  Save,
  Trash2,
  Webhook,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import {
  addStepAction,
  createWorkflowAction,
  deleteStepAction,
  updateStepAction,
  updateWorkflowAction,
} from "@/app/actions/workflows";
import type { Workflow } from "@/types/worflow";

import { useWorkflowStore } from "../../store/use-workflow-store";

export function WorkflowForm({ initialData }: { initialData?: Workflow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isEdit = !!initialData;

  const {
    name,
    setName,
    triggerType,
    setTriggerType,
    isActive,
    setIsActive,
    steps,
    addStep,
    deleteStep,
    updateStep,
    updateStepConfig,
    initialize,
  } = useWorkflowStore();

  React.useEffect(() => {
    initialize(initialData);
  }, [initialData, initialize]);

  const activeSteps = steps.filter((s) => !s.isDeleted);

  const handleAddStep = addStep;
  const handleDeleteStep = deleteStep;
  const handleUpdateStep = updateStep;
  const handleUpdateStepConfig = updateStepConfig;

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name) return setError("Workflow name is required");
    if (activeSteps.length === 0)
      return setError("At least one step is required");

    let processedSteps: any[] = [];
    try {
      processedSteps = steps.map((s) => {
        if (s.isDeleted) return s;
        const config = { ...s.config };
        if (s.actionType === "filter") {
          if (!config.operator) {
            config.operator = "equals";
          }
          delete config.url;
          delete config.method;
          delete config.headers;
          delete config.body;
        } else if (s.actionType === "http_request") {
          if (typeof config.headers === "string") {
            config.headers = JSON.parse(config.headers);
          }
          if (typeof config.body === "string" && config.body.trim() !== "") {
            config.body = JSON.parse(config.body);
          } else if (
            typeof config.body === "string" &&
            config.body.trim() === ""
          ) {
            delete config.body;
          }
          delete config.key;
          delete config.operator;
          delete config.value;
        }
        return { ...s, config };
      });
    } catch (err: any) {
      console.error(err);
      setError("Headers and Body must be valid JSON");
      return;
    }

    startTransition(async () => {
      try {
        if (!isEdit) {
          // Create mode
          const payload = {
            name,
            triggerType,
            steps: activeSteps.map((s, idx) => ({
              actionType: s.actionType,
              orderNumber: idx,
              config: processedSteps.find((ps) => ps.id === s.id)?.config || {},
            })),
          };
          const result = await createWorkflowAction(payload);
          if (!result.success) throw new Error(result.error);
        } else {
          // Edit mode
          const wfResult = await updateWorkflowAction(initialData.id, {
            name,
            triggerType,
            isActive,
          });
          if (!wfResult.success) throw new Error(wfResult.error);

          let orderCounter = 0;
          for (const step of processedSteps) {
            if (step.isDeleted && !step.isNew) {
              const res = await deleteStepAction(initialData.id, step.id);
              if (!res.success) throw new Error(res.error);
            } else if (!step.isDeleted) {
              const payload = {
                actionType: step.actionType,
                orderNumber: orderCounter++,
                config: step.config,
              };
              if (step.isNew) {
                const res = await addStepAction(initialData.id, payload);
                if (!res.success) throw new Error(res.error);
              } else {
                const res = await updateStepAction(
                  initialData.id,
                  step.id,
                  payload,
                );
                if (!res.success) throw new Error(res.error);
              }
            }
          }
        }
        router.push("/workflows");
      } catch (err: any) {
        setError(err.message || "An error occurred while saving the workflow");
      }
    });
  };

  const inputClass =
    "w-full bg-white/[0.02] border-white/10 hover:border-white/20 focus-visible:!border-cyan shadow-sm text-white transition-colors";

  return (
    <div className="max-w-4xl w-full mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/workflows">
            <Button
              isIconOnly
              variant="ghost"
              className="text-white/70 hover:text-white border-transparent bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              {isEdit ? "Edit Workflow" : "Workflow Builder"}
            </h2>
            <p className="text-cyan/70 text-sm font-mono mt-1">
              Design your automated pipeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            form="workflow-form"
            variant="primary"
            className="font-medium shadow-[0_0_20px_rgba(0,255,255,0.2)] bg-cyan text-black hover:bg-cyan/90 transition-all hover:scale-105"
            isPending={isPending}
          >
            {!isPending && <Save className="h-4 w-4 mr-2" />}
            {isEdit ? "Save Pipeline" : "Deploy Pipeline"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/30 text-danger rounded-xl text-sm w-full mb-8 backdrop-blur-md font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,0,0.1)]">
          <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
          {error}
        </div>
      )}

      <Form
        id="workflow-form"
        onSubmit={handleSubmit}
        validationBehavior="native"
      >
        {/* Core Configuration */}
        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-2xl shadow-xl w-full mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent pointer-events-none" />
          <Card.Header className="px-8 pt-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan/10 border border-cyan/20">
                <Webhook className="h-5 w-5 text-cyan" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Trigger Configuration
                </h3>
                <p className="text-white/50 text-xs mt-0.5">
                  Define how this workflow starts
                </p>
              </div>
            </div>
            {isEdit && (
              <div className="ml-auto flex items-center gap-3">
                <span className="text-sm font-mono text-white/50">Status:</span>
                <Switch isSelected={isActive} onChange={setIsActive}>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              </div>
            )}
          </Card.Header>
          <Card.Content className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
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
                  placeholder="e.g. Sync Stripe Payments"
                  className={inputClass}
                />
                <FieldError className="text-xs text-danger mt-1" />
              </TextField>

              <TextField
                isRequired
                className="flex flex-col gap-2"
                value={triggerType}
                onChange={setTriggerType}
              >
                <Label className="text-sm font-medium text-white/80">
                  Trigger Origin
                </Label>
                <Input className={inputClass} />
                <p className="text-xs text-white/40 mt-1 font-mono">
                  Incoming origin constraint (default: webhook)
                </p>
                <FieldError className="text-xs text-danger mt-1" />
              </TextField>
            </div>
          </Card.Content>
        </Card>

        {/* Pipeline Builder */}
        <div className="flex flex-col items-center w-full relative">
          <div className="absolute top-0 bottom-10 w-px bg-gradient-to-b from-cyan/50 via-cyan/20 to-transparent -z-10" />

          {activeSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              {index > 0 && <div className="h-10 w-px bg-cyan/30 my-1" />}

              <Card className="bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl w-full group hover:border-cyan/30 transition-colors relative overflow-visible">
                {/* Step Number Badge */}
                <div className="absolute -left-4 top-6 w-8 h-8 rounded-full bg-black border border-cyan/50 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.2)] z-10">
                  <span className="text-cyan font-mono text-xs font-bold">
                    {index + 1}
                  </span>
                </div>

                <Card.Header className="flex flex-row items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-4 w-2/3">
                    <Select
                      isRequired
                      className="w-full max-w-xs"
                      value={step.actionType}
                      onChange={(key) =>
                        handleUpdateStep(step.id, { actionType: key as string })
                      }
                      aria-label="Action Type"
                    >
                      <Select.Trigger className="bg-white/5 border-white/10 text-white">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item
                            id="http_request"
                            textValue="HTTP Request"
                          >
                            <div className="flex items-center gap-2">
                              <PlayCircle className="h-4 w-4 text-cyan" />
                              <span>HTTP Request</span>
                            </div>
                          </ListBox.Item>
                          <ListBox.Item id="filter" textValue="Event Filter">
                            <div className="flex items-center gap-2">
                              <Filter className="h-4 w-4 text-purple-400" />
                              <span>Event Filter</span>
                            </div>
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {activeSteps.length > 1 && (
                    <Button
                      isIconOnly
                      variant="ghost"
                      className="text-white/30 hover:text-danger hover:bg-danger/10 transition-colors"
                      onPress={() => handleDeleteStep(step.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </Card.Header>

                <Card.Content className="p-6 bg-black/20">
                  {step.actionType === "http_request" && (
                    <div className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <Select
                          isRequired
                          className="md:col-span-1"
                          value={step.config.method}
                          onChange={(key) =>
                            handleUpdateStepConfig(step.id, {
                              method: key as string,
                            })
                          }
                          aria-label="HTTP Method"
                        >
                          <Label className="text-xs font-mono text-white/50 mb-1 block">
                            Method
                          </Label>
                          <Select.Trigger className={inputClass}>
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              <ListBox.Item id="GET" textValue="GET">
                                GET
                              </ListBox.Item>
                              <ListBox.Item id="POST" textValue="POST">
                                POST
                              </ListBox.Item>
                              <ListBox.Item id="PUT" textValue="PUT">
                                PUT
                              </ListBox.Item>
                              <ListBox.Item id="PATCH" textValue="PATCH">
                                PATCH
                              </ListBox.Item>
                              <ListBox.Item id="DELETE" textValue="DELETE">
                                DELETE
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>

                        <TextField
                          isRequired
                          className="md:col-span-3"
                          type="url"
                          value={step.config.url || ""}
                          onChange={(val) =>
                            handleUpdateStepConfig(step.id, { url: val })
                          }
                        >
                          <Label className="text-xs font-mono text-white/50 mb-1 block">
                            Target Endpoint URL
                          </Label>
                          <Input
                            placeholder="https://api.example.com/v1/resource"
                            className={inputClass}
                          />
                        </TextField>
                      </div>

                      <TextField
                        value={step.config.headers || ""}
                        onChange={(val) =>
                          handleUpdateStepConfig(step.id, { headers: val })
                        }
                      >
                        <Label className="text-xs font-mono text-white/50 mb-1 block">
                          Headers (JSON payload)
                        </Label>
                        <textarea
                          className="w-full bg-black/40 border border-white/10 focus-visible:!border-cyan shadow-inner text-white rounded-xl p-4 font-mono text-xs h-32 transition-colors resize-y"
                          value={step.config.headers || ""}
                          onChange={(e) =>
                            handleUpdateStepConfig(step.id, {
                              headers: e.target.value,
                            })
                          }
                          placeholder={'{\n  "Authorization": "Bearer ..."\n}'}
                        />
                      </TextField>

                      {["POST", "PUT", "PATCH"].includes(
                        step.config.method?.toUpperCase() || "POST",
                      ) && (
                        <TextField
                          value={step.config.body || ""}
                          onChange={(val) =>
                            handleUpdateStepConfig(step.id, { body: val })
                          }
                        >
                          <Label className="text-xs font-mono text-white/50 mb-1 block">
                            Custom Body (JSON payload)
                          </Label>
                          <textarea
                            className="w-full bg-black/40 border border-white/10 focus-visible:!border-cyan shadow-inner text-white rounded-xl p-4 font-mono text-xs h-32 transition-colors resize-y"
                            value={step.config.body || ""}
                            onChange={(e) =>
                              handleUpdateStepConfig(step.id, {
                                body: e.target.value,
                              })
                            }
                            placeholder={
                              '{\n  "custom": "field",\n  "amount": 500\n}'
                            }
                          />
                          <p className="text-xs text-white/40 mt-2 font-mono">
                            If left blank, the original webhook payload will be
                            forwarded automatically.
                          </p>
                        </TextField>
                      )}
                    </div>
                  )}

                  {step.actionType === "filter" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <TextField
                        isRequired
                        value={step.config.key || ""}
                        onChange={(val) =>
                          handleUpdateStepConfig(step.id, { key: val })
                        }
                      >
                        <Label className="text-xs font-mono text-white/50 mb-1 block">
                          Object Key Path
                        </Label>
                        <Input
                          placeholder="e.g. data.user.id"
                          className={inputClass}
                        />
                      </TextField>

                      <Select
                        isRequired
                        selectedKey={step.config.operator || "equals"}
                        onSelectionChange={(key) =>
                          handleUpdateStepConfig(step.id, {
                            operator: key as string,
                          })
                        }
                        aria-label="Operator"
                      >
                        <Label className="text-xs font-mono text-white/50 mb-1 block">
                          Condition Operator
                        </Label>
                        <Select.Trigger className={inputClass}>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="equals" textValue="Equals">
                              Equals
                            </ListBox.Item>
                            <ListBox.Item
                              id="not_equals"
                              textValue="Not Equals"
                            >
                              Not Equals
                            </ListBox.Item>
                            <ListBox.Item id="contains" textValue="Contains">
                              Contains
                            </ListBox.Item>
                            <ListBox.Item id="exists" textValue="Exists">
                              Exists
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>

                      {step.config.operator !== "exists" && (
                        <TextField
                          value={step.config.value || ""}
                          onChange={(val) =>
                            handleUpdateStepConfig(step.id, { value: val })
                          }
                        >
                          <Label className="text-xs font-mono text-white/50 mb-1 block">
                            Target Value
                          </Label>
                          <Input
                            placeholder="Comparison value"
                            className={inputClass}
                          />
                        </TextField>
                      )}
                    </div>
                  )}
                </Card.Content>
              </Card>
            </React.Fragment>
          ))}

          <div className="h-12 w-px bg-gradient-to-b from-cyan/30 to-transparent my-1" />

          <Button
            onPress={handleAddStep}
            variant="outline"
            className="border-dashed border-2 border-white/20 text-white hover:border-cyan/50 hover:text-cyan bg-black/20 backdrop-blur-md rounded-full px-8 shadow-xl transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Append Pipeline Step
          </Button>
        </div>
      </Form>
    </div>
  );
}
