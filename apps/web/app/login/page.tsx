import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-6 py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to continue learning on BeyondPrompt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthForm mode="login" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            New here?{" "}
            <Link className="font-medium underline" href="/signup">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
