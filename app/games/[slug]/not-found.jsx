import Link from "next/link";

export default function GameNotFound() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Game not found</h1>
      <p className="mt-4 text-muted-foreground">
        That game isn&apos;t in the club yet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-primary underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </main>
  );
}