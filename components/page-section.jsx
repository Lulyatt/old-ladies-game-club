import PageDivider from "@/components/page-divider";

export default function PageSection({
  mobileImage,
  desktopImage,
  children,
  imageAlt = "",
  belowNav = false,
  divider = false,
  snap = true,
  desktopFit = "natural",
  className = "",
}) {
  const snapHeight = belowNav
    ? "max-md:h-[calc(100dvh-var(--nav-height))] md:min-h-dvh"
    : "max-md:h-dvh md:min-h-dvh";

  const snapClass = snap
    ? `${snapHeight} snap-start snap-always snap-stop-always shrink-0`
    : "shrink-0";

  const isNaturalDesktop = desktopFit === "natural";

  return (
    <section
      className={`relative flex flex-col overflow-hidden ${snapClass} ${className}`}
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 md:hidden">
          <img
            src={mobileImage}
            alt={imageAlt}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {isNaturalDesktop ? (
          <>
            <img
              src={desktopImage}
              alt={imageAlt}
              className="hidden w-full md:block"
            />
            {children && (
              <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center max-md:absolute max-md:inset-0 max-md:overflow-hidden md:absolute md:inset-0 md:overflow-hidden md:px-6 md:py-8">
                <div className="w-full min-w-0 max-w-3xl px-3 py-3 md:px-0 md:py-0">
                  {children}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <img
                src={desktopImage}
                alt={imageAlt}
                aria-hidden={!imageAlt}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {children ? (
              <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center max-md:overflow-hidden md:min-h-[75vh] md:overflow-y-auto md:px-6 md:py-8">
                <div className="w-full min-w-0 max-w-3xl px-3 py-3 md:px-0 md:py-0">
                  {children}
                </div>
              </div>
            ) : (
              <div className="relative min-h-0 flex-1 md:min-h-[75vh]" />
            )}
          </>
        )}

        {!children && <div className="relative min-h-0 flex-1 md:hidden" />}
      </div>

      {divider && <PageDivider />}
    </section>
  );
}
