import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | EventSpine",
  description: "Sign in to your EventSpine workspace",
};

export default function LoginPage() {
  return <LoginForm />;
}
