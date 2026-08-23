export default function SnapScreen({ children, className = "", belowNav = false }) {
  const heightClass = belowNav
    ? "max-md:h-[calc(100dvh-var(--nav-height))]"
    : "max-md:h-dvh";

  return (
    <section
      className={`flex shrink-0 flex-col ${heightClass} max-md:snap-start max-md:snap-always ${className}`}
    >
      {children}
    </section>
  );
}
