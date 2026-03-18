import { Link, useRouteLoaderData } from "react-router";
import { Button, Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/home";
import type { RootLoaderData } from "~/root";
import i18n from "~/i18n";

export function meta({}: Route.MetaArgs) {
  const t = i18n.t;
  return [
    { title: t("home.title") },
    { name: "description", content: t("home.meta.description") },
  ];
}

export default function Home() {
  const { t } = useTranslation();
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const user = rootData?.user ?? null;

  const subtitleLines = t("home.subtitle").split("\n");

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center gap-8 max-w-md text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-6xl font-black tracking-tight text-white uppercase">
            {t("home.title")}
          </h1>
          <Divider className="w-16 bg-primary" />
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mt-2">
            {t("home.tagline")}
          </p>
        </div>

        <p className="text-lg text-gray-400 leading-relaxed">
          {subtitleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < subtitleLines.length - 1 && <br />}
            </span>
          ))}
        </p>

        <div className="flex flex-col items-center gap-3">
          <Button
            as={Link}
            to="/character-creation"
            color="primary"
            variant="solid"
            size="lg"
            className="font-semibold uppercase tracking-wider px-10"
          >
            {t("home.cta")}
          </Button>
          {user && (
            <Button
              as={Link}
              to="/my-characters"
              variant="light"
              size="sm"
              className="text-gray-400"
            >
              {t("auth.myCharacters")}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
