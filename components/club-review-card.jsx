"use client";

import Link from "next/link";
import {
  AestheticsRatingIcon,
  ReviewExtraRatingRow,
  ValueForMoneyRatingIcon,
} from "@/components/review-extra-rating-icons";

export default function ClubReviewCard({
  review,
  linkGame = true,
  showUsername = true,
  isExpanded = false,
  onToggleExpand,
}) {
  const {
    game,
    reviewText,
    score,
    username,
    aesthetics,
    aestheticsLabel,
    valueForMoney,
    valueForMoneyLabel,
  } = review;

  const image = (
    <img
      src={game.coverImage}
      alt={`${game.title} cover art`}
      className="aspect-[460/215] w-full object-cover"
    />
  );

  function handleCardClick(event) {
    if (event.target.closest("a")) {
      return;
    }

    onToggleExpand?.();
  }

  return (
    <article
      aria-expanded={isExpanded}
      onClick={handleCardClick}
      className={`card-raised box-border flex w-[min(calc(100vw-2.5rem),36rem)] shrink-0 snap-center cursor-pointer flex-col gap-4 p-4 transition-shadow md:w-full md:max-w-none md:flex-row md:items-stretch md:gap-5 ${
        isExpanded ? "relative z-10 shadow-lg md:items-start" : ""
      }`}
    >
      {linkGame ? (
        <Link
          href={`/games/${game.slug}`}
          className="block shrink-0 overflow-hidden rounded-md border border-border transition-opacity hover:opacity-90 md:w-[11.5rem]"
        >
          {image}
        </Link>
      ) : (
        <div className="block shrink-0 overflow-hidden rounded-md border border-border md:w-[11.5rem]">
          {image}
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center md:py-1">
        {showUsername && username ? (
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {username}
          </p>
        ) : null}
        <p
          className={`text-sm leading-relaxed text-muted-foreground ${
            isExpanded ? "" : "line-clamp-5 md:line-clamp-4"
          }`}
        >
          {reviewText}
        </p>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-border pt-3 md:w-[6.75rem] md:justify-center md:border-t-0 md:border-l md:pt-0 md:pl-4">
        <div className="flex flex-row items-center justify-between gap-2 md:flex-col md:gap-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-center">
            Score
          </p>
          <p className="text-base font-bold md:text-lg">{score}</p>
        </div>
        <ReviewExtraRatingRow
          title="Aesthetics"
          label={aestheticsLabel}
          icon={<AestheticsRatingIcon value={aesthetics} />}
        />
        <ReviewExtraRatingRow
          title="Value for money"
          label={valueForMoneyLabel}
          icon={<ValueForMoneyRatingIcon value={valueForMoney} />}
        />
      </div>
    </article>
  );
}
