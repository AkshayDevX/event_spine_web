import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Workspace | EventSpine",
  description: "Create a new EventSpine workspace",
};

export default function SignupPage() {
  return <SignupForm />;
}
