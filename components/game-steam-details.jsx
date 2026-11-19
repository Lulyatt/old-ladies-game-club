import { ChevronDown } from "lucide-react";

const CONTROLLER_LABELS = {
  full: "Full controller support",
  partial: "Partial controller support",
};

const PLATFORM_LABELS = {
  windows: "Windows",
  mac: "Mac",
  linux: "Linux",
};

function DetailSection({ title, children }) {
  if (!children) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 min-w-0 max-w-full">{children}</div>
    </section>
  );
}

function CollapsibleSection({ title, children, className = "mt-10" }) {
  if (!children) return null;

  return (
    <details className={`group min-w-0 ${className}`}>
      <summary className="flex cursor-pointer list-none items-center gap-2 text-lg font-semibold [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="mt-3 min-w-0 max-w-full">{children}</div>
    </details>
  );
}

function TagList({ items }) {
  if (!items?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-border bg-muted px-3 py-1 text-xs"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function RequirementsColumn({ label, html }) {
  if (!html) return null;

  return (
    <div>
      <h3 className="text-sm font-medium">{label}</h3>
      <div
        className="mt-2 space-y-2 text-sm text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:space-y-1"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function MetaRow({ label, value, href }) {
  if (!value) return null;

  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default function GameSteamDetails({ game }) {
  const activePlatforms = game.platforms
    ? Object.entries(game.platforms)
        .filter(([, supported]) => supported)
        .map(([key]) => PLATFORM_LABELS[key])
    : [];

  const hasMeta =
    game.developers.length ||
    game.publishers.length ||
    game.releaseDate ||
    game.website ||
    activePlatforms.length ||
    game.controllerSupport ||
    game.supportedLanguages;

  const hasPcRequirements =
    game.pcRequirements?.minimum || game.pcRequirements?.recommended;

  const detailsContent = hasMeta ? (
    <dl className="space-y-2">
      <MetaRow label="Developer" value={game.developers.join(", ")} />
      <MetaRow label="Publisher" value={game.publishers.join(", ")} />
      <MetaRow label="Release" value={game.releaseDate} />
      <MetaRow label="Website" value={game.website} href={game.website} />
      <MetaRow label="Platforms" value={activePlatforms.join(", ")} />
      <MetaRow
        label="Controller"
        value={CONTROLLER_LABELS[game.controllerSupport]}
      />
      {game.supportedLanguages ? (
        <div className="grid grid-cols-[7rem_1fr] gap-2 text-sm">
          <dt className="text-muted-foreground">Languages</dt>
          <dd className="text-muted-foreground">{game.supportedLanguages}</dd>
        </div>
      ) : null}
    </dl>
  ) : null;

  const pcRequirementsContent = hasPcRequirements ? (
    <div className="grid gap-6">
      <RequirementsColumn label="Minimum" html={game.pcRequirements.minimum} />
      <RequirementsColumn
        label="Recommended"
        html={game.pcRequirements.recommended}
      />
    </div>
  ) : null;

  const detailsAndPcSameRow = hasMeta && hasPcRequirements;
  const loneColumnClass = detailsAndPcSameRow ? "" : "md:col-span-2";

  return (
    <>
      {hasMeta || hasPcRequirements ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-start">
          {hasMeta ? (
            <CollapsibleSection
              title="Details"
              className={`mt-0 ${loneColumnClass}`}
            >
              {detailsContent}
            </CollapsibleSection>
          ) : null}
          {hasPcRequirements ? (
            <CollapsibleSection
              title="PC requirements"
              className={`mt-0 ${loneColumnClass}`}
            >
              {pcRequirementsContent}
            </CollapsibleSection>
          ) : null}
        </div>
      ) : null}

      {game.categories.length ? (
        <DetailSection title="Categories">
          <TagList items={game.categories} />
        </DetailSection>
      ) : null}

      {game.dlc.length ? (
        <CollapsibleSection title="DLC">
          <ul className="space-y-2">
            {game.dlc.map((item) => (
              <li key={item.id} className="text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {item.name}
                </a>
                {item.price ? (
                  <span className="ml-2 text-muted-foreground">{item.price}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      ) : null}
    </>
  );
}
