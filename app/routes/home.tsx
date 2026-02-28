import { Link } from "react-router";
import { Button, Divider } from "@heroui/react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rune" },
    { name: "description", content: "Tools for the land of the Vikings" },
  ];
}

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center gap-8 max-w-md text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-6xl font-black tracking-tight text-white uppercase">
            Rune
          </h1>
          <Divider className="w-16 bg-primary" />
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mt-2">
            At the edge of Ragnarok
          </p>
        </div>

        <p className="text-lg text-gray-400 leading-relaxed">
          Forge your warrior. Shape your fate.
          <br />
          The final battle awaits.
        </p>

        <Button
          as={Link}
          to="/character-creation"
          color="primary"
          variant="solid"
          size="lg"
          className="font-semibold uppercase tracking-wider px-10"
        >
          Enter the Forge
        </Button>
      </div>
    </main>
  );
}
