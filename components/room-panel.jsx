export default function RoomPanel({
  image,
  children,
  filterClassName = "",
  desktopBgClassName = "bg-repeat-y",
  className = "",
}) {
  return (
    <section
      className={`relative flex min-h-0 flex-1 flex-col overflow-hidden md:min-h-[calc(100vw*941/1672)] ${className}`}
    >
      <img
        src={image}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover object-top md:hidden ${filterClassName}`}
      />
      <div
        className={`absolute inset-0 hidden bg-[length:100%_auto] bg-top md:block ${desktopBgClassName} ${filterClassName}`}
        style={{ backgroundImage: `url('${image}')` }}
        aria-hidden
      />

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-3 py-3 md:overflow-visible md:px-4 md:py-6">
        <div className="w-full min-w-0 max-w-3xl">{children}</div>
      </div>
    </section>
  );
}
