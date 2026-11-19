"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AestheticsRatingIcon,
  ReviewExtraRatingRow,
  ValueForMoneyRatingIcon,
} from "@/components/review-extra-rating-icons";
import ProfilePortrait from "@/components/profile-portrait";
import ReviewAgreeButton from "@/components/review-agree-button";

export default function ClubReviewCard({
  review,
  linkGame = true,
  href = null,
  showAuthorPortrait = false,
  showUsername = true,
  inScrollCarousel = false,
  compactGrid = false,
  isExpanded = false,
  onToggleExpand,
}) {
  const router = useRouter();
  const {
    id,
    likeCount,
    game,
    reviewText,
    score,
    username,
    author,
    aesthetics,
    aestheticsLabel,
    valueForMoney,
    valueForMoneyLabel,
  } = review;

  const gameCover = (
    <img
      src={game.coverImage}
      alt={`${game.title} cover art`}
      className="aspect-[460/215] w-full object-cover"
    />
  );

  const leadingVisual = showAuthorPortrait ? (
    <ProfilePortrait
      src={author?.avatarSrc}
      alt={author?.avatarAlt ?? `${username}'s profile picture`}
      fallbackInitial={author?.fallbackInitial ?? username.charAt(0).toUpperCase()}
    />
  ) : linkGame ? (
    <Link
      href={`/games/${game.slug}`}
      className="block shrink-0 overflow-hidden rounded-md border border-border transition-opacity hover:opacity-90 md:w-[11.5rem]"
    >
      {gameCover}
    </Link>
  ) : (
    <div className="block shrink-0 overflow-hidden rounded-md border border-border md:w-[11.5rem]">
      {gameCover}
    </div>
  );

  function handleCardClick(event) {
    if (event.target.closest("[data-review-agree]")) {
      return;
    }

    if (event.target.closest("a")) {
      return;
    }

    if (href) {
      router.push(href);
      return;
    }

    onToggleExpand?.();
  }

  const cardClassName = `card-raised box-border flex min-w-0 flex-col gap-4 p-4 transition-shadow ${
    compactGrid ? "h-full w-full" : "md:flex-row md:items-stretch md:gap-5"
  } ${
    inScrollCarousel
      ? "w-full shrink-0 snap-center"
      : compactGrid
        ? "w-full max-w-none"
        : "w-[min(calc(100vw-2.5rem),36rem)] shrink-0 snap-center md:w-full md:max-w-none"
  } ${isExpanded ? "relative z-10 shadow-lg md:items-start" : ""} ${
    href ? "cursor-pointer hover:opacity-95" : "cursor-pointer"
  }`;

  const cardBody = (
    <>
      <div className={`shrink-0 ${compactGrid ? "" : "md:w-[11.5rem]"}`}>
        {leadingVisual}
      </div>

      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col justify-center ${
          compactGrid ? "" : "md:py-1"
        }`}
      >
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

      <div
        className={`flex shrink-0 flex-col gap-3 border-t border-border pt-3 ${
          compactGrid
            ? ""
            : "md:w-[6.75rem] md:justify-center md:border-t-0 md:border-l md:pt-0 md:pl-4"
        }`}
      >
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
        <ReviewAgreeButton reviewId={id} likeCount={likeCount ?? 0} />
      </div>
    </>
  );

  return (
    <article
      aria-expanded={href ? undefined : isExpanded}
      onClick={handleCardClick}
      className={cardClassName}
    >
      {cardBody}
    </article>
  );
}
