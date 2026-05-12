import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-6 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start your AI engineering learning journey.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthForm mode="signup" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link className="font-medium underline" href="/login">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
