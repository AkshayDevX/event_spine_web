"use client";

import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Link,
  TextField,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setCookieValue } from "@/app/actions/cookies";
import { api } from "@/lib/fetch";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const router = useRouter();

  const action = async (formData: FormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      const fullName = formData.get("fullName") as string;
      const workspaceName = formData.get("workspaceName") as string;

      if (password !== confirmPassword) {
        setServerError("Passwords do not match.");
        setIsLoading(false);
        return;
      }

      const data = await api.post("/auth/signup", {
        email,
        password,
        fullName,
        workspaceName,
      });

      // Store the token in a secure HttpOnly cookie via Server Action
      await setCookieValue("token", data.token);

      // Redirect to home
      router.push("/");
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Create an account
        </h1>
        <p className="text-foreground/60 text-sm">
          Set up your workspace and start building automated workflows.
        </p>
      </div>

      <Form
        className="w-full flex flex-col gap-5"
        validationBehavior="native"
        action={action}
        autoComplete="off"
      >
        {serverError && (
          <div className="p-3 w-full bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-sm text-danger text-center">{serverError}</p>
          </div>
        )}

        <div className="flex gap-4 w-full">
          <TextField
            className="flex flex-col gap-2 w-full"
            name="fullName"
            type="text"
            isRequired
          >
            <Label className="text-foreground/80 font-medium">Full Name</Label>
            <Input
              autoComplete="off"
              placeholder="John Doe"
              className="w-full bg-white/5 border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white"
            />
            <FieldError className="text-xs text-danger" />
          </TextField>

          <TextField
            className="flex flex-col gap-2 w-full"
            name="workspaceName"
            type="text"
            isRequired
          >
            <Label className="text-foreground/80 font-medium">
              Workspace Name
            </Label>
            <Input
              autoComplete="off"
              placeholder="My Company"
              className="w-full bg-white/5 border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white"
            />
            <FieldError className="text-xs text-danger" />
          </TextField>
        </div>

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
            autoComplete="off"
            placeholder="you@example.com"
            className="w-full bg-white/5 border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white"
          />
          <FieldError className="text-xs text-danger" />
        </TextField>

        <TextField
          className="flex flex-col gap-2 w-full"
          name="password"
          type={isPasswordVisible ? "text" : "password"}
          isRequired
          value={passwordValue}
          onChange={setPasswordValue}
          validate={(value) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters long.";
            }
            return null;
          }}
        >
          <Label className="text-foreground/80 font-medium">Password</Label>
          <div className="relative w-full">
            <Input
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full bg-white/5 border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none flex items-center justify-center"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4 text-white/50 hover:text-white/80 transition-colors" />
              ) : (
                <Eye className="h-4 w-4 text-white/50 hover:text-white/80 transition-colors" />
              )}
            </button>
          </div>
          <FieldError className="text-xs text-danger" />
        </TextField>

        <TextField
          className="flex flex-col gap-2 w-full"
          name="confirmPassword"
          type={isConfirmPasswordVisible ? "text" : "password"}
          isRequired
          validate={(value) => {
            if (value !== passwordValue) {
              return "Passwords do not match.";
            }
            return null;
          }}
        >
          <Label className="text-foreground/80 font-medium">
            Confirm Password
          </Label>
          <div className="relative w-full">
            <Input
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full bg-white/5 border-white/10 hover:border-white/20 focus-visible:!border-primary shadow-sm text-white pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none flex items-center justify-center"
              onClick={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              {isConfirmPasswordVisible ? (
                <EyeOff className="h-4 w-4 text-white/50 hover:text-white/80 transition-colors" />
              ) : (
                <Eye className="h-4 w-4 text-white/50 hover:text-white/80 transition-colors" />
              )}
            </button>
          </div>
          <FieldError className="text-xs text-danger" />
        </TextField>

        <Button
          className="w-full mt-4 bg-gradient-to-r from-cyan to-primary text-white shadow-lg shadow-cyan/25 font-medium tracking-wide"
          variant="primary"
          isPending={isLoading}
          type="submit"
          size="lg"
        >
          Create Workspace
        </Button>
      </Form>

      <div className="mt-8 text-center text-sm text-foreground/60">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-cyan font-medium hover:text-primary transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
