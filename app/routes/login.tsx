import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import { Button, Card, CardBody, CardHeader, Divider, Input } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { createServerClient } from "~/services/supabase.server";
import type { Route } from "./+types/login";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (user) throw redirect("/my-characters");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createServerClient(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "google") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${new URL(request.url).origin}/auth/callback` },
    });
    if (error) return { error: error.message };
    return redirect(data.url, { headers });
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mode = formData.get("mode") as string;

  if (mode === "signup") {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { success: "signup" };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return redirect("/my-characters", { headers });
}

export default function Login() {
  const { t } = useTranslation();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-bold">
            {mode === "login" ? t("auth.login") : t("auth.signup")}
          </h1>
        </CardHeader>
        <CardBody className="gap-4 px-6 pb-6">
          {actionData && "error" in actionData && (
            <p className="text-danger text-sm">{actionData.error}</p>
          )}
          {actionData && "success" in actionData && actionData.success === "signup" && (
            <p className="text-success text-sm">{t("auth.checkEmail")}</p>
          )}

          <Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="mode" value={mode} />
            <Input
              name="email"
              type="email"
              label={t("auth.email")}
              isRequired
              autoComplete="email"
            />
            <Input
              name="password"
              type="password"
              label={t("auth.password")}
              isRequired
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
            <Button
              type="submit"
              name="intent"
              value="email"
              color="primary"
              isLoading={isSubmitting}
            >
              {mode === "login" ? t("auth.login") : t("auth.signup")}
            </Button>
          </Form>

          <Divider />

          <Form method="post">
            <Button
              type="submit"
              name="intent"
              value="google"
              variant="bordered"
              fullWidth
              isLoading={isSubmitting}
              startContent={
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
            >
              {t("auth.signInWithGoogle")}
            </Button>
          </Form>

          <p className="text-center text-sm text-gray-400">
            {mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? t("auth.signup") : t("auth.login")}
            </button>
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
