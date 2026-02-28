import { Link } from "react-router";
import { Button } from "@heroui/react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rune" },
    { name: "description", content: "Welcome to Rune" },
  ];
}

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">
          Rune
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Tools for the land of the Vikings.
        </p>
        <Button
          as={Link}
          to="/character-creation"
          color="primary"
          size="lg"
        >
          Character Creation
        </Button>
      </div>
    </main>
  );
}
