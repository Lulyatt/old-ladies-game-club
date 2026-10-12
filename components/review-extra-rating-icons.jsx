import {
  Frown,
  Gem,
  Meh,
  Minus,
  Palette,
  Scale,
  Skull,
  Sparkles,
  ThumbsUp,
  Wallet,
} from "lucide-react";

const iconClass = "size-3.5 shrink-0 text-club-poster-text";

export function AestheticsRatingIcon({ value }) {
  switch (value) {
    case "ugly":
      return <Frown className={iconClass} aria-hidden />;
    case "meh":
      return <Meh className={iconClass} aria-hidden />;
    case "not_bad":
      return <Minus className={iconClass} aria-hidden />;
    case "very_pretty":
      return <Sparkles className={iconClass} aria-hidden />;
    case "beautiful":
      return <Palette className={iconClass} aria-hidden />;
    default:
      return null;
  }
}

export function ValueForMoneyRatingIcon({ value }) {
  switch (value) {
    case "rip_off":
      return <Skull className={iconClass} aria-hidden />;
    case "pricey":
      return <Wallet className={iconClass} aria-hidden />;
    case "about_right":
      return <Scale className={iconClass} aria-hidden />;
    case "good_value":
      return <ThumbsUp className={iconClass} aria-hidden />;
    case "worth_every_penny":
      return <Gem className={iconClass} aria-hidden />;
    default:
      return null;
  }
}

export function ReviewExtraRatingRow({ icon, label, title }) {
  if (!label) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 md:flex-col md:gap-1">
      <span className="sr-only">{title}: </span>
      {icon}
      <p className="text-[10px] leading-tight text-muted-foreground md:text-center md:text-[11px]">
        {label}
      </p>
    </div>
  );
}
