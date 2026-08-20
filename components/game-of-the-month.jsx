import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function GameOfTheMonth({ game }) {
    return (
        <section className="py-12 text-center">
            <div className="mx-auto max-w-2xl rounded-xl border border-border bg-white p-8 shadow-lg sm:p-10">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Game of the Month
            </p>
            <p className="mt-1 text-lg font-semibold">{game.month}</p>

            <div className="mt-8 flex flex-col items-center gap-8">
                <img
                    src={game.coverImage}
                    alt={`${game.title} cover art`}
                    className="w-full max-w-xs rounded-lg border border-border"
                />
                <div className="flex max-w-xl flex-col items-center">
                    <h2 className="text-3xl font-bold">{game.title}</h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {game.genres.join(" • ")}
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {game.rating}
                    </p>

                    <p className="mt-4 text-muted-foreground">{game.description}</p>

                    <Link
                        href={`/games/${game.slug}`}
                        className={cn(buttonVariants(), "mt-6")}
                    >
                        View game
                    </Link>
                </div>
            </div>
            </div>
        </section>
    );
}