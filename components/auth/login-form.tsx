"use client";

import { setCookieValue } from "@/app/actions/cookies";
import { api } from "@/lib/fetch";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Link,
  TextField,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const action = async (formData: FormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const data = await api.post("/auth/login", { email, password });

      // Store the token in a secure HttpOnly cookie via Server Action
      await setCookieValue("token", data.token);

      // Redirect to home
      router.push("/");
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Welcome back
        </h1>
        <p className="text-foreground/60 text-sm">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <Form
        className="w-full flex flex-col gap-5"
        validationBehavior="native"
        action={action}
      >
        {serverError && (
          <div className="p-3 w-full bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-sm text-danger text-center">{serverError}</p>
          </div>
        )}
        <TextField
          className="flex flex-col gap-2 w-full"
          name="email"
          type="email"
          isRequired
        >
          <Label className="text-foreground/80 font-medium">
            Email Address
          </Label>
          <Input
            placeholder="you@example.com"
            className="w-full bg-white/5 border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white"
          />
          <FieldError className="text-xs text-danger" />
        </TextField>

        <TextField
          className="flex flex-col gap-2 w-full"
          name="password"
          type="password"
          isRequired
        >
          <Label className="text-foreground/80 font-medium">Password</Label>
          <Input
            placeholder="••••••••"
            className="w-full bg-white/5 border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white"
          />
          <FieldError className="text-xs text-danger" />
        </TextField>
        {/* 
        <div className="flex w-full items-center justify-between mt-1 mb-2">
          <Link href="#" className="text-sm text-primary hover:text-cyan transition-colors">
            Forgot password?
          </Link>
        </div> */}

        <Button
          className="w-full bg-gradient-to-r mt-3 from-primary to-cyan text-white shadow-lg shadow-primary/25 font-medium tracking-wide"
          variant="primary"
          isPending={isLoading}
          type="submit"
          size="lg"
        >
          Sign In
        </Button>
      </Form>

      <div className="mt-8 text-center text-sm text-foreground/60">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-primary font-medium hover:text-cyan transition-colors"
        >
          Create one now
        </Link>
      </div>
    </div>
  );
}
