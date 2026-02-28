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
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Rune
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Welcome to Rune.
        </p>
      </div>
    </main>
  );
}
